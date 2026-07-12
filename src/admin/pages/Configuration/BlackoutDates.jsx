import React, { useState } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import AddBlackoutModal from './components/AddBlackoutModal';

const BlackoutDates = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Mock data based on Figma design
  const blackoutData = [
    { id: 1, date: '25 Apr 2026', day: 'Friday', reason: 'Ghana Republic Day (public holiday)', type: 'Public holiday', addedBy: 'Serwaa A.' },
    { id: 2, date: '25 Apr 2026', day: 'Friday', reason: 'Ghana Republic Day (public holiday)', type: 'Maintenance', addedBy: 'Serwaa A.' },
    { id: 3, date: '25 Apr 2026', day: 'Friday', reason: 'Ghana Republic Day (public holiday)', type: 'Public holiday', addedBy: 'Serwaa A.' },
  ];

  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[22px] font-bold text-[#1e293b]">Blackout dates</h1>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#0f172a] hover:bg-black text-white px-4 py-2.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add blackout date
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e293b] text-white">
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Date</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Day</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Reason</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Type</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Added By</th>
              <th className="py-4 px-6 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {blackoutData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-[13px] font-medium text-[#475569]">{row.date}</td>
                <td className="py-4 px-6 text-[13px] font-medium text-[#475569]">{row.day}</td>
                <td className="py-4 px-6 text-[13px] font-medium text-[#475569]">{row.reason}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold ${
                    row.type === 'Public holiday' 
                      ? 'bg-[#fef3c7] text-[#b45309]' 
                      : 'bg-[#e0e7ff] text-[#4338ca]'
                  }`}>
                    {row.type}
                  </span>
                </td>
                <td className="py-4 px-6 text-[13px] font-medium text-[#475569]">{row.addedBy}</td>
                <td className="py-4 px-6 text-right">
                  <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="border-t border-gray-100 p-4 px-6 flex justify-between items-center bg-white">
          <div className="text-[12px] font-medium text-gray-500">
            Showing 1-10 out of 100
          </div>
          
          <div className="flex items-center gap-1 text-[13px] font-medium text-gray-600">
            <button className="p-1 text-gray-300 hover:text-gray-500"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-[#e2e8f0] font-bold text-[#1e293b]">1</button>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-50">2</button>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-50">3</button>
            <span className="px-1 text-gray-400">...</span>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-50">7</button>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-50">8</button>
            <button className="p-1 hover:text-gray-800"><ChevronRight className="w-4 h-4" /></button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-medium text-gray-500">Items per page:</span>
            <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-[12px] font-medium text-[#475569] focus:outline-none">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>

      <AddBlackoutModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default BlackoutDates;
