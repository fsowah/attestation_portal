import React, { useState } from 'react';
import { Bell, ChevronDown, Menu, User, LogOut } from 'lucide-react';
import LogoCrest from '../../assets/images/Logo_crest.png';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ toggleSidebar }) => {
  const { user, profile, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <header className="relative z-30 text-white flex flex-col shrink-0 shadow-sm" style={{ background: 'linear-gradient(270deg, #0C4FA5 0%, #0D1F36 100%)' }}>
      <div className="flex justify-between items-center h-20 px-4 md:px-6">
        {/* Left Side: Logo and Title */}
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors mr-1"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img src={LogoCrest} alt="MoFA Logo" className="h-10 md:h-12 w-auto" />
          <div className="flex flex-col">
            <h2 className="font-bold text-[13px] md:text-[15px] leading-tight">Ministry of Foreign Affairs</h2>
            <p className="text-brand-gold-500 font-medium text-[9px] md:text-[11px] tracking-wide">
              <span className="hidden sm:inline">Republic of Ghana &nbsp;</span>
              <span className="text-brand-gold-500/70">Document Attestation Portal</span>
            </p>
          </div>
        </div>

        {/* Right Side: Profile and Notifications */}
        <div className="flex items-center gap-3 md:gap-6">
          <button className="text-white hover:text-gray-300 transition-colors relative">
            <Bell className="w-5 h-5" />
          </button>

          <div className="relative" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
            <button className="flex items-center gap-2 md:gap-3 bg-white/10 rounded-full py-1.5 px-2 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
              <div className="w-8 h-8 rounded-full bg-brand-navy-600 border border-white/30 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:flex flex-col pr-1">
                <span className="text-[13px] font-semibold leading-tight">{profile?.full_name || 'Administrator'}</span>
                <span className="text-[10px] text-gray-300 leading-tight">System Administrator</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-300 mr-1 hidden md:block transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-52 bg-white rounded-lg shadow-xl border border-neutral-100 py-1.5 z-50" style={{ animation: 'fadeInUp 0.15s ease-out' }}>
                <div className="px-3 py-2 border-b border-neutral-50 mb-1">
                  <p className="text-[11px] text-neutral-400 font-medium">Logged in as</p>
                  <p className="text-xs font-bold text-neutral-800 truncate">{user?.email}</p>
                </div>
                <button className="w-full px-3 py-2 text-left text-xs text-neutral-600 hover:bg-neutral-50 transition-colors flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  My Profile
                </button>
                <div className="h-px bg-neutral-100 my-1" />
                <button
                  onClick={handleSignOut}
                  className="w-full px-3 py-2 text-left text-xs text-red-600 font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tri-color divider */}
      <div className="w-full h-1 flex shrink-0">
        <div className="flex-1 bg-[#CE1126]"></div>
        <div className="flex-1 bg-[#FCD116]"></div>
        <div className="flex-1 bg-[#006B3F]"></div>
      </div>
    </header>
  );
};

export default AdminHeader;
