import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, ChevronDown, Check, Loader2 } from 'lucide-react';
import { supabase } from '../../../../supabaseClient';

const AddBlackoutModal = ({ isOpen, onClose, onSaved }) => {
  const [date, setDate] = useState('');
  const [type, setType] = useState('Public holiday');
  const [reason, setReason] = useState('');
  const [blockBookings, setBlockBookings] = useState(true);
  const [cancelExisting, setCancelExisting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Reset on open/close
  useEffect(() => {
    if (!isOpen) {
      setDate('');
      setType('Public holiday');
      setReason('');
      setBlockBookings(true);
      setCancelExisting(false);
      setError(null);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!date || !reason) {
      setError('Please fill in the date and reason.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('blackout_dates')
        .insert({
          date,
          reason,
          type,
          block_bookings: blockBookings,
          cancel_existing: cancelExisting,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('A blackout date already exists for this date.');
        }
        throw insertError;
      }

      // If blocking bookings, also mark any existing slots as unavailable
      if (blockBookings) {
        await supabase
          .from('appointment_slots')
          .update({ is_available: false })
          .eq('date', date);
      }

      // Log audit
      await supabase.from('audit_logs').insert({
        category: 'Config',
        action: `Blackout date added: ${date} - ${reason}`,
        actor_name: 'Admin',
      });

      onSaved?.();
    } catch (err) {
      console.error('Error adding blackout date:', err);
      setError(err.message || 'Failed to add blackout date');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        
        <div className={`bg-white w-[500px] rounded-xl shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          
          {/* Header */}
          <div className="flex justify-between items-center p-6 pb-4">
            <h2 className="text-[18px] font-bold text-[#1e293b]">Add blackout date</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Form Content */}
          <div className="px-6 pb-6 flex flex-col gap-6">

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}
            
            {/* Top Row: Date and Type */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2 tracking-wider">Date</label>
                <input 
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 h-[42px] text-[13px] font-medium text-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2 tracking-wider">Type</label>
                <div className="relative">
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 h-[42px] text-[13px] font-medium text-gray-600 focus:outline-none"
                  >
                    <option value="Public holiday">Public holiday</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Custom">Custom</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2 tracking-wider">Reason (Shown to citizens)</label>
              <input 
                type="text" 
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Independence Day - Public holiday" 
                className="w-full bg-white border border-gray-200 rounded-lg px-4 h-[42px] text-[13px] font-medium text-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Affected Areas (Checkboxes) */}
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-3 tracking-wider">Affected Areas</label>
              
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setBlockBookings(!blockBookings)}>
                  <div className={`w-4 h-4 border rounded-[4px] flex items-center justify-center transition-colors ${blockBookings ? 'bg-[#1e293b] border-[#1e293b]' : 'border-gray-300 bg-gray-50 group-hover:border-gray-400'}`}>
                    {blockBookings && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-[13px] font-medium text-gray-600">Block all new appointment bookings</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setCancelExisting(!cancelExisting)}>
                  <div className={`w-4 h-4 border rounded-[4px] flex items-center justify-center transition-colors ${cancelExisting ? 'bg-[#1e293b] border-[#1e293b]' : 'border-gray-300 bg-gray-50 group-hover:border-gray-400'}`}>
                    {cancelExisting && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-[13px] font-medium text-gray-600">Cancel existing appointments on this date</span>
                </label>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-6 pt-0 flex justify-end gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-[#e11d48] text-[#e11d48] text-[13px] font-bold hover:bg-[#fff1f2] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white text-[13px] font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Add blackout date
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AddBlackoutModal;
