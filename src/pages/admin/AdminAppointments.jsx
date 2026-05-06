import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Users, ChevronLeft, ChevronRight, Plus, Loader2, Check, Trash2, X, Database, Copy, AlertCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const AdminAppointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tableExists, setTableExists] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkStartDate, setBulkStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [bulkEndDate, setBulkEndDate] = useState('');
  const [bulkTimes, setBulkTimes] = useState('08:00, 09:00, 10:00, 11:00, 13:00, 14:00, 15:00');
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);

  const sqlCommand = `CREATE TABLE appointment_slots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL,
  time text NOT NULL,
  capacity integer DEFAULT 20,
  is_available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Realtime
alter publication supabase_realtime add table appointment_slots;`;

  const defaultIntervals = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00'
  ];

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    setIsLoading(true);
    setTableExists(true);
    try {
      const { data: configSlots, error: slotError } = await supabase
        .from('appointment_slots')
        .select('*')
        .eq('date', selectedDate);

      if (slotError) {
        if (slotError.code === '42P01' || slotError.message?.includes('does not exist')) {
          setTableExists(false);
          return;
        }
        throw slotError;
      }

      const { data: bookings, error: bookError } = await supabase
        .from('applications')
        .select('appointment_details')
        .not('status', 'eq', 'Rejected');

      if (bookError) throw bookError;

      const bookingCounts = {};
      bookings?.forEach(app => {
        const appDate = app.appointment_details?.date;
        const appTime = app.appointment_details?.time;
        if (appDate === selectedDate && appTime) {
          bookingCounts[appTime] = (bookingCounts[appTime] || 0) + 1;
        }
      });

      const mergedSlots = (configSlots || []).map(slot => ({
        ...slot,
        count: bookingCounts[slot.time] || 0
      }));

      setSlots(mergedSlots);
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDefaultSlots = async () => {
    setIsSaving(true);
    try {
      const newSlots = defaultIntervals.map(time => ({
        date: selectedDate,
        time,
        capacity: 20,
        is_available: true
      }));

      const { error } = await supabase
        .from('appointment_slots')
        .insert(newSlots);

      if (error) throw error;
      fetchSlots();
    } catch (err) {
      console.error('Error creating slots:', err);
      alert('Could not create slots. Check your database permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSlotAvailability = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('appointment_slots')
        .update({ is_available: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchSlots();
    } catch (err) {
      console.error('Error toggling slot:', err);
    }
  };

  const deleteSlot = async (id) => {
    try {
      const { error } = await supabase
        .from('appointment_slots')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchSlots();
    } catch (err) {
      console.error('Error deleting slot:', err);
    }
  };

  const fetchGhanaHolidays = async (startYear, endYear) => {
    const holidays = new Set();
    try {
      for (let year = startYear; year <= endYear; year++) {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/GH`);
        if (response.ok) {
          const data = await response.json();
          data.forEach(h => holidays.add(h.date));
        }
      }
    } catch (err) {
      console.error('Error fetching holidays', err);
    }
    return holidays;
  };

  const handleBulkGenerate = async () => {
    if (!bulkStartDate || !bulkEndDate) return alert('Please select start and end dates');
    if (new Date(bulkStartDate) > new Date(bulkEndDate)) return alert('Start date must be before end date');
    
    setIsBulkGenerating(true);
    try {
      const startYear = new Date(bulkStartDate).getFullYear();
      const endYear = new Date(bulkEndDate).getFullYear();
      const holidays = await fetchGhanaHolidays(startYear, endYear);

      const timesList = bulkTimes.split(',').map(t => t.trim()).filter(t => t);
      if (timesList.length === 0) {
        alert('Please provide at least one valid time');
        setIsBulkGenerating(false);
        return;
      }
      
      let currentDate = new Date(bulkStartDate);
      const endDateObj = new Date(bulkEndDate);
      
      const allSlotsToInsert = [];
      const datesToClear = [];

      while (currentDate <= endDateObj) {
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
        const dateStr = currentDate.toISOString().split('T')[0];
        
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.has(dateStr)) {
          datesToClear.push(dateStr);
          timesList.forEach(time => {
            allSlotsToInsert.push({
              date: dateStr,
              time,
              capacity: 20,
              is_available: true
            });
          });
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (datesToClear.length > 0) {
        for (let i = 0; i < datesToClear.length; i += 100) {
           const chunk = datesToClear.slice(i, i + 100);
           await supabase.from('appointment_slots').delete().in('date', chunk);
        }
        
        for (let i = 0; i < allSlotsToInsert.length; i += 500) {
           const chunk = allSlotsToInsert.slice(i, i + 500);
           await supabase.from('appointment_slots').insert(chunk);
        }
      }

      setShowBulkModal(false);
      fetchSlots();
      alert(`Successfully generated slots for ${datesToClear.length} working days.`);
    } catch (err) {
      console.error('Bulk generate error:', err);
      alert('Error during bulk generation. Check database permissions.');
    } finally {
      setIsBulkGenerating(false);
    }
  };

  const getStatus = (slot) => {
    if (!slot.is_available) return { label: 'Blocked', style: 'bg-neutral-100 text-neutral-400 border-neutral-200' };
    if (slot.count >= slot.capacity) return { label: 'Full', style: 'bg-red-50 text-red-600 border-red-100' };
    if (slot.count >= slot.capacity * 0.8) return { label: 'Near Capacity', style: 'bg-amber-50 text-amber-600 border-amber-100' };
    return { label: 'Available', style: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  if (!tableExists) {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-fade-in">
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-xl overflow-hidden">
          <div className="p-10 text-center border-b border-neutral-50 bg-neutral-50/30">
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Database className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-black text-brand-navy-800 tracking-tight mb-4">Database Setup Required</h1>
            <p className="text-neutral-500 max-w-lg mx-auto">
              The <code className="bg-neutral-100 px-2 py-0.5 rounded font-bold text-brand-navy-700">appointment_slots</code> table is missing from your database. To enable live appointments, please run the following SQL command in your Supabase SQL Editor.
            </p>
          </div>
          
          <div className="p-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold-500 to-brand-navy-800 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-[#1e1e1e] rounded-xl p-6 font-mono text-sm text-emerald-400 overflow-x-auto shadow-2xl">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">PostgreSQL Command</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(sqlCommand);
                      alert('SQL copied to clipboard!');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Copy Code</span>
                  </button>
                </div>
                <pre>{sqlCommand}</pre>
              </div>
            </div>

            <div className="mt-10 flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black text-blue-900 mb-1 tracking-tight">How to apply this?</h4>
                <ol className="text-[13px] text-blue-800/70 space-y-2 list-decimal ml-4 font-medium">
                  <li>Go to your <strong>Supabase Dashboard</strong></li>
                  <li>Click on <strong>SQL Editor</strong> in the left sidebar</li>
                  <li>Paste the code above and click <strong>Run</strong></li>
                  <li>Refresh this page to start managing appointments</li>
                </ol>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full mt-8 py-4 bg-brand-navy-800 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-brand-navy-800/20"
            >
              I've applied the SQL, Refresh Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-brand-navy-800 tracking-tight">Appointment Manager</h1>
          <p className="text-neutral-500 text-sm mt-1 font-medium">Configure available booking windows for applicants.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 bg-neutral-100 text-brand-navy-800 px-5 py-2.5 rounded-xl text-sm font-black shadow-sm hover:bg-neutral-200 transition-all"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Bulk Generate</span>
          </button>
          <button 
            onClick={handleCreateDefaultSlots}
            disabled={isSaving || slots.length > 0}
            className="flex items-center gap-2 bg-brand-gold-500 text-brand-navy-900 px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-brand-gold-500/10 hover:bg-brand-gold-600 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Initialize Day</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-brand-navy-800 tracking-tight">
              {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
          </div>
          
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-[16px] font-black text-brand-navy-800 outline-none focus:ring-2 focus:ring-brand-gold-500/20 transition-all mb-8 shadow-inner"
          />

          <div className="pt-8 border-t border-neutral-50 space-y-5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400 font-black uppercase tracking-[0.2em]">Active Slots</span>
              <span className="text-brand-navy-800 font-black px-3 py-1 bg-neutral-50 rounded-lg">{slots.filter(s => s.is_available).length} Total</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400 font-black uppercase tracking-[0.2em]">Bookings Today</span>
              <span className="text-emerald-600 font-black px-3 py-1 bg-emerald-50 rounded-lg">{slots.reduce((acc, s) => acc + s.count, 0)} Confirmed</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden min-h-[400px] relative">
          <div className="px-4 lg:px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
            <div className="flex items-center gap-2 min-w-0">
              <CalendarIcon className="w-5 h-5 text-brand-gold-600 shrink-0" />
              <h2 className="font-black text-brand-navy-800 tracking-tight text-base lg:text-lg truncate">
                {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </h2>
            </div>
            {isLoading && <Loader2 className="w-6 h-6 text-brand-gold-500 animate-spin" />}
          </div>

          <div className="divide-y divide-neutral-50">
            {slots.map((slot) => {
              const status = getStatus(slot);
              return (
                <div key={slot.id} className="px-3 lg:px-5 py-3 flex items-center justify-between hover:bg-neutral-50/30 transition-colors group">
                  <div className="flex items-center gap-3 lg:gap-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${slot.is_available ? 'bg-brand-navy-50 text-brand-navy-600' : 'bg-neutral-100 text-neutral-400'}`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-brand-navy-800 text-sm lg:text-base">{slot.time}</span>
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest hidden sm:block">GMT Standard</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100">
                      <Users className="w-3.5 h-3.5 opacity-40" />
                      <span className="text-xs font-black">{slot.count}/{slot.capacity} <span className="opacity-40 uppercase tracking-tighter">Booked</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${status.style}`}>
                      {status.label}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                      <button 
                        onClick={() => toggleSlotAvailability(slot.id, slot.is_available)}
                        className={`p-2.5 rounded-xl transition-all shadow-sm ${slot.is_available ? 'text-amber-500 bg-amber-50 hover:bg-amber-100 border border-amber-100' : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100'}`}
                        title={slot.is_available ? "Block Slot" : "Unblock Slot"}
                      >
                        {slot.is_available ? <X className="w-5 h-5" strokeWidth={3} /> : <Check className="w-5 h-5" strokeWidth={3} />}
                      </button>
                      <button 
                        onClick={() => deleteSlot(slot.id)}
                        className="p-2.5 text-red-400 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all shadow-sm"
                        title="Remove Slot"
                      >
                        <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {!isLoading && slots.length === 0 && (
              <div className="p-20 text-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-24 h-24 bg-neutral-50 rounded-3xl flex items-center justify-center border border-dashed border-neutral-200">
                    <CalendarIcon className="w-10 h-10 text-neutral-200" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <h3 className="text-xl font-black text-brand-navy-800 tracking-tight">No slots defined</h3>
                    <p className="text-sm text-neutral-400 mt-2 font-medium">Use the "Initialize Day" button above to create default booking intervals for this date.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setShowBulkModal(false)}
              className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-brand-navy-800 hover:bg-neutral-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-navy-50 rounded-2xl flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-brand-navy-800" />
              </div>
              <div>
                <h3 className="text-xl font-black text-brand-navy-800 tracking-tight">Bulk Generate Slots</h3>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Skip weekends & holidays</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Start Date</label>
                  <input 
                    type="date"
                    value={bulkStartDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBulkStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-black outline-none focus:border-brand-gold-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">End Date</label>
                  <input 
                    type="date"
                    value={bulkEndDate}
                    min={bulkStartDate}
                    onChange={(e) => setBulkEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-black outline-none focus:border-brand-gold-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Timeslots (comma separated)</label>
                <textarea 
                  value={bulkTimes}
                  onChange={(e) => setBulkTimes(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-black outline-none focus:border-brand-gold-500 min-h-[100px] resize-none"
                  placeholder="08:00, 09:00, 10:00"
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-xs font-medium text-amber-800 leading-relaxed">
                  Generating slots will <strong>override</strong> any existing slots for the selected dates. Saturdays, Sundays, and Ghana public holidays are skipped.
                </p>
              </div>

              <button 
                onClick={handleBulkGenerate}
                disabled={isBulkGenerating}
                className="w-full py-4 bg-brand-navy-800 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                {isBulkGenerating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /><span>Generating...</span></>
                ) : (
                  <span>Generate Slots</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
