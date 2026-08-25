import React from 'react';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import LogoCrest from '../../../assets/images/Logo_crest.png';

const OfficerHeader = ({ toggleSidebar }) => {
  return (
    <header className="relative z-30 text-white flex flex-col shrink-0 shadow-lg" style={{ background: 'linear-gradient(180deg, #0D1F36 6.51%, #0C4FA5 114.68%)' }}>
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
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#0a1b35]"></span>
          </button>

          <div className="flex items-center gap-2 md:gap-3 bg-white/10 rounded-full py-1.5 px-2 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
            <div className="w-8 h-8 rounded-full bg-brand-navy-600 border border-white/30 flex items-center justify-center shrink-0">
              {/* Fallback avatar icon */}
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="hidden md:flex flex-col pr-1">
              <span className="text-[13px] font-semibold leading-tight">Ama Mensah</span>
              <span className="text-[10px] text-gray-300 leading-tight">Consular Officer</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-300 mr-1 hidden md:block" />
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

export default OfficerHeader;
