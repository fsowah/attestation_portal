import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import EditSlotDrawer from './components/EditSlotDrawer';
import WeekView from './components/WeekView';
import MonthView from './components/MonthView';

const SlotConfiguration = () => {
  const [view, setView] = useState('Week'); // 'Week' or 'Month'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Hardcoded mock data based on Figma design
  const weekSlots = [
    { id: 1, day: 'Mon 18', time: '9:00 AM', cap: 5, status: 'open', tier: 'Express + Standard' },
    { id: 2, day: 'Tue 19', time: '9:00 AM', cap: 5, status: 'open', tier: 'Standard only' },
    { id: 3, day: 'Wed 20', time: '9:00 AM', cap: 5, status: 'open', tier: 'Express + Standard' },
    { id: 4, day: 'Thur 21', time: '9:00 AM', cap: 5, status: 'open', tier: 'Express + Standard' },
    { id: 5, day: 'Fri 22', time: '9:00 AM', status: 'blackout', note: 'No bookings' },
    { id: 6, day: 'Wed 20', time: '10:00 AM', cap: 5, status: 'open', tier: 'Standard only' },
    { id: 7, day: 'Thur 21', time: '10:00 AM', cap: 5, status: 'open', tier: 'Standard only' },
    { id: 8, day: 'Fri 22', time: '10:00 AM', cap: 5, status: 'open', tier: 'Express only' },
    { id: 9, day: 'Mon 18', time: '12:00 PM', status: 'blackout', note: 'No bookings' },
    { id: 10, day: 'Tue 19', time: '12:00 PM', status: 'blackout', note: 'No bookings' },
    { id: 11, day: 'Wed 20', time: '12:00 PM', status: 'blackout', note: 'No bookings' },
    { id: 12, day: 'Thur 21', time: '12:00 PM', status: 'blackout', note: 'No bookings' },
    { id: 13, day: 'Fri 22', time: '12:00 PM', status: 'blackout', note: 'No bookings' },
  ];

  const monthSlots = [
    { date: 4, slots: [{ time: '9:00 AM', status: 'open' }, { time: '10:00 AM', status: 'open' }, { time: '2:00 PM', status: 'open' }], extra: '+2' },
    { date: 5, slots: [{ time: '9:00 AM', status: 'open' }, { time: '11:00 AM', status: 'open' }, { time: '2:00 PM', status: 'open' }] },
    { date: 6, slots: [{ time: '9:00 AM', status: 'open' }, { time: '10:00 AM', status: 'open' }, { time: '2:00 PM', status: 'open' }], extra: '+1' },
    { date: 7, slots: [{ time: '9:00 AM', status: 'open' }, { time: '10:00 AM', status: 'open' }, { time: '2:00 PM', status: 'open' }] },
    { date: 8, slots: [{ time: '9:00 AM', status: 'open' }, { time: '10:00 AM', status: 'open' }, { time: '2:00 PM', status: 'open' }] },
    
    { date: 11, slots: [{ time: '9:00 AM', status: 'open' }, { time: '10:00 AM', status: 'open' }, { time: '2:00 PM', status: 'open' }], extra: '+2' },
    { date: 12, slots: [{ time: '9:00 AM', status: 'blackout' }, { time: '10:00 AM', status: 'blackout' }] },
    { date: 13, slots: [{ time: '9:00 AM', status: 'open' }, { time: '2:00 PM', status: 'open' }, { time: '4:00 PM', status: 'open' }] },
    { date: 14, slots: [{ time: '9:00 AM', status: 'open' }, { time: '10:00 AM', status: 'open' }, { time: '2:00 PM', status: 'open' }], extra: '+2' },
    { date: 15, slots: [{ time: '9:00 AM', status: 'open' }, { time: '10:00 AM', status: 'open' }] },

    { date: 18, slots: [{ time: '9:00 AM', status: 'open' }, { time: '10:00 AM', status: 'open' }, { time: '2:00 PM', status: 'open' }], extra: '+2' },
    { date: 19, slots: [{ time: '9:00 AM', status: 'blackout' }, { time: '10:00 AM', status: 'blackout' }] },
    { date: 20, slots: [{ time: '9:00 AM', status: 'blackout' }, { time: '10:00 AM', status: 'blackout' }] },
    { date: 21, slots: [{ time: '9:00 AM', status: 'blackout' }, { time: '10:00 AM', status: 'blackout' }] },
    { date: 22, slots: [{ time: '9:00 AM', status: 'blackout' }, { time: '10:00 AM', status: 'blackout' }] },
  ];

  const handleAddSlot = () => {
    setSelectedSlot(null);
    setDrawerOpen(true);
  };

  const handleEditSlot = (slot) => {
    setSelectedSlot(slot);
    setDrawerOpen(true);
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
            
            {/* Date Range/Picker */}
            <div className="flex items-center gap-2 bg-[#f1f5f9] px-3 py-1.5 rounded-md text-sm font-medium text-[#475569] border border-gray-200">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span>{view === 'Week' ? 'May 18 2026 - May 22 2026' : 'May 2026'}</span>
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

        {/* Dynamic View Rendering */}
        {view === 'Week' ? (
          <WeekView slots={weekSlots} onSlotClick={handleEditSlot} onEmptyClick={handleAddSlot} />
        ) : (
          <MonthView slots={monthSlots} onSlotClick={handleEditSlot} onEmptyClick={handleAddSlot} />
        )}

      </div>

      {/* Drawer */}
      <EditSlotDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        slotData={selectedSlot}
      />
    </div>
  );
};

export default SlotConfiguration;
