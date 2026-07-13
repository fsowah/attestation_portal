import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

const FeesAndTiers = () => {
  const [fees, setFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('fees_config')
        .select('*')
        .order('tier');

      if (error) throw error;
      setFees(data || []);
    } catch (err) {
      console.error('Error fetching fees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    setFees(prev => {
      const newFees = [...prev];
      newFees[index] = { ...newFees[index], [field]: value };
      return newFees;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg('');
    try {
      const { error } = await supabase
        .from('fees_config')
        .upsert(fees.map(f => ({
          id: f.id,
          tier: f.tier,
          price_ghs: parseFloat(f.price_ghs) || 0,
          turnaround_days: parseInt(f.turnaround_days) || 0,
          is_active: f.is_active,
          updated_at: new Date().toISOString()
        })));

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        category: 'Config',
        action: 'Fees and tiers updated',
        actor_name: 'Admin',
      });

      setSuccessMsg('Fees configuration saved successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving fees:', err);
      alert('Failed to save: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[22px] font-bold text-[#1e293b]">Fees & Tiers Configuration</h1>
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
        ) : fees.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No fee configurations found. Please seed the database.</div>
        ) : (
          <div className="p-6 flex flex-col gap-6">
            {fees.map((fee, idx) => (
              <div key={fee.id} className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      fee.tier.toLowerCase().includes('express') ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {fee.tier} Tier
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={fee.is_active} 
                      onChange={e => handleChange(idx, 'is_active', e.target.checked)}
                      className="rounded text-blue-600 w-4 h-4"
                    />
                    <span className="text-[13px] font-medium text-gray-600">Active</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">Price (GHS)</label>
                    <input 
                      type="number"
                      value={fee.price_ghs}
                      onChange={e => handleChange(idx, 'price_ghs', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] font-medium text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">Turnaround Time (Days)</label>
                    <input 
                      type="number"
                      value={fee.turnaround_days}
                      onChange={e => handleChange(idx, 'turnaround_days', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] font-medium text-gray-700 focus:outline-none focus:border-blue-500"
                    />
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

export default FeesAndTiers;
