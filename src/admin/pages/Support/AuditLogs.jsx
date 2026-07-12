import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, Settings2, Calendar as CalendarIcon, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import AuditLogDetailsDrawer from './components/AuditLogDetailsDrawer';

const AuditLogs = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterRef = useRef(null);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mockData = [
    { id: 1, date: '25 Apr 2026 07:30:20', category: 'Payment', action: 'Payment confirmed via expressPay', actor: 'System', reference: 'ATT-2026-00847' },
    { id: 2, date: '25 Apr 2026 07:30:20', category: 'Submission', action: 'Director sign-off - Legal Directorate', actor: 'Serwaa A.', reference: 'ATT-2026-00847' },
    { id: 3, date: '25 Apr 2026 07:30:20', category: 'User', action: 'Check-in logged - Kofi Mensah', actor: 'Serwaa A.', reference: 'ATT-2026-00847' },
    { id: 4, date: '25 Apr 2026 07:30:20', category: 'Submission', action: 'Director sign-off - Consular Bureau', actor: 'Serwaa A.', reference: 'ATT-2026-00847' },
    { id: 5, date: '25 Apr 2026 07:30:20', category: 'Submission', action: 'Application submitted - Path B - Express', actor: 'Citizen', reference: 'ATT-2026-00847' },
    { id: 6, date: '25 Apr 2026 07:30:20', category: 'Config', action: 'Appointment slots opened 21 - 25 Apr', actor: 'Serwaa A.', reference: '' },
    { id: 7, date: '25 Apr 2026 07:30:20', category: 'Auth', action: 'Admin login - Azure AD SSO', actor: 'Serwaa A.', reference: '' },
    { id: 8, date: '25 Apr 2026 07:30:20', category: 'Config', action: 'Fee updated: Standard GHS 180 to 200', actor: 'Serwaa A.', reference: '' },
    { id: 9, date: '25 Apr 2026 07:30:20', category: 'Submission', action: 'Submission rejected - seal', actor: 'Serwaa A.', reference: 'ATT-2026-00847' },
  ];

  const getCategoryBadge = (category) => {
    switch(category) {
      case 'Payment':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#f3e8ff] text-[#9333ea]">Payment</span>;
      case 'Submission':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#dcfce7] text-[#166534]">Submission</span>;
      case 'User':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#e0f2fe] text-[#0369a1]">User</span>;
      case 'Config':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#fef3c7] text-[#b45309]">Config</span>;
      case 'Auth':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#f1f5f9] text-[#475569]">Auth</span>;
      default:
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">{category}</span>;
    }
  };

  const handleView = (log) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[22px] font-bold text-[#1e293b]">Audit Logs</h1>
        <button className="flex items-center gap-2 bg-[#0f172a] hover:bg-black text-white px-4 py-2.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end items-center gap-3 mb-4">
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-10 text-[13px] font-bold text-[#475569] focus:outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <option>All Users</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>

        {/* Filters Dropdown */}
        <div className="relative" ref={filterRef}>
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2 text-[13px] font-bold text-[#475569] hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Settings2 className="w-4 h-4 text-gray-500" />
            Filters
          </button>
          
          {filtersOpen && (
            <div className="absolute top-full right-0 mt-2 w-[220px] bg-white border border-gray-100 rounded-lg shadow-xl z-10 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-[13px] font-medium text-[#475569]">Submissions</span>
              </label>
              <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-[13px] font-medium text-[#475569]">User activity</span>
              </label>
              <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-[13px] font-medium text-[#475569]">Configuration</span>
              </label>
              <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-[13px] font-medium text-[#475569]">Payments</span>
              </label>
              <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-[13px] font-medium text-[#475569]">Auth & login</span>
              </label>
            </div>
          )}
        </div>

        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2 text-[13px] font-bold text-[#475569] hover:bg-gray-50 transition-colors shadow-sm">
          <CalendarIcon className="w-4 h-4 text-gray-500" />
          May 2026
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e293b] text-white">
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Date</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Category</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Action</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Actor</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Reference</th>
              <th className="py-4 px-6 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-[13px] font-medium text-gray-500">{row.date}</td>
                <td className="py-4 px-6">{getCategoryBadge(row.category)}</td>
                <td className="py-4 px-6 text-[13px] font-medium text-gray-600">{row.action}</td>
                <td className="py-4 px-6 text-[13px] font-medium text-gray-500">{row.actor}</td>
                <td className="py-4 px-6 text-[13px] font-medium text-gray-500">{row.reference}</td>
                <td className="py-4 px-6 text-right">
                  <button 
                    onClick={() => handleView(row)}
                    className="text-gray-400 hover:text-[#0f4c9c] transition-colors p-1"
                  >
                    <Eye className="w-4 h-4" />
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

      <AuditLogDetailsDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} logData={selectedLog} />
    </div>
  );
};

export default AuditLogs;
