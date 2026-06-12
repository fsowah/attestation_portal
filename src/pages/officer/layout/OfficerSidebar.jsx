import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, BarChart2, CheckCircle, HeadphonesIcon, MessageSquare } from 'lucide-react';

const OfficerSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full overflow-y-auto">
      <div className="flex flex-col py-6">
        
        {/* WORKFLOW GROUP */}
        <div className="px-6 mb-2">
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Workflow</span>
        </div>
        <nav className="flex flex-col gap-1 px-3 mb-8">
          <NavLink 
            to="/officer/dashboard" 
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/officer/submissions" 
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <FileText className="w-4 h-4" />
            Submissions
          </NavLink>
          <NavLink 
            to="/officer/appointments" 
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <Calendar className="w-4 h-4" />
            Appointments
          </NavLink>
        </nav>

        {/* REPORTS GROUP */}
        <div className="px-6 mb-2">
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Reports</span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          <NavLink 
            to="/officer/reports/daily" 
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <BarChart2 className="w-4 h-4" />
            Daily Summary
          </NavLink>
          <NavLink 
            to="/officer/reports/completed" 
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <CheckCircle className="w-4 h-4" />
            Completed Today
          </NavLink>
        </nav>
      </div>

      {/* Footer Links */}
      <div className="mt-auto p-4 mb-4">
        <nav className="flex flex-col gap-1 px-3">
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-[#64748b] hover:bg-gray-50 transition-colors text-left w-full">
            <HeadphonesIcon className="w-4 h-4" />
            Support
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-[#64748b] hover:bg-gray-50 transition-colors text-left w-full">
            <MessageSquare className="w-4 h-4" />
            Feedback
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default OfficerSidebar;
