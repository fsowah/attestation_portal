import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

const PortalSettings = () => {
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('portal_settings')
        .select('*')
        .order('category');

      if (error) throw error;
      
      const settingsMap = {};
      data?.forEach(s => {
        settingsMap[s.key] = s;
      });
      setSettings(settingsMap);
    } catch (err) {
      console.error('Error fetching portal settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg('');
    try {
      const updates = Object.values(settings).map(s => ({
        id: s.id,
        key: s.key,
        value: s.value,
        category: s.category,
        description: s.description,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('portal_settings')
        .upsert(updates);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        category: 'Config',
        action: 'Portal settings updated',
        actor_name: 'Admin',
      });

      setSuccessMsg('Portal settings saved successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Group settings by category
  const categories = {};
  Object.values(settings).forEach(s => {
    if (!categories[s.category]) categories[s.category] = [];
    categories[s.category].push(s);
  });

  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[22px] font-bold text-[#1e293b]">Portal Settings</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 bg-[#0f172a] hover:bg-black text-white px-4 py-2.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
          {successMsg}
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : Object.keys(settings).length === 0 ? (
          <div className="p-12 text-center text-gray-500">No settings found. Please seed the database.</div>
        ) : (
          <div className="flex flex-col">
            {Object.entries(categories).map(([category, items]) => (
              <div key={category} className="border-b border-gray-100 last:border-b-0 p-8">
                <h2 className="text-[16px] font-bold text-[#1e293b] mb-6 capitalize">{category}</h2>
                <div className="flex flex-col gap-6 max-w-2xl">
                  {items.map(item => (
                    <div key={item.key}>
                      <label className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-bold text-gray-700">{item.description || item.key}</span>
                        {item.value === 'true' || item.value === 'false' ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={item.value === 'true'}
                              onChange={e => handleChange(item.key, e.target.checked ? 'true' : 'false')}
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        ) : null}
                      </label>
                      {item.value !== 'true' && item.value !== 'false' && (
                        <input 
                          type="text"
                          value={item.value}
                          onChange={e => handleChange(item.key, e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-blue-500"
                        />
                      )}
                      <p className="text-[11px] text-gray-400 mt-1.5 font-mono">{item.key}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalSettings;
