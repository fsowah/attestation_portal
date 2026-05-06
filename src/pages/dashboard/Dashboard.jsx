import React, { useState, useEffect } from 'react';
import NewApplicationSteps from './components/NewApplicationSteps';
import ApplicationDetailsModal from './components/ApplicationDetailsModal';
import { HelpCircle, User, ChevronDown, FileText, Receipt, Navigation, Eye, Inbox, LogOut, Loader2 } from 'lucide-react';
import LogoCrest from '../../assets/images/Logo_crest.png';
import Adinkra1 from '../../assets/images/adinkra_1.svg';
import Adinkra2 from '../../assets/images/adinkra_2.svg';
import EmptyStateIllustration from '../../assets/images/illustration_fallback.png';
import FilesIcon from '../../assets/images/files_icon.svg';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('applications'); // 'applications', 'invoices', 'track'
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'Pending review':
        return 'bg-[#fef6b8] text-[#7a6209] border border-[#f5e6a0]';
      case 'Approved':
      case 'Completed':
        return 'bg-[#e5f4ed] text-[#004728] border border-[#c3e6d5]';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border border-red-100';
      default:
        return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] flex flex-col font-inter relative overflow-hidden text-neutral-800">
      {/* Decorative Background Symbols (Adinkra) */}
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

      {/* Global Navigation Header */}
      <header className="relative z-20 bg-[#0a1628] shadow-lg">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-16 2xl:px-20 py-3 lg:py-4 xl:py-5 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-12 lg:h-12 lg:w-14 shrink-0">
              <img src={LogoCrest} alt="MFA Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-white font-medium text-xs lg:text-[14px] leading-tight">Ministry of Foreign Affairs</h1>
              <p className="text-brand-gold-500 font-normal text-[10px] lg:text-[11px] tracking-wide">Republic of Ghana • Document Attestation Portal</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 lg:gap-8">
            <button onClick={() => setActiveTab('applications')} className={`flex items-center gap-2 px-3 py-1.5 lg:py-3.5 border-t-2 transition-all duration-300 ${activeTab === 'applications' ? 'border-brand-gold-500 text-white' : 'border-transparent text-white/70 hover:text-white'}`}>
              <FileText className="w-4 h-4 text-white" />
              <span className="font-medium text-sm lg:text-[15px]">Applications</span>
            </button>
            <button onClick={() => setActiveTab('invoices')} className={`flex items-center gap-2 px-3 py-1.5 lg:py-3.5 border-t-2 transition-all duration-300 ${activeTab === 'invoices' ? 'border-brand-gold-500 text-white' : 'border-transparent text-white/70 hover:text-white'}`}>
              <Receipt className="w-4 h-4 text-white" />
              <span className="font-medium text-sm lg:text-[15px]">Invoices</span>
            </button>
            <button onClick={() => setActiveTab('track')} className={`flex items-center gap-2 px-3 py-1.5 lg:py-3.5 border-t-2 transition-all duration-300 ${activeTab === 'track' ? 'border-brand-gold-500 text-white' : 'border-transparent text-white/70 hover:text-white'}`}>
              <Navigation className="w-4 h-4 text-white" />
              <span className="font-medium text-sm lg:text-[15px]">Track status</span>
            </button>
          </nav>

          <div className="flex items-center gap-5">
            <div className="hidden xl:flex items-center gap-1.5 cursor-pointer group">
              <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium text-xs">Help</span>
            </div>

            <div className="relative" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
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
          </div>
        </div>
        <div className="h-[2px] w-full flex">
          <div className="flex-1 bg-[#ce1126]" />
          <div className="flex-1 bg-[#fcd116]" />
          <div className="flex-1 bg-[#005733]" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow max-w-[1440px] mx-auto w-full px-6 lg:px-10 xl:px-16 2xl:px-20 py-8 lg:py-12 xl:py-16 overflow-hidden">
        {!isCreatingNew && (
          <div className="flex items-center justify-between mb-8 xl:mb-12 animate-fade-in-up">
            <h2 className="text-brand-navy-800 text-[24px] lg:text-[30px] xl:text-[36px] font-bold tracking-tight">Applications</h2>
            <button
              onClick={() => setIsCreatingNew(true)}
              className="hidden sm:flex items-center gap-2 bg-[#fcd116] hover:bg-[#e3bc14] text-[#0a1628] px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <img src={FilesIcon} className="w-5 h-5" alt="" />
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
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-brand-gold-500 animate-spin" />
                  <p className="mt-4 text-neutral-400 font-medium">Loading your applications...</p>
                </div>
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
                        <div className="w-[20%] text-neutral-500 text-[15px]">{app.document_type}</div>
                        <div className="w-[20%] text-neutral-500 text-[15px]">
                          {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                        </div>
                        <div className="w-[15%] flex justify-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${getStatusStyle(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="w-[15%] text-neutral-500 text-[13px] leading-relaxed pr-4">
                          {app.appointment_details ? (
                            <div className="flex flex-col">
                              <span className="font-bold text-neutral-700">{app.appointment_details.date}</span>
                              <span className="text-[11px] opacity-70">{app.appointment_details.time}</span>
                            </div>
                          ) : (
                            <span className="italic opacity-40">No appointment</span>
                          )}
                        </div>
                        <div className="w-[10%] flex justify-end items-center pr-4">
                          <button 
                            onClick={() => setSelectedApplication(app)}
                            className="flex items-center gap-2 text-brand-navy-800 hover:text-black font-bold text-[14px] group"
                          >
                            <Eye className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up max-w-[600px] mx-auto">
                  <div className="w-full max-w-[340px] mb-8">
                    <img 
                      src={EmptyStateIllustration} 
                      alt="No applications" 
                      className="w-full h-auto drop-shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2 mb-10">
                    <h3 className="text-[#0a1628] text-[24px] font-bold tracking-tight">No applications yet</h3>
                    <p className="text-[#908e8a] text-base leading-relaxed">
                      Start your first attestation request. It takes less than 10 minutes to submit your documents online.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreatingNew(true)}
                    className="flex items-center gap-2 bg-[#f9f8f7] hover:bg-neutral-100 text-[#081524] px-10 py-3 rounded-lg text-[14px] font-semibold transition-all shadow-sm border border-neutral-100"
                  >
                    <img src={FilesIcon} className="w-5 h-5" alt="" />
                    <span>New application</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="relative z-10 py-12 flex flex-col items-center gap-1 text-[#9e9c99] text-[12px] font-normal border-t border-neutral-100/50 bg-white/30 animate-slow-fade-in">
        <p>attestation.mfa.gov.gh</p>
        <p>© 2026 Ministry of Foreign Affairs, Ghana</p>
      </footer>

      {/* Details Modal */}
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
