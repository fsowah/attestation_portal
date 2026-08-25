import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import EditSlotDrawer from './components/EditSlotDrawer';
import WeekView from './components/WeekView';
import MonthView from './components/MonthView';

const SlotConfiguration = () => {
  const [view, setView] = useState('Week');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [blackoutDates, setBlackoutDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [initialAddDate, setInitialAddDate] = useState(null);
  const [initialAddTime, setInitialAddTime] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Calculate date ranges
  const getWeekRange = useCallback(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(today.getDate() + diffToMon + weekOffset * 7);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999);
    return { start: monday, end: friday };
  }, [weekOffset]);

  const getMonthRange = useCallback(() => {
    const today = new Date();
    const first = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const last = new Date(today.getFullYear(), today.getMonth() + monthOffset + 1, 0);
    return { start: first, end: last, month: first };
  }, [monthOffset]);

  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    try {
      let startDate, endDate;
      if (view === 'Week') {
        const range = getWeekRange();
        startDate = formatDate(range.start);
        endDate = formatDate(range.end);
      } else {
        const range = getMonthRange();
        startDate = formatDate(range.start);
        endDate = formatDate(range.end);
      }

      const { data, error } = await supabase
        .from('appointment_slots')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      setSlots(data || []);

      // Also fetch blackout dates for the range
      const { data: blackouts } = await supabase
        .from('blackout_dates')
        .select('date')
        .gte('date', startDate)
        .lte('date', endDate);

      setBlackoutDates((blackouts || []).map(b => b.date));
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setIsLoading(false);
    }
  }, [view, getWeekRange, getMonthRange]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Transform DB slots into the format WeekView expects
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri'];
  const getWeekSlots = () => {
    const weekDays = getWeekDays();
    const weekSlots = [];

    slots.forEach(slot => {
      const dayObj = weekDays.find(d => d.date === slot.date);
      if (!dayObj) return;

      weekSlots.push({
        id: slot.id,
        day: dayObj.label,
        time: slot.time,
        cap: slot.capacity,
        status: slot.is_available ? 'open' : 'blackout',
        tier: slot.tier || 'Express + Standard',
        note: slot.note,
        date: slot.date,
        dbSlot: slot
      });
    });

    // Add blackout placeholders for dates with no slots
    weekDays.forEach((dayObj) => {
      const dateStr = dayObj.date;
      if (blackoutDates.includes(dateStr)) {
        const hasSlotForDay = weekSlots.some(s => s.date === dateStr);
        if (!hasSlotForDay) {
          weekSlots.push({
            id: `blackout-${dateStr}`,
            day: dayObj.label,
            time: '9:00 AM',
            status: 'blackout',
            note: 'Blackout date',
            date: dateStr
          });
        }
      }
    });

    return weekSlots;
  };

  // Transform DB slots into the format MonthView expects
  const getMonthSlots = () => {
    const grouped = {};
    slots.forEach(slot => {
      const dateStr = slot.date;
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push({
        time: slot.time,
        status: slot.is_available ? 'open' : 'blackout',
        id: slot.id,
        dbSlot: slot
      });
    });

    return Object.entries(grouped).map(([dateStr, daySlots]) => {
      const extra = daySlots.length > 3 ? `+${daySlots.length - 3}` : undefined;
      return {
        dateStr,
        slots: daySlots.slice(0, 3),
        extra
      };
    });
  };

  const getWeekDays = () => {
    const range = getWeekRange();
    const days = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(range.start);
      d.setDate(range.start.getDate() + i);
      const dayLabel = `${dayLabels[i]} ${d.getDate()}`;
      days.push({
        label: dayLabel,
        date: formatDate(d)
      });
    }
    return days;
  };

  const getMonthGrid = () => {
    const range = getMonthRange();
    const firstDay = range.start.getDay();
    let startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const grid = [];
    const prevMonthLastDate = new Date(range.start);
    prevMonthLastDate.setDate(0);
    for (let i = startOffset - 1; i >= 0; i--) {
      grid.push({
        dateStr: formatDate(new Date(prevMonthLastDate.getFullYear(), prevMonthLastDate.getMonth(), prevMonthLastDate.getDate() - i)),
        date: prevMonthLastDate.getDate() - i,
        currentMonth: false
      });
    }

    const daysInMonth = range.end.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({
        dateStr: formatDate(new Date(range.start.getFullYear(), range.start.getMonth(), i)),
        date: i,
        currentMonth: true
      });
    }

    let nextMonthDay = 1;
    while (grid.length % 7 !== 0) {
      grid.push({
        dateStr: formatDate(new Date(range.end.getFullYear(), range.end.getMonth() + 1, nextMonthDay)),
        date: nextMonthDay,
        currentMonth: false
      });
      nextMonthDay++;
    }

    return grid;
  };

  const handleAddSlot = (initialDate = null, initialTime = null) => {
    setSelectedSlot(null);
    setInitialAddDate(typeof initialDate === 'string' ? initialDate : null);
    setInitialAddTime(typeof initialTime === 'string' ? initialTime : null);
    setDrawerOpen(true);
  };

  const handleEditSlot = (slot) => {
    setSelectedSlot(slot.dbSlot || slot);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedSlot(null);
  };

  const handleSlotSaved = () => {
    handleDrawerClose();
    fetchSlots();
    showToast('Slot configuration saved successfully!');
  };

  // Date range labels
  const getDateLabel = () => {
    if (view === 'Week') {
      const range = getWeekRange();
      const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${fmt(range.start)} - ${fmt(range.end)}`;
    } else {
      const range = getMonthRange();
      return range.month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  const handlePrev = () => {
    if (view === 'Week') setWeekOffset(w => w - 1);
    else setMonthOffset(m => m - 1);
  };

  const handleNext = () => {
    if (view === 'Week') setWeekOffset(w => w + 1);
    else setMonthOffset(m => m + 1);
  };

  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[22px] font-bold text-[#1e293b]">Slot configuration</h1>
        <button 
          onClick={handleAddSlot}
          className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#0f172a] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add slot
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
        
        {/* Controls Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            
            {/* Navigation + Date Range */}
            <div className="flex items-center gap-2">
              <button onClick={handlePrev} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-400 hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 bg-[#f1f5f9] px-3 py-1.5 rounded-md text-sm font-medium text-[#475569] border border-gray-200">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span>{getDateLabel()}</span>
              </div>
              <button onClick={handleNext} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-400 hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex bg-[#f1f5f9] p-1 rounded-md border border-gray-200">
              <button 
                onClick={() => setView('Week')}
                className={`px-4 py-1 rounded-[4px] text-[13px] font-bold transition-all ${view === 'Week' ? 'bg-white shadow-sm text-[#1e293b]' : 'text-[#64748b] hover:text-[#475569]'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setView('Month')}
                className={`px-4 py-1 rounded-[4px] text-[13px] font-bold transition-all ${view === 'Month' ? 'bg-white shadow-sm text-[#1e293b]' : 'text-[#64748b] hover:text-[#475569]'}`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-[4px] border border-green-500 bg-green-50"></div>
              Open
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-[4px] border border-red-200 bg-[#ffebee]"></div>
              Blackout
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e293b]"></div>
          </div>
        ) : (
          <>
            {/* Dynamic View Rendering */}
            {view === 'Week' ? (
              <WeekView slots={getWeekSlots()} days={getWeekDays()} onSlotClick={handleEditSlot} onEmptyClick={handleAddSlot} />
            ) : (
              <MonthView slots={getMonthSlots()} calendarGrid={getMonthGrid()} onSlotClick={handleEditSlot} onEmptyClick={handleAddSlot} />
            )}
          </>
        )}
      </div>

      {/* Drawer */}
      <EditSlotDrawer 
        isOpen={drawerOpen} 
        onClose={handleDrawerClose} 
        slotData={selectedSlot}
        onSaved={handleSlotSaved}
        initialAddDate={initialAddDate}
        initialAddTime={initialAddTime}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-[14px] font-bold animate-in fade-in slide-in-from-bottom-4 duration-300 ${toast.type === 'success' ? 'bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]' : 'bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca]'}`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default SlotConfiguration;
