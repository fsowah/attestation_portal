import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, BarChart2, CheckCircle, HeadphonesIcon, MessageSquare, LogOut, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const OfficerSidebar = ({ isOpen, closeSidebar }) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/officer/login';
  };

  return (
    <aside className={`bg-white border-r border-gray-200 flex flex-col shrink-0 h-full overflow-y-auto
      fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}`}>
      <div className="flex flex-col py-6">
        
        {/* Mobile close button */}
        <div className="lg:hidden px-4 mb-2 flex justify-end">
          <button 
            onClick={closeSidebar}
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* WORKFLOW GROUP */}
        <div className="px-6 mb-2">
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Workflow</span>
        </div>
        <nav className="flex flex-col gap-1 px-3 mb-8">
          <NavLink 
            to="/officer/dashboard" 
            onClick={closeSidebar}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/officer/submissions" 
            onClick={closeSidebar}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <FileText className="w-4 h-4" />
            Submissions
          </NavLink>
          <NavLink 
            to="/officer/appointments" 
            onClick={closeSidebar}
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
            onClick={closeSidebar}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <BarChart2 className="w-4 h-4" />
            Daily Summary
          </NavLink>
          <NavLink 
            to="/officer/reports/completed" 
            onClick={closeSidebar}
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
          <div className="h-px bg-gray-200 my-2" />
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default OfficerSidebar;
