import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

const SmsNotifications = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sms_templates')
        .select('*')
        .order('event_type');

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching SMS templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    setTemplates(prev => {
      const newTemplates = [...prev];
      newTemplates[index] = { ...newTemplates[index], [field]: value };
      return newTemplates;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg('');
    try {
      const { error } = await supabase
        .from('sms_templates')
        .upsert(templates.map(t => ({
          id: t.id,
          event_type: t.event_type,
          message_template: t.message_template,
          is_active: t.is_active,
          updated_at: new Date().toISOString()
        })));

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        category: 'Config',
        action: 'SMS templates updated',
        actor_name: 'Admin',
      });

      setSuccessMsg('SMS templates saved successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving templates:', err);
      alert('Failed to save: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const availableVariables = [
    { label: 'Application ID', value: '{{app_id}}' },
    { label: 'Full Name', value: '{{full_name}}' },
    { label: 'Date', value: '{{date}}' },
    { label: 'Time', value: '{{time}}' },
    { label: 'Location', value: '{{location}}' },
  ];

  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[22px] font-bold text-[#1e293b]">SMS Notifications</h1>
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
        ) : templates.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No SMS templates found. Please seed the database.</div>
        ) : (
          <div className="p-6 flex flex-col gap-6">
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg">
              <h3 className="text-[13px] font-bold text-blue-800 mb-2">Available Variables</h3>
              <div className="flex flex-wrap gap-2">
                {availableVariables.map(v => (
                  <span key={v.value} className="bg-white border border-blue-200 text-blue-700 text-[11px] font-bold px-2 py-1 rounded">
                    {v.value} <span className="font-normal text-gray-400">- {v.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {templates.map((template, idx) => (
              <div key={template.id} className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[13px] font-bold text-gray-700">
                    {template.event_type}
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={template.is_active} 
                      onChange={e => handleChange(idx, 'is_active', e.target.checked)}
                      className="rounded text-blue-600 w-4 h-4"
                    />
                    <span className="text-[13px] font-medium text-gray-600">Active</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">Message Template</label>
                  <textarea 
                    value={template.message_template}
                    onChange={e => handleChange(idx, 'message_template', e.target.value)}
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded-lg p-4 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <div className="mt-2 text-[11px] text-gray-500 flex justify-end">
                    {template.message_template.length} characters ({(Math.ceil(template.message_template.length / 160) || 1)} SMS)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmsNotifications;
