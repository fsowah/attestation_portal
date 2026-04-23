import React, { useState } from 'react';

// Assets from Figma context
const imgArrowLeft = "http://localhost:3845/assets/arrow-left-01.svg"; // Placeholder for icon mapping
const imgArrowRight = "http://localhost:3845/assets/arrow-right-01.svg";
const imgCheckmarkSquare = "http://localhost:3845/assets/checkmark-square-02.svg";

const AppointmentBookingForm = ({ onSave }) => {
  const [selectedDate, setSelectedDate] = useState(9); // Default to 9 as in design
  const [selectedTime, setSelectedTime] = useState('9:00 am');
  const [currentMonth, setCurrentMonth] = useState('April 2026');
  const [showSummary, setShowSummary] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const calendarDays = [
    { day: 30, isMuted: true, isPast: true }, { day: 31, isMuted: true, isPast: true },
    { day: 1, isUpcoming: true }, { day: 2, isUpcoming: true }, { day: 3, isUpcoming: true }, { day: 4, isWeekend: true }, { day: 5, isWeekend: true },
    { day: 6, isUpcoming: true }, { day: 7, isUpcoming: true }, { day: 8, isUpcoming: true }, { day: 9, isSelected: true }, { day: 10, isUpcoming: true }, { day: 11, isWeekend: true }, { day: 12, isWeekend: true },
    { day: 13, isUpcoming: true }, { day: 14, isUpcoming: true }, { day: 15, isUpcoming: true }, { day: 16, isUpcoming: true }, { day: 17, isUpcoming: true }, { day: 18, isWeekend: true }, { day: 19, isWeekend: true },
    { day: 20, isUpcoming: true }, { day: 21, isUpcoming: true }, { day: 22, isBooked: true },
    { day: 23, isBooked: true }, { day: 24, isBooked: true }, { day: 25, isWeekend: true }, { day: 26, isWeekend: true },
    { day: 27, isBooked: true }, { day: 28, isBooked: true }, { day: 29, isBooked: true }, { day: 30, isBooked: true },
    { day: 1, isWeekend: true, isMuted: true }, { day: 2, isWeekend: true, isMuted: true }, { day: 3, isWeekend: true, isMuted: true },
  ];

  const timeSlots = [
    { time: '8:00 am', slots: 3 },
    { time: '9:00 am', slots: 1, isLow: true, isSelected: true },
    { time: '10:00 am', slots: 5 },
    { time: '10:30 am', slots: 2 },
    { time: '11:00 am', slots: 5 },
    { time: '12:00 pm', slots: 3 },
  ];

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center max-w-[600px] mx-auto">
        <div className="size-[88px] bg-[#E5F4ED] rounded-full flex items-center justify-center mb-8">
          <img src="http://localhost:3845/assets/7e6c7f33b5cbe6c387a50fcc6f255e8b6146592b.svg" alt="Success" className="size-10" />
        </div>
        
        <h2 className="text-[28px] font-bold text-[#0A1628] mb-3">Appointment Booked!</h2>
        <p className="text-[15px] text-neutral-500 leading-relaxed max-w-[420px] mb-12">
          Your appointment has been successfully scheduled. We've sent a confirmation email with all the details.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-[364px]">
          <button 
            className="h-[54px] bg-[#FCD116] text-[#0A1628] rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
          >
            <img src="http://localhost:3845/assets/3590c99d779b02ba576a59243a9fa3ad48dbfc3e.svg" alt="Receipt" className="size-5" />
            Download receipt
          </button>
          <button 
            onClick={() => onSave({ date: selectedDate, time: selectedTime })}
            className="h-[54px] border border-neutral-200 text-[#0A1628] rounded-lg font-bold text-[15px] active:scale-[0.98] transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-fade-in">
      {!showSummary ? (
        <>
          <div className="flex flex-col lg:flex-row gap-12 p-2">

            {/* Left Column: Calendar */}
            <div className="flex-1 min-w-[340px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[17px] font-bold text-[#0A1628]">Choose day</h3>
                <div className="flex items-center gap-6">
                  <button className="p-1 opacity-40 hover:opacity-100 transition-opacity">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  </button>
                  <span className="text-[15px] font-bold text-[#0A1628] min-w-[100px] text-center">{currentMonth}</span>
                  <button className="p-1 opacity-40 hover:opacity-100 transition-opacity">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4.5 mb-4 text-center max-w-[640px]">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="text-[14px] font-bold text-[#0A1628] h-10 flex items-center justify-center">
                    {day}
                  </div>
                ))}
                {calendarDays.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => !item.isBooked && !item.isPast && !item.isWeekend && setSelectedDate(item.day)}
                    className={`relative w-[44px] h-[44px] flex items-center justify-center text-[15px] font-medium rounded-xl cursor-pointer transition-all
                      ${item.isPast ? 'text-neutral-300 bg-white' : ''}
                      ${item.isUpcoming ? 'text-[#0A1628] bg-white border border-neutral-100 shadow-sm' : ''}
                      ${item.isWeekend ? 'text-neutral-300 bg-[#F0F0F0]' : ''}
                      ${item.isBooked ? '!bg-[#E56E75] !text-white border-none cursor-not-allowed shadow-none' : ''}
                      ${selectedDate === item.day && !item.isBooked && !item.isPast && !item.isWeekend ? '!bg-[#FCD116] !text-[#0A1628] !font-bold border-none shadow-md' : ''}
                    `}
                  >
                    {item.day}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg border border-neutral-200 bg-white" />
                  <span className="text-[12px] font-medium text-neutral-400">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-[#E56E75]" />
                  <span className="text-[12px] font-medium text-neutral-400">Fully booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-[#FCD116]" />
                  <span className="text-[12px] font-medium text-neutral-400">Selected</span>
                </div>
              </div>
            </div>

            {/* Right Column: Time Slots */}
            <div className="w-full lg:w-[420px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[17px] font-bold text-[#0A1628]">Choose hour</h3>
                <span className="text-[14px] font-medium text-neutral-400">Ghana(UTC+00:00)</span>
              </div>

              <div className="flex flex-col gap-3">
                {timeSlots.map((slot, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`h-[58px] px-6 rounded-xl border flex items-center justify-between cursor-pointer transition-all group
                      ${selectedTime === slot.time
                        ? 'bg-[#FCD116] border-none'
                        : 'border-neutral-100 bg-[#F9F8F7] hover:border-neutral-200'
                      }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className={`text-[16px] font-bold ${selectedTime === slot.time ? 'text-[#0A1628]' : 'text-neutral-700'}`}>
                        {slot.time.split(' ')[0]}
                      </span>
                      <span className="text-[13px] font-medium text-neutral-400 mt-0.5">
                        {slot.time.split(' ')[1]}
                      </span>
                    </div>
                    <span className={`text-[12px] font-medium ${slot.isLow ? (selectedTime === slot.time ? 'text-white/80' : 'text-[#E56E75]') : 'text-neutral-300'}`}>
                      {slot.slots} {slot.slots === 1 ? 'slot' : 'slots'} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSummary(true)}
            className="w-[364px] h-[54px] rounded-lg bg-[#FCD116] text-[#0A1628] text-[15px] font-bold mt-12 transition-all flex items-center justify-center shadow-sm active:scale-[0.98]"
          >
            Go to summary
          </button>
        </>
      ) : (
        <div className="flex flex-col animate-fade-in max-w-[600px] w-full">
          <div className="bg-[#F9F8F7]/50 rounded-2xl p-6 border border-neutral-100 mb-6">
            <div className="mb-6">
              <h3 className="text-[16px] font-bold text-[#0A1628] mb-1">Summary of the booking</h3>
              <p className="text-[13px] text-neutral-400">Check if all information are correct</p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Date Card */}
              <div className="h-[80px] bg-white rounded-xl border border-neutral-100 shadow-sm flex items-center justify-center gap-2">
                <span className="text-[28px] font-bold text-[#0A1628]">{selectedDate}</span>
                <span className="text-[16px] font-bold text-[#0A1628] mt-1">April</span>
              </div>

              {/* Time Card */}
              <div className="h-[80px] bg-white rounded-xl border border-neutral-100 shadow-sm flex items-center justify-center gap-2">
                <span className="text-[28px] font-bold text-[#0A1628]">{selectedTime.split(' ')[0]}</span>
                <span className="text-[16px] font-bold text-[#0A1628] mt-1">{selectedTime.split(' ')[1]}</span>
              </div>

              {/* Location Card */}
              <div className="h-[70px] bg-white rounded-xl border border-neutral-100 shadow-sm flex flex-col items-center justify-center">
                <span className="text-[14px] font-bold text-[#0A1628]">MOFA Office, Accra</span>
                <span className="text-[12px] text-neutral-400">Gamel Abdul Nasser Ave</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSave({ date: selectedDate, time: selectedTime })}
            className="w-[364px] h-[54px] rounded-lg bg-[#FCD116] text-[#0A1628] text-[15px] font-bold transition-all flex items-center justify-center shadow-sm active:scale-[0.98]"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentBookingForm;
