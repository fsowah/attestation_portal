import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar as CalendarIcon, Clock, AlertTriangle, ChevronUp, Plus, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../../../../supabaseClient';

const EditSlotDrawer = ({ isOpen, onClose, slotData, onSaved }) => {
  const isEditMode = !!slotData;

  // Add mode state
  const [addDate, setAddDate] = useState('');
  const [addSlots, setAddSlots] = useState([{ time: '9:00 AM', capacity: 5 }]);
  const [addTier, setAddTier] = useState('Standard + Express');
  const [addNote, setAddNote] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [repeatType, setRepeatType] = useState('none');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [expressEnabled, setExpressEnabled] = useState(true);
  const [standardEnabled, setStandardEnabled] = useState(true);

  // Edit mode state
  const [editCapacity, setEditCapacity] = useState(5);
  const [editTier, setEditTier] = useState('Standard + Express');
  const [editAvailable, setEditAvailable] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const timeOptions = [
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM'
  ];

  // Populate edit state when slotData changes
  useEffect(() => {
    if (slotData) {
      setEditCapacity(slotData.capacity || 5);
      setEditTier(slotData.tier || 'Standard + Express');
      setEditAvailable(slotData.is_available !== false);
    } else {
      // Reset add state
      setAddDate('');
      setAddSlots([{ time: '9:00 AM', capacity: 5 }]);
      setAddTier('Standard + Express');
      setAddNote('');
      setSelectedDays([]);
      setRepeatType('none');
      setFromDate('');
      setToDate('');
      setExpressEnabled(true);
      setStandardEnabled(true);
    }
    setError(null);
  }, [slotData, isOpen]);

  const computeTier = () => {
    if (expressEnabled && standardEnabled) return 'Standard + Express';
    if (expressEnabled) return 'Express only';
    if (standardEnabled) return 'Standard only';
    return 'Standard + Express';
  };

  const handleAddSlotRow = () => {
    setAddSlots(prev => [...prev, { time: '9:00 AM', capacity: 5 }]);
  };

  const handleRemoveSlotRow = (idx) => {
    setAddSlots(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSlotChange = (idx, field, value) => {
    setAddSlots(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Generate dates for the selected days within from-to range
  const generateDates = () => {
    if (!fromDate || !toDate) return [fromDate || addDate].filter(Boolean);
    
    const dates = [];
    const dayMap = { 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5 };
    const start = new Date(fromDate);
    const end = new Date(toDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const jsDay = d.getDay(); // 0=Sun, 1=Mon, ...
      const matchesDays = selectedDays.length === 0 || 
        selectedDays.some(day => dayMap[day] === jsDay);
      if (matchesDays && jsDay >= 1 && jsDay <= 5) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        dates.push(`${year}-${month}-${day}`);
      }
    }
    return dates;
  };

  // SAVE: Create new slots
  const handleCreate = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const tier = computeTier();
      const dates = generateDates();

      if (dates.length === 0) {
        setError('Please select at least one date.');
        setIsSaving(false);
        return;
      }

      const rows = [];
      for (const date of dates) {
        for (const slot of addSlots) {
          rows.push({
            date,
            time: slot.time,
            capacity: parseInt(slot.capacity) || 5,
            is_available: true,
            tier,
            note: addNote || null,
          });
        }
      }

      const { error: insertError } = await supabase
        .from('appointment_slots')
        .upsert(rows, { onConflict: 'date,time' });

      if (insertError) throw insertError;

      // Log audit entry
      await supabase.from('audit_logs').insert({
        category: 'Config',
        action: `Appointment slots created: ${dates.length} date(s) x ${addSlots.length} slot(s)`,
        actor_name: 'Admin',
        reference_id: '',
      });

      onSaved?.();
    } catch (err) {
      console.error('Error creating slots:', err);
      setError(err.message || 'Failed to create slots');
    } finally {
      setIsSaving(false);
    }
  };

  // SAVE: Update existing slot
  const handleUpdate = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('appointment_slots')
        .update({
          capacity: parseInt(editCapacity) || 5,
          tier: editTier,
          is_available: editAvailable,
          updated_at: new Date().toISOString(),
        })
        .eq('id', slotData.id);

      if (updateError) throw updateError;

      onSaved?.();
    } catch (err) {
      console.error('Error updating slot:', err);
      setError(err.message || 'Failed to update slot');
    } finally {
      setIsSaving(false);
    }
  };

  // DELETE slot
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    setIsSaving(true);
    try {
      const { error: delError } = await supabase
        .from('appointment_slots')
        .delete()
        .eq('id', slotData.id);

      if (delError) throw delError;
      onSaved?.();
    } catch (err) {
      console.error('Error deleting slot:', err);
      setError(err.message || 'Failed to delete slot');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    if (isEditMode) handleUpdate();
    else handleCreate();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[450px] bg-[#f8fafc] shadow-2xl z-50 flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-5 shrink-0 flex justify-between items-start">
          <div>
            <h2 className="text-[20px] font-bold text-[#1e293b] mb-1">
              {isEditMode ? 'Edit Slot' : 'Add Slots'}
            </h2>
            <p className="text-[13px] font-medium text-gray-400">
              {isEditMode 
                ? `Date: ${slotData?.date}  ${slotData?.time}`
                : 'Create new appointment slots'
              }
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 font-medium">
              {error}
            </div>
          )}
          
          {isEditMode ? (
            /* ── EDIT MODE ── */
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-[12px] font-bold text-[#1e293b] mb-4">Slot Details</h3>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">Capacity</label>
                    <div className="flex items-center border border-gray-200 rounded-lg h-[40px] w-[100px] bg-white overflow-hidden">
                      <input 
                        type="number"
                        min="1"
                        value={editCapacity} 
                        onChange={e => setEditCapacity(e.target.value)}
                        className="w-full h-full text-center text-[14px] font-medium text-[#1e293b] focus:outline-none" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">Tier</label>
                    <div className="relative">
                      <select 
                        value={editTier} 
                        onChange={e => setEditTier(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] font-medium text-gray-600 focus:outline-none"
                      >
                        <option value="Standard + Express">Standard + Express</option>
                        <option value="Standard only">Standard only</option>
                        <option value="Express only">Express only</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[13px] font-medium text-gray-600">Available for booking</span>
                    <button
                      onClick={() => setEditAvailable(!editAvailable)}
                      className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors cursor-pointer ${editAvailable ? 'bg-yellow-400 justify-end' : 'bg-gray-300 justify-start'}`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Zone */}
              <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-xl p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#e11d48] font-bold text-[14px] mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    Delete this slot
                  </div>
                  <p className="text-[10px] font-medium text-[#fb7185]">This will permanently remove this time slot.</p>
                </div>
                <button 
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="bg-[#e11d48] hover:bg-[#be123c] text-white px-4 py-2.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            /* ── ADD MODE ── */
            <>
              {/* Time Slots Section */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-[12px] font-bold text-gray-500 mb-4">Time Slots</h3>
                
                <div className="flex gap-4 mb-3">
                  <div className="flex-[2] text-[9px] font-bold text-gray-700 uppercase tracking-wider">Start Time</div>
                  <div className="flex-1 text-[9px] font-bold text-gray-700 uppercase tracking-wider">Capacity</div>
                  <div className="w-8"></div>
                </div>

                {addSlots.map((slot, idx) => (
                  <div key={idx} className="flex gap-4 items-center mb-3">
                    <div className="flex-[2] relative">
                      <select 
                        value={slot.time}
                        onChange={e => handleSlotChange(idx, 'time', e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-600 focus:outline-none"
                      >
                        {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                    <div className="flex-1">
                      <input 
                        type="number" 
                        min="1"
                        value={slot.capacity} 
                        onChange={e => handleSlotChange(idx, 'capacity', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-600 focus:outline-none text-center" 
                      />
                    </div>
                    <div className="w-8 flex justify-center">
                      {addSlots.length > 1 && (
                        <button onClick={() => handleRemoveSlotRow(idx)} className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50">
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button 
                  onClick={handleAddSlotRow}
                  className="w-full mt-2 bg-white border border-gray-200 rounded-lg py-2.5 text-[13px] font-bold text-[#475569] hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add slot
                </button>
              </div>

              {/* Apply To Section */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-[12px] font-bold text-gray-500 mb-4">Apply To</h3>
                
                {/* Days Toggle */}
                <div className="flex gap-2 mb-5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                    <button 
                      key={day} 
                      onClick={() => toggleDay(day)}
                      className={`flex-1 py-2 rounded-md text-[13px] font-bold border transition-colors ${
                        selectedDays.includes(day) 
                          ? 'bg-[#0f172a] border-[#0f172a] text-white' 
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* From / To */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">From</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={e => setFromDate(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-600 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">To</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={e => setToDate(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tiers Allowed Section */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-[12px] font-bold text-gray-500 mb-4">Tiers Allowed</h3>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#f3e8ff] text-[#9333ea] px-3 py-1 rounded-full text-[11px] font-bold">Express</div>
                    <div>
                      <div className="text-[14px] font-bold text-[#1e293b]">Express Tier</div>
                      <div className="text-[11px] font-medium text-gray-400">Priority GHS 450 per document</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpressEnabled(!expressEnabled)}
                    className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors cursor-pointer ${expressEnabled ? 'bg-yellow-400 justify-end' : 'bg-gray-300 justify-start'}`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#e0e7ff] text-[#4f46e5] px-3 py-1 rounded-full text-[11px] font-bold">Standard</div>
                    <div>
                      <div className="text-[14px] font-bold text-[#1e293b]">Standard Tier</div>
                      <div className="text-[11px] font-medium text-gray-400">Regular GHS 200 per document</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setStandardEnabled(!standardEnabled)}
                    className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors cursor-pointer ${standardEnabled ? 'bg-yellow-400 justify-end' : 'bg-gray-300 justify-start'}`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </button>
                </div>
              </div>

              {/* Internal Note Section */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-[12px] font-bold text-gray-500 mb-4">Internal Note</h3>
                <textarea 
                  value={addNote}
                  onChange={e => setAddNote(e.target.value)}
                  placeholder="e.g Reduced capacity, maintenance day"
                  className="w-full min-h-[80px] border border-gray-200 rounded-lg p-4 text-[13px] text-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                ></textarea>
              </div>
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-100 px-6 py-5 shrink-0 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-[#e11d48] text-[#e11d48] text-[13px] font-bold hover:bg-[#fff1f2] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-[#0f172a] hover:bg-black text-white text-[13px] font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditMode ? 'Save changes' : 'Create slots'}
          </button>
        </div>

      </div>
    </>
  );
};

export default EditSlotDrawer;
