import React from 'react';
import { X, ChevronDown, Calendar as CalendarIcon, Clock, AlertTriangle, ChevronUp, Plus } from 'lucide-react';

const EditSlotDrawer = ({ isOpen, onClose, slotData }) => {
  const isEditMode = !!slotData;

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
              Edit Slot
            </h2>
            <p className="text-[13px] font-medium text-gray-400">
              Date: 19 May 2026 &nbsp;&nbsp; {isEditMode ? '9:00 AM' : 'Thursday 9:00 AM'}
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
          
          {isEditMode ? (
            /* ---------------------------------------------------- */
            /* EDIT MODE CONTENT (Image 1)                          */
            /* ---------------------------------------------------- */
            <div>
              <h3 className="text-[12px] font-bold text-[#1e293b] mb-4">Time Slots</h3>
              
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="text-[14px] font-bold text-[#1e293b] w-16">
                        9:00 AM
                      </div>
                      
                      {/* Number Input */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-lg h-[40px] w-[70px] bg-white overflow-hidden">
                          <input 
                            type="text" 
                            defaultValue="10" 
                            className="w-full h-full text-center text-[14px] font-medium text-[#1e293b] focus:outline-none" 
                          />
                          <div className="flex flex-col border-l border-gray-200 h-full w-8 shrink-0">
                            <button className="flex-1 flex items-center justify-center border-b border-gray-200 hover:bg-gray-50">
                              <ChevronUp className="w-3 h-3 text-gray-400" />
                            </button>
                            <button className="flex-1 flex items-center justify-center hover:bg-gray-50">
                              <ChevronDown className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <span className="text-[13px] font-medium text-gray-400">cap</span>
                      </div>
                    </div>
                    
                    {/* Delete button */}
                    <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      <X className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ---------------------------------------------------- */
            /* ADD MODE CONTENT (Image 2)                           */
            /* ---------------------------------------------------- */
            <>
              {/* Appointment Timing Section */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex gap-4 mb-5">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">Avg. Time Duration</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] font-medium text-gray-500 focus:outline-none">
                        <option>30 minutes</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-3 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">Capacity</label>
                    <input 
                      type="text" 
                      defaultValue="20"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] font-medium text-gray-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="bg-[#eff6ff] border border-blue-100 rounded-xl p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[#0f4c9c] text-[13px] font-medium">
                    <Clock className="w-4 h-4" />
                    Estimated slot window
                  </div>
                  <div className="text-right">
                    <div className="text-[20px] font-bold text-[#0f4c9c]">2h 30min</div>
                    <div className="text-[10px] font-medium text-blue-400">30 min x 10 appointments</div>
                  </div>
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-[12px] font-bold text-gray-500 mb-4">Time Slots</h3>
                
                <div className="flex gap-4 mb-3">
                  <div className="flex-[2] text-[9px] font-bold text-gray-700 uppercase tracking-wider">Start Time</div>
                  <div className="flex-1 text-[9px] font-bold text-gray-700 uppercase tracking-wider">Capacity</div>
                  <div className="flex-[2] text-[9px] font-bold text-gray-700 uppercase tracking-wider">Est. End</div>
                  <div className="w-8"></div>
                </div>

                {/* Existing Rows */}
                {['9:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'].map((time, idx) => (
                  <div key={idx} className="flex gap-4 items-center mb-3">
                    <div className="flex-[2] relative">
                      <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-600 focus:outline-none">
                        <option>{time}</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                    <div className="flex-1">
                      <input type="text" defaultValue="20" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-600 focus:outline-none text-center" />
                    </div>
                    <div className="flex-[2]">
                      <input type="text" defaultValue="11:00 AM" readOnly className="w-full bg-transparent text-gray-400 text-[13px] font-medium px-1 py-2 focus:outline-none" />
                    </div>
                    <div className="w-8 flex justify-center">
                      <button className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50">
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Row */}
                <div className="flex gap-4 mt-5">
                  <div className="flex-[3] relative">
                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] font-medium text-gray-400 focus:outline-none">
                      <option>Add a time slot</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                  <div className="flex-[2]">
                    <button className="w-full bg-white border border-gray-200 rounded-lg py-2.5 text-[13px] font-bold text-[#475569] hover:bg-gray-50 flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Add slot
                    </button>
                  </div>
                </div>
              </div>

              {/* Apply To Section */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-[12px] font-bold text-gray-500 mb-4">Apply To</h3>
                
                {/* Days Toggle */}
                <div className="flex gap-2 mb-5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                    <button key={day} className={`flex-1 py-2 rounded-md text-[13px] font-bold border transition-colors ${day === 'Thu' ? 'bg-[#0f172a] border-[#0f172a] text-white' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                      {day}
                    </button>
                  ))}
                </div>

                {/* Repeat */}
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">Repeat</label>
                <div className="relative mb-5">
                  <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] font-medium text-gray-400 focus:outline-none">
                    <option>No repeat</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-3 pointer-events-none" />
                </div>

                {/* From / To */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">From</label>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden h-[42px] bg-white">
                      <input type="text" placeholder="DD / MM / YYYY" className="flex-1 w-full pl-3 text-[13px] font-medium text-gray-400 focus:outline-none" />
                      <div className="w-10 bg-gray-100 flex items-center justify-center border-l border-gray-200 shrink-0">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2">To</label>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden h-[42px] bg-white">
                      <input type="text" placeholder="DD / MM / YYYY" className="flex-1 w-full pl-3 text-[13px] font-medium text-gray-400 focus:outline-none" />
                      <div className="w-10 bg-gray-100 flex items-center justify-center border-l border-gray-200 shrink-0">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
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
                  <div className="w-10 h-6 bg-yellow-400 rounded-full flex items-center p-1 justify-end cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#e0e7ff] text-[#4f46e5] px-3 py-1 rounded-full text-[11px] font-bold">Standard</div>
                    <div>
                      <div className="text-[14px] font-bold text-[#1e293b]">Standard Tier</div>
                      <div className="text-[11px] font-medium text-gray-400">Regular GHS 200 per document</div>
                    </div>
                  </div>
                  <div className="w-10 h-6 bg-yellow-400 rounded-full flex items-center p-1 justify-end cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>

              {/* Internal Note Section */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-[12px] font-bold text-gray-500 mb-4">Internal Note</h3>
                <textarea 
                  placeholder="e.g Reduced capacity, maintenance day"
                  className="w-full min-h-[80px] border border-gray-200 rounded-lg p-4 text-[13px] text-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                ></textarea>
              </div>

              {/* Mark as Blackout */}
              <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-xl p-5 flex items-center justify-between mt-2">
                <div>
                  <div className="flex items-center gap-2 text-[#e11d48] font-bold text-[14px] mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    Mark as blackout
                  </div>
                  <p className="text-[10px] font-medium text-[#fb7185]">This will block all appointment bookings for the<br/>selected days and date range</p>
                </div>
                <button className="bg-[#e11d48] hover:bg-[#be123c] text-white px-4 py-2.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm">
                  Mark as blackout
                </button>
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
          <button className="px-6 py-2.5 rounded-lg bg-[#0f172a] hover:bg-black text-white text-[13px] font-bold shadow-sm transition-colors">
            Apply changes
          </button>
        </div>

      </div>
    </>
  );
};

export default EditSlotDrawer;
