import React from 'react';
import { X, Calendar as CalendarIcon, ChevronDown, Check } from 'lucide-react';

const AddBlackoutModal = ({ isOpen, onClose }) => {
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
            
            {/* Top Row: Date and Type */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2 tracking-wider">Date</label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden h-[42px] bg-white">
                  <input type="text" placeholder="DD / MM / YYYY" className="flex-1 w-full pl-3 text-[13px] font-medium text-gray-400 focus:outline-none" />
                  <div className="w-10 bg-gray-100 flex items-center justify-center border-l border-gray-200 shrink-0">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-2 tracking-wider">Type</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 h-[42px] text-[13px] font-medium text-gray-400 focus:outline-none">
                    <option>Public holiday</option>
                    <option>Maintenance</option>
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
                placeholder="Independence Day - Public holiday" 
                className="w-full bg-white border border-gray-200 rounded-lg px-4 h-[42px] text-[13px] font-medium text-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Affected Areas (Checkboxes) */}
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-3 tracking-wider">Affected Areas</label>
              
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-4 h-4 border border-gray-300 rounded-[4px] flex items-center justify-center bg-gray-50 group-hover:border-gray-400 transition-colors">
                    <Check className="w-3 h-3 text-transparent" />
                  </div>
                  <span className="text-[13px] font-medium text-gray-400">Block all new appointment bookings</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-4 h-4 border border-gray-300 rounded-[4px] flex items-center justify-center bg-gray-50 group-hover:border-gray-400 transition-colors">
                    <Check className="w-3 h-3 text-transparent" />
                  </div>
                  <span className="text-[13px] font-medium text-gray-400">Cancel existing appointments on this date</span>
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
            <button className="px-6 py-2.5 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white text-[13px] font-bold shadow-sm transition-colors">
              Add blackout date
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AddBlackoutModal;
