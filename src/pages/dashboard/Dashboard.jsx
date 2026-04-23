import React, { useState } from 'react';
import NewApplicationSteps from './components/NewApplicationSteps';

// Asset constants from Figma context
const imgLogoImage = "http://localhost:3845/assets/b2bdf8f7c8828484728deaa27435bbdd1780dafc.png";
const imgHelpCircle = "http://localhost:3845/assets/dc32c913308625add808e631b05bd0a868c28492.svg";
const imgUserCircle = "http://localhost:3845/assets/190aa75fd0d199958a6a0616236f6df0172ee78b.svg";
const imgArrowDown = "http://localhost:3845/assets/237ed5c39973de91c48ebb8907fc552695abbfe9.svg";
const imgFilesIcon = "http://localhost:3845/assets/884d064ace947bf50fa4b46e084190110f2a4238.svg";
const imgInvoiceIcon = "http://localhost:3845/assets/3590c99d779b02ba576a59243a9fa3ad48dbfc3e.svg";
const imgTrackIcon = "http://localhost:3845/assets/b9d4b372cb9cd88b65dfaf9f7af87889ac7de3fa.svg";
const imgViewIcon = "http://localhost:3845/assets/c38c1332061d85a399c9ebac5f65793a3f68a9ed.svg";
const imgEmptyStateIllustration = "http://localhost:3845/assets/0374079b8b0853b41bff3a64661d6b06032edc55.png";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications', 'invoices', 'track'
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Mock data for applications
  const [applications] = useState([
    { id: 'ATT-2026-00847', type: 'Marriage Cert.', date: '11 Apr 2026', status: 'Pending review', appointment: '22 Apr 2026 9:00:56' },
    { id: 'ATT-2026-00847', type: 'Marriage Cert.', date: '11 Apr 2026', status: 'Completed', appointment: '12 Apr 2026' },
    { id: 'ATT-2026-00847', type: 'Marriage Cert.', date: '11 Apr 2026', status: 'Completed', appointment: '12 Apr 2026' },
    { id: 'ATT-2026-00847', type: 'Marriage Cert.', date: '11 Apr 2026', status: 'Completed', appointment: '11 Apr 2026' },
    { id: 'ATT-2026-00847', type: 'Marriage Cert.', date: '11 Apr 2026', status: 'Completed', appointment: '10 Apr 2026' },
  ]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending review':
        return 'bg-[#fef6b8] text-[#7a6209]';
      case 'Completed':
        return 'bg-[#e5f4ed] text-[#004728]';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] flex flex-col font-inter relative overflow-hidden text-neutral-800">
      {/* Decorative Background Symbols (Adinkra) */}
      <div className="absolute inset-0 opacity-[0.3] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[-5%] w-[110%] h-[110%] flex flex-wrap gap-48 rotate-[-5deg]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex gap-48 opacity-40">
              <img src="http://localhost:3845/assets/1f48a3207868058edf3b90fe1d2997082b5ba5b4.svg" className="w-24 h-24 rotate-12" alt="" />
              <img src="http://localhost:3845/assets/bf0300fcd0ddb2e16da711386589650749306798.svg" className="w-20 h-20 -rotate-12 mt-20" alt="" />
            </div>
          ))}
        </div>
      </div>

      {/* Global Navigation Header */}
      <header className="relative z-20 bg-gradient-to-r from-[#0a1628] via-[#1a2e4a] to-[#2a4365] shadow-lg">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-12 lg:h-12 lg:w-14 shrink-0">
              <img src={imgLogoImage} alt="MFA Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-white font-medium text-xs lg:text-[14px] leading-tight">Ministry of Foreign Affairs</h1>
              <p className="text-brand-gold-500 font-normal text-[10px] lg:text-[11px] tracking-wide">Republic of Ghana • Document Attestation Portal</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 lg:gap-8">
            <button onClick={() => setActiveTab('applications')} className={`flex items-center gap-2 px-3 py-1.5 lg:py-3.5 border-t-2 transition-all duration-300 ${activeTab === 'applications' ? 'border-brand-gold-500 text-white' : 'border-transparent text-white/70 hover:text-white'}`}>
              <img src={imgFilesIcon} className="w-4 h-4 invert brightness-0" alt="" />
              <span className="font-medium text-sm lg:text-[15px]">Applications</span>
            </button>
            <button onClick={() => setActiveTab('invoices')} className={`flex items-center gap-2 px-3 py-1.5 lg:py-3.5 border-t-2 transition-all duration-300 ${activeTab === 'invoices' ? 'border-brand-gold-500 text-white' : 'border-transparent text-white/70 hover:text-white'}`}>
              <img src={imgInvoiceIcon} className="w-4 h-4 invert brightness-0" alt="" />
              <span className="font-medium text-sm lg:text-[15px]">Invoices</span>
            </button>
            <button onClick={() => setActiveTab('track')} className={`flex items-center gap-2 px-3 py-1.5 lg:py-3.5 border-t-2 transition-all duration-300 ${activeTab === 'track' ? 'border-brand-gold-500 text-white' : 'border-transparent text-white/70 hover:text-white'}`}>
              <img src={imgTrackIcon} className="w-4 h-4 invert brightness-0" alt="" />
              <span className="font-medium text-sm lg:text-[15px]">Track status</span>
            </button>
          </nav>

          <div className="flex items-center gap-5">
            <div className="hidden xl:flex items-center gap-1.5 cursor-pointer group">
              <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <img src={imgHelpCircle} className="w-2.5 h-2.5 invert brightness-0" alt="Help" />
              </div>
              <span className="text-white font-medium text-xs">Help</span>
            </div>

            <div className="relative" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
              <button className="flex items-center gap-2.5 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full hover:bg-white/10 transition-all">
                <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden">
                  <img src={imgUserCircle} className="w-5 h-5" alt="User" />
                </div>
                <span className="text-white font-medium text-xs hidden sm:inline">Ama Dziedzom</span>
                <img src={imgArrowDown} className={`w-2.5 h-2.5 invert brightness-0 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} alt="" />
              </button>
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-40 bg-white rounded-lg shadow-xl border border-neutral-100 py-1.5 animate-fade-in-up">
                  <button className="w-full px-3 py-2 text-left text-xs text-neutral-600 hover:bg-neutral-50 transition-colors">My Profile</button>
                  <button className="w-full px-3 py-2 text-left text-xs text-neutral-600 hover:bg-neutral-50 transition-colors">Settings</button>
                  <div className="h-px bg-neutral-100 my-1" />
                  <button className="w-full px-3 py-2 text-left text-xs text-red-600 font-semibold hover:bg-red-50 transition-colors">Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-[2px] w-full flex">
          <div className="flex-1 bg-[#ce1126]" />
          <div className="flex-1 bg-[#fcd116]" />
          <div className="flex-1 bg-[#005733]" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-8 lg:py-12 overflow-hidden">
        {!isCreatingNew && (
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <h2 className="text-brand-navy-800 text-[24px] lg:text-[30px] font-bold tracking-tight">Applications</h2>
            <button 
              onClick={() => setIsCreatingNew(true)}
              className="hidden sm:flex items-center gap-2 bg-brand-gold-500 hover:bg-brand-gold-700 text-brand-navy-800 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <img src={imgFilesIcon} className="w-4 h-4 brightness-0" alt="" />
              <span>New application</span>
            </button>
          </div>
        )}

        {/* Dynamic Content Views */}
        <div className="flex-grow">
          {activeTab === 'applications' && (
            <>
              {isCreatingNew ? (
                <NewApplicationSteps onBack={() => setIsCreatingNew(false)} />
              ) : applications.length > 0 ? (
                <div className="bg-white rounded-[20px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] overflow-hidden animate-fade-in-up">
                  {/* Table Header Row */}
                  <div className="bg-brand-navy-700 px-8 py-5 flex items-center text-white uppercase text-[12px] font-semibold tracking-wider">
                    <div className="w-[20%]">Application Number</div>
                    <div className="w-[20%]">Document Type</div>
                    <div className="w-[20%]">Submitted Date</div>
                    <div className="w-[15%] text-center">Status</div>
                    <div className="w-[15%]">Appointment</div>
                    <div className="w-[10%] text-right pr-4">Action</div>
                  </div>

                  {/* Table Body Rows */}
                  <div className="flex flex-col">
                    {applications.map((app, index) => (
                      <div key={index} className="px-8 py-6 flex items-center border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors last:border-0">
                        <div className="w-[20%] font-semibold text-neutral-600 text-[15px]">{app.id}</div>
                        <div className="w-[20%] text-neutral-500 text-[15px]">{app.type}</div>
                        <div className="w-[20%] text-neutral-500 text-[15px]">{app.date}</div>
                        <div className="w-[15%] flex justify-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold tracking-wide ${getStatusStyle(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="w-[15%] text-neutral-500 text-[14px] leading-relaxed pr-4">{app.appointment}</div>
                        <div className="w-[10%] flex justify-end items-center pr-4">
                          <button className="flex items-center gap-2 text-brand-navy-800 hover:text-black font-bold text-[15px] group">
                            <img src={imgViewIcon} className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-8 lg:pt-12 text-center animate-fade-in-up">
                  <div className="w-[220px] lg:w-[260px] mb-6">
                    <img src={imgEmptyStateIllustration} alt="Empty State" className="w-full h-auto drop-shadow-xl opacity-90" />
                  </div>
                  <h3 className="text-[#0a1628] text-xl lg:text-2xl font-bold mb-2 tracking-tight">No applications yet</h3>
                  <p className="text-neutral-400 text-sm lg:text-base max-w-sm mx-auto mb-8 leading-relaxed font-normal">Start your first attestation request.</p>
                  <button 
                    onClick={() => setIsCreatingNew(true)}
                    className="bg-neutral-50 border border-neutral-200 px-8 py-3 rounded-lg text-sm font-bold text-brand-navy-800 hover:bg-white hover:border-brand-navy-200 transition-all"
                  >
                    New application
                  </button>
                </div>
              )}
            </>
          )}
          {/* ... Invoices/Track Status ... */}
        </div>
      </main>

      <footer className="relative z-10 py-8 flex flex-col items-center gap-1 text-neutral-400 text-[10px] font-normal border-t border-neutral-100 bg-white/50 animate-slow-fade-in">
        <p>attestation.mfa.gov.gh</p>
        <p className="uppercase tracking-[0.1em] font-medium">© 2026 Ministry of Foreign Affairs, Ghana</p>
      </footer>
    </div>
  );
};

export default Dashboard;
