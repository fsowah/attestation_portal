import React from 'react';

const MonthView = ({ slots, calendarGrid, onSlotClick, onEmptyClick }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

  // Helper to get slots for a specific date
  const getSlotsForDate = (dateStr) => {
    return slots.find(s => s.dateStr === dateStr);
  };

  return (
    <div className="w-full">
      {/* Month Grid Header */}
      <div className="grid grid-cols-7 mb-4 border-b border-gray-100 pb-4">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="text-center text-[13px] font-bold text-[#475569]">
            {day}
          </div>
        ))}
      </div>

      {/* Month Grid Body */}
      <div className="grid grid-cols-7 border-t border-l border-gray-100">
        {calendarGrid.map((dayObj, idx) => {
          const dayData = dayObj.currentMonth ? getSlotsForDate(dayObj.dateStr) : null;
          const isWeekend = (idx % 7 === 5) || (idx % 7 === 6); // Sat/Sun

          return (
            <div 
              key={idx} 
              className={`min-h-[160px] p-3 border-r border-b border-gray-100 flex flex-col ${!dayObj.currentMonth ? 'bg-gray-50' : 'bg-white'}`}
            >
              <div className={`text-[13px] font-bold mb-3 ${dayObj.currentMonth ? 'text-[#1e293b]' : 'text-gray-300'}`}>
                {dayObj.date}
              </div>

              {dayObj.currentMonth && !isWeekend && (
                <div className="flex flex-col gap-1.5 flex-1">
                  {dayData && dayData.slots && dayData.slots.length > 0 ? (
                    <>
                      {/* Render up to 3 slots visually */}
                      {dayData.slots.slice(0, 3).map((slot, sIdx) => (
                        <div 
                          key={sIdx}
                          onClick={() => onSlotClick(slot)}
                          className={`px-3 py-1.5 rounded-[4px] text-[11px] font-bold cursor-pointer hover:opacity-80 transition-opacity border ${
                            slot.status === 'open' 
                              ? 'border-green-500 bg-white text-gray-500' 
                              : 'border-red-200 bg-[#ffebee] text-gray-600'
                          }`}
                        >
                          {slot.time}
                        </div>
                      ))}
                      {/* Extra indicator */}
                      {dayData.extra && (
                        <div className="text-[11px] font-bold text-gray-400 pl-1 mt-1">
                          {dayData.extra}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Empty Add slots placeholder */
                    <div 
                      onClick={() => onEmptyClick(dayObj.dateStr)}
                      className="w-full mt-1 bg-gray-50/50 border border-gray-100 rounded-[4px] py-2 flex items-center justify-center text-[10px] font-bold text-gray-300 cursor-pointer hover:bg-gray-100 hover:text-gray-400 transition-colors"
                    >
                      + Add slots
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
