import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ApplicationDetailsModal from './components/ApplicationDetailsModal';
import { HelpCircle, User, ChevronDown, FileText, Receipt, Navigation, LogOut, Loader2, Menu, X } from 'lucide-react';
import LogoCrest from '../../assets/images/Logo_crest.png';
import Adinkra1 from '../../assets/images/adinkra_1.svg';
import Adinkra2 from '../../assets/images/adinkra_2.svg';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const NAV_ITEMS = [
  { path: '/dashboard/applications', label: 'Applications', icon: FileText },
  { path: '/dashboard/invoices',     label: 'Invoices',     icon: Receipt },
  { path: '/dashboard/track-status', label: 'Track status', icon: Navigation },
];

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#fcfbf9] flex flex-col font-inter relative overflow-hidden text-neutral-800">
      {/* Decorative Background Symbols */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[-5%] w-[110%] h-[110%] flex flex-wrap gap-48 rotate-[-5deg]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex gap-48 opacity-20">
              <img src={Adinkra1} className="w-24 h-24 rotate-12" alt="" />
              <img src={Adinkra2} className="w-20 h-20 -rotate-12 mt-20" alt="" />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-30 shadow-lg" style={{ background: 'linear-gradient(180deg, #0D1F36 6.51%, #0C4FA5 114.68%)' }}>
        <div className="max-w-[1440px] mx-auto px-5 lg:px-10 xl:px-16 2xl:px-20 py-2.5 lg:py-3 flex flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-12 lg:h-12 lg:w-14 shrink-0">
              <img src={LogoCrest} alt="MFA Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-white font-medium text-xs lg:text-[14px] leading-tight">Ministry of Foreign Affairs</h1>
              <p className="text-brand-gold-500 font-normal text-[10px] lg:text-[11px] tracking-wide">Republic of Ghana • Document Attestation Portal</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 lg:gap-8">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-2 px-3 py-3.5 border-t-2 transition-all duration-300 ${isActive(path) ? 'border-brand-gold-500 text-white' : 'border-transparent text-white/70 hover:text-white'}`}
              >
                <Icon className="w-4 h-4 text-white" />
                <span className="font-medium text-[15px]">{label}</span>
              </button>
            ))}
          </nav>

          {/* Right: help + profile + hamburger */}
          <div className="flex items-center gap-3 lg:gap-5">
            <div className="hidden xl:flex items-center gap-1.5 cursor-pointer group">
              <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium text-xs">Help</span>
            </div>

            <div className="hidden lg:block relative" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
              <button className="flex items-center gap-2.5 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full hover:bg-white/10 transition-all">
                <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium text-xs hidden sm:inline">{profile?.full_name || 'My Account'}</span>
                <ChevronDown className={`w-3 h-3 text-white transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-neutral-100 py-1.5 animate-fade-in-up z-50">
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

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Ghana flag stripe */}
        <div className="h-[2px] w-full flex">
          <div className="flex-1 bg-[#ce1126]" />
          <div className="flex-1 bg-[#fcd116]" />
          <div className="flex-1 bg-[#005733]" />
        </div>

        {/* Mobile drawer */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden absolute top-full left-0 w-full animate-slide-down shadow-2xl overflow-hidden flex flex-col"
            style={{
              height: '45vh',
              background: 'linear-gradient(180deg, #0D1F36 6.51%, #0C4FA5 114.68%)',
              borderBottomLeftRadius: '20px',
              borderBottomRightRadius: '20px',
            }}
          >
            <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">{profile?.full_name || 'My Account'}</p>
                <p className="text-white/50 text-xs mt-0.5 truncate">{user?.email}</p>
              </div>
            </div>

            <nav className="flex flex-col px-4 pt-3 gap-1 flex-grow">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                const active = isActive(path);
                return (
                  <button
                    key={path}
                    onClick={() => { navigate(path); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                      active
                        ? 'bg-white/15 border-l-[3px] border-brand-gold-500 text-brand-gold-500 font-semibold'
                        : 'border-l-[3px] border-transparent text-white/60 hover:text-white hover:bg-white/8'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-brand-gold-500' : 'text-white/50'}`} />
                    <span className="text-[15px]">{label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="px-4 pb-5 pt-3 border-t border-white/10">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 text-white/50 hover:text-red-400 transition-colors text-sm rounded-xl hover:bg-white/5 w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-grow max-w-[1440px] mx-auto w-full px-4 md:px-6 lg:px-10 xl:px-16 2xl:px-20 py-4 lg:py-6 xl:py-8 overflow-hidden">
        <Outlet context={{ applications, isLoading, fetchApplications, setSelectedApplication }} />
      </main>

      <footer className="relative z-10 py-4 flex flex-col items-center gap-0.5 text-[#9e9c99] text-[11px] font-normal border-t border-neutral-100/50 bg-white/30 animate-slow-fade-in">
        <p>attestation.mfa.gov.gh</p>
        <p>© 2026 Ministry of Foreign Affairs, Ghana</p>
      </footer>

      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
