import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

const AppointmentBookingForm = ({ onSave, onProgressUpdate, initialData }) => {
  const [selectedDate, setSelectedDate] = useState(initialData?.date || '');
  const [selectedSlot, setSelectedSlot] = useState(initialData ? { time: initialData.time, id: initialData.id } : null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [availableDates, setAvailableDates] = useState(new Set());
  const [currentMonth, setCurrentMonth] = useState(initialData?.date ? new Date(initialData.date) : new Date());

  useEffect(() => {
    const fetchAllAvailableDates = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('appointment_slots')
          .select('date')
          .gte('date', today)
          .eq('is_available', true);
          
        if (!error && data) {
           setAvailableDates(new Set(data.map(d => d.date)));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchAllAvailableDates();
  }, []);

  // Calculate progress
  useEffect(() => {
    let progress = 0;
    if (selectedDate) progress = 50;
    if (selectedSlot) progress = 100;
    
    if (onProgressUpdate) {
      onProgressUpdate(progress);
    }
  }, [selectedDate, selectedSlot, onProgressUpdate]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch available slots for the date
      const { data: slots, error: slotError } = await supabase
        .from('appointment_slots')
        .select('*')
        .eq('date', selectedDate)
        .eq('is_available', true);

      if (slotError) {
        console.error('Slot fetch error:', slotError);
        throw slotError;
      }

      if (!slots || slots.length === 0) {
        setAvailableSlots([]);
        setIsLoading(false);
        return;
      }

      // 2. Fetch booking counts (resiliently)
      const bookingCounts = {};
      try {
        const { data: bookings, error: bookError } = await supabase
          .from('applications')
          .select('appointment_details')
          .eq('appointment_details->>date', selectedDate)
          .not('status', 'eq', 'Rejected');

        if (bookError) {
          // If this fails (e.g. RLS), we'll just proceed with 0 counts for other users
          console.warn('Could not fetch booking counts due to permissions:', bookError);
        } else {
          bookings?.forEach(app => {
            const appTime = app.appointment_details?.time;
            if (appTime) {
              bookingCounts[appTime] = (bookingCounts[appTime] || 0) + 1;
            }
          });
        }
      } catch (bookErr) {
        console.warn('Booking count fetch failed:', bookErr);
      }

      // 3. Process and filter slots
      const processedSlots = slots.map(slot => ({
        ...slot,
        remaining: slot.capacity - (bookingCounts[slot.time] || 0)
      })).filter(slot => slot.remaining > 0);

      setAvailableSlots(processedSlots);
    } catch (err) {
      console.error('Error in fetchAvailableSlots:', err);
      setError('Could not fetch available slots. Please ensure the admin has configured slots for this date.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedSlot) {
      onSave({
        date: selectedDate,
        time: selectedSlot.time,
        id: selectedSlot.id
      });
    }
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const todayStr = new Date().toISOString().split('T')[0];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      // Adjust timezone offset locally
      const localDateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      days.push({
        date: date,
        dateStr: localDateStr,
        dayNumber: i,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isPast: localDateStr < todayStr
      });
    }
    return days;
  };

  return (
    <div className="w-full bg-white animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Select Date</label>
              <div className="flex items-center gap-2">
                <button onClick={handlePrevMonth} className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm font-black text-brand-navy-800 min-w-[120px] text-center">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={handleNextMonth} className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 transition-all"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-[10px] font-bold text-neutral-400 uppercase">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => {
                  if (!day) return <div key={`empty-${index}`} className="p-2" />;
                  
                  const isAvailable = availableDates.has(day.dateStr);
                  const isSelected = selectedDate === day.dateStr;
                  const isDisabled = day.isPast || day.isWeekend || (!isAvailable && !isSelected);

                  return (
                    <button
                      key={day.dateStr}
                      disabled={isDisabled}
                      onClick={() => {
                        setSelectedDate(day.dateStr);
                        setSelectedSlot(null);
                      }}
                      className={`
                        aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all relative
                        ${isSelected ? 'bg-brand-gold-500 text-brand-navy-900 shadow-md transform scale-105 z-10' : ''}
                        ${!isSelected && !isDisabled && isAvailable ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : ''}
                        ${!isSelected && isDisabled ? 'text-neutral-300 cursor-not-allowed' : ''}
                        ${!isSelected && !isDisabled && !isAvailable ? 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100' : ''}
                      `}
                    >
                      {day.dayNumber}
                      {isAvailable && !isSelected && (
                        <div className="absolute bottom-1 w-1 h-1 bg-emerald-400 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6 bg-brand-navy-800 rounded-2xl text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <CalendarIcon className="w-20 h-20" />
             </div>
             <h4 className="text-[10px] font-bold text-brand-gold-500 uppercase tracking-widest mb-4">Selection Summary</h4>
             <div className="flex flex-col gap-3 relative z-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                   <span className="text-xs text-white/40">Date</span>
                   <span className="text-sm font-bold">{selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not selected'}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs text-white/40">Time</span>
                   <span className="text-sm font-bold">{selectedSlot ? selectedSlot.time : 'Select a slot'}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Available Time Slots</label>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-100">
              <Loader2 className="w-8 h-8 text-brand-gold-500 animate-spin" />
              <p className="mt-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Checking capacity...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-800 font-medium leading-relaxed">{error}</p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-100">
               <Clock className="w-10 h-10 text-neutral-200 mb-2" />
               <p className="text-neutral-400 text-xs font-medium">{selectedDate ? 'No available slots for this date' : 'Please select a date first'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col gap-1 items-start group ${
                    selectedSlot?.id === slot.id 
                      ? 'border-brand-gold-500 bg-white ring-2 ring-brand-gold-500/10' 
                      : 'border-neutral-50 bg-[#F9F8F7] hover:border-brand-gold-200'
                  }`}
                >
                  <span className={`text-[15px] font-black ${selectedSlot?.id === slot.id ? 'text-brand-navy-800' : 'text-neutral-500 group-hover:text-brand-navy-800'}`}>
                    {slot.time}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">{slot.remaining} slots left</span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-neutral-50">
            <button
              onClick={handleConfirm}
              disabled={!selectedSlot}
              className={`w-full h-12 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 ${
                selectedSlot 
                  ? 'bg-brand-gold-500 text-brand-navy-800 hover:bg-brand-gold-600' 
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {selectedSlot ? <><CheckCircle className="w-4 h-4" /><span>Confirm Appointment Slot</span></> : 'Confirm Selection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingForm;
