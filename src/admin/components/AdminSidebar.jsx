import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Calendar, 
  Settings2, 
  CreditCard, 
  MessageSquare, 
  Users, 
  Shield, 
  HeadphonesIcon, 
  FileText 
} from 'lucide-react';

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full overflow-y-auto">
      <div className="flex flex-col py-6">
        
        {/* Main Dashboard Link */}
        <div className="px-4 mb-6">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-bold transition-colors ${isActive ? 'bg-[#e2e8f0] text-[#0f4c9c]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
        </div>
        
        {/* CONFIGURATION GROUP */}
        <div className="px-8 mb-2 mt-2">
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Configuration</span>
        </div>
        <nav className="flex flex-col gap-1 px-4 mb-6">
          <NavLink 
            to="/admin/config/slots" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <Settings className="w-4 h-4" />
            Slot Configuration
          </NavLink>
          <NavLink 
            to="/admin/config/blackout" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <Calendar className="w-4 h-4" />
            Blackout Dates
          </NavLink>
          <NavLink 
            to="/admin/config/portal" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <Settings2 className="w-4 h-4" />
            Portal Settings
          </NavLink>
          <NavLink 
            to="/admin/config/fees" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <CreditCard className="w-4 h-4" />
            Fees & Tiers
          </NavLink>
          <NavLink 
            to="/admin/config/sms" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <MessageSquare className="w-4 h-4" />
            SMS Notifications
          </NavLink>
        </nav>

        {/* USERS & ACCESS GROUP */}
        <div className="px-8 mb-2 mt-2">
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Users & Access</span>
        </div>
        <nav className="flex flex-col gap-1 px-4 mb-6">
          <NavLink 
            to="/admin/users/management" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <Users className="w-4 h-4" />
            User Management
          </NavLink>
          <NavLink 
            to="/admin/users/roles" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <Shield className="w-4 h-4" />
            Roles & Permissions
          </NavLink>
        </nav>

        {/* IT SUPPORT GROUP */}
        <div className="px-8 mb-2 mt-2">
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">IT Support</span>
        </div>
        <nav className="flex flex-col gap-1 px-4">
          <NavLink 
            to="/admin/support/tickets" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <HeadphonesIcon className="w-4 h-4" />
            Support Tickets
          </NavLink>
          <NavLink 
            to="/admin/support/logs" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${isActive ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-gray-50 hover:text-[#475569]'}`}
          >
            <FileText className="w-4 h-4" />
            Audit Logs
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
