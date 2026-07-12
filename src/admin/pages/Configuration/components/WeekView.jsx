import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const WeekView = ({ slots, onSlotClick, onEmptyClick }) => {
  const days = ['Mon 18', 'Tue 19', 'Wed 20', 'Thur 21', 'Fri 22'];
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];

  // Helper to find a slot for a specific day and time
  const getSlot = (day, time) => {
    return slots.find(s => s.day === day && s.time === time);
  };

  return (
    <div className="w-full">
      {/* Week Grid Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-[100px] flex justify-end pr-4">
          <div className="flex items-center justify-center border border-gray-200 rounded-md w-8 h-8 cursor-pointer hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-5 border-l border-t border-r border-gray-100 bg-[#f8fafc] rounded-t-lg">
          {days.map((day, idx) => (
            <div key={idx} className="text-center py-4 text-[13px] font-bold text-[#475569] border-r border-gray-100 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        <div className="w-12 flex justify-center pl-4 absolute right-8">
          <div className="flex items-center justify-center border border-gray-200 rounded-md w-8 h-8 cursor-pointer hover:bg-gray-50">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Week Grid Body */}
      <div className="flex flex-col">
        {times.map((time, rowIdx) => (
          <div key={rowIdx} className="flex min-h-[140px]">
            {/* Time Label */}
            <div className="w-[100px] flex justify-end pr-6 pt-4">
              <span className="text-[13px] font-bold text-[#475569]">{time}</span>
            </div>

            {/* Days Columns */}
            <div className="flex-1 grid grid-cols-5 border-l border-b border-gray-100 last:rounded-b-lg">
              {days.map((day, colIdx) => {
                const slot = getSlot(day, time);

                return (
                  <div key={`${rowIdx}-${colIdx}`} className="p-2 border-r border-gray-100 h-full relative group">
                    {slot ? (
                      slot.status === 'open' ? (
                        // Open Slot Card
                        <div 
                          onClick={() => onSlotClick(slot)}
                          className="w-full h-full border border-green-500 bg-white rounded-lg p-3 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow relative"
                        >
                          <div>
                            <div className="text-[14px] font-bold text-[#1e293b] mb-1">{slot.time}</div>
                            <div className="text-[13px] font-medium text-gray-500">Cap {slot.cap}</div>
                          </div>
                          {slot.tier && (
                            <div className={`text-[10px] font-bold px-2 py-1 rounded-full w-fit mt-2 ${
                              slot.tier === 'Express + Standard' ? 'bg-[#fef3c7] text-[#92400e]' :
                              slot.tier === 'Standard only' ? 'bg-[#fef3c7] text-[#92400e]' :
                              'bg-[#fef3c7] text-[#92400e]'
                            }`}>
                              {slot.tier}
                            </div>
                          )}
                        </div>
                      ) : (
                        // Blackout Slot Card
                        <div 
                          onClick={() => onSlotClick(slot)}
                          className="w-full h-full bg-[#ffebee] rounded-lg p-3 flex flex-col cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <div className="text-[14px] font-bold text-[#1e293b] mb-1">{slot.time}</div>
                          <div className="text-[13px] font-medium text-gray-600">{slot.note}</div>
                        </div>
                      )
                    ) : (
                      // Empty Add Slot Box
                      <div 
                        onClick={onEmptyClick}
                        className="w-full h-full border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 hover:bg-gray-100 transition-colors min-h-[100px]"
                      >
                        <div className="flex items-center gap-2 text-[#94a3b8] font-bold text-[13px]">
                          <Plus className="w-4 h-4" /> Add slot
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
