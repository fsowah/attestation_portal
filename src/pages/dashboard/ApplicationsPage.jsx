import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Eye, Loader2 } from 'lucide-react';
import EmptyStateIllustration from '../../assets/images/illustration_fallback.png';
import FilesIcon from '../../assets/images/files_icon.svg';

const ApplicationsPage = () => {
  const { applications, isLoading, setSelectedApplication } = useOutletContext();
  const navigate = useNavigate();

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

  return (
    <>
      <div className="flex items-center justify-between mb-4 xl:mb-6 animate-fade-in-up">
        <h2 className="text-brand-navy-800 text-[20px] lg:text-[24px] xl:text-[28px] font-bold tracking-tight">Applications</h2>
        <button
          onClick={() => navigate('/dashboard/new-application')}
          className="flex items-center gap-2 bg-[#fcd116] hover:bg-[#e3bc14] text-[#0a1628] px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <img src={FilesIcon} className="w-4 h-4" alt="" />
          <span>New application</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-brand-gold-500 animate-spin" />
          <p className="mt-4 text-neutral-400 font-medium">Loading your applications...</p>
        </div>
      ) : applications.length > 0 ? (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-[20px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] overflow-hidden animate-fade-in-up">
            <div className="bg-brand-navy-700 px-6 py-3 flex items-center text-white uppercase text-[11px] font-semibold tracking-wider">
              <div className="w-[20%]">Application Number</div>
              <div className="w-[20%]">Document Type</div>
              <div className="w-[20%]">Submitted Date</div>
              <div className="w-[15%] text-center">Status</div>
              <div className="w-[15%]">Appointment</div>
              <div className="w-[10%] text-right pr-4">Action</div>
            </div>
            <div className="flex flex-col">
              {applications.map((app, index) => (
                <div key={index} className="px-6 py-3.5 flex items-center border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors last:border-0">
                  <div className="w-[20%] font-semibold text-neutral-600 text-[13px]">{app.id}</div>
                  <div className="w-[20%] text-neutral-500 text-[13px]">{app.document_type}</div>
                  <div className="w-[20%] text-neutral-500 text-[13px]">
                    {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                  </div>
                  <div className="w-[15%] flex justify-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="w-[15%] text-neutral-500 text-[12px] leading-relaxed pr-4">
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
                      className="flex items-center gap-2 text-brand-navy-800 hover:text-black font-bold text-[13px] group"
                    >
                      <Eye className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3 animate-fade-in-up">
            {applications.map((app, index) => (
              <div key={index} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest truncate">{app.id}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0 ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                <div className="px-4 pb-3">
                  <h3 className="text-[16px] font-bold text-brand-navy-800 leading-snug">{app.document_type}</h3>
                </div>
                <div className="h-px bg-neutral-100 mx-4" />
                <div className="px-4 py-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-neutral-400 font-medium">Submitted</span>
                    <span className="text-[12px] font-semibold text-neutral-700">
                      {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-neutral-400 font-medium">Appointment</span>
                    {app.appointment_details ? (
                      <span className="text-[12px] font-semibold text-neutral-700">
                        {app.appointment_details.date}{app.appointment_details.time ? ` · ${app.appointment_details.time}` : ''}
                      </span>
                    ) : (
                      <span className="text-[12px] text-neutral-300 italic">Not scheduled</span>
                    )}
                  </div>
                </div>
                <div className="px-4 pb-4 pt-1">
                  <button
                    onClick={() => setSelectedApplication(app)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-navy-800 hover:bg-black text-white rounded-xl text-[13px] font-bold transition-all active:scale-95"
                  >
                    <Eye className="w-4 h-4" />
                    View Application
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in-up max-w-[500px] mx-auto">
          <div className="w-full max-w-[220px] mb-5">
            <img src={EmptyStateIllustration} alt="No applications" className="w-full h-auto drop-shadow-sm" />
          </div>
          <div className="flex flex-col gap-1.5 mb-7">
            <h3 className="text-[#0a1628] text-[20px] font-bold tracking-tight">No applications yet</h3>
            <p className="text-[#908e8a] text-sm leading-relaxed">
              Start your first attestation request. It takes less than 10 minutes to submit your documents online.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/new-application')}
            className="flex items-center gap-2 bg-[#f9f8f7] hover:bg-neutral-100 text-[#081524] px-8 py-2.5 rounded-lg text-[13px] font-semibold transition-all shadow-sm border border-neutral-100"
          >
            <img src={FilesIcon} className="w-4 h-4" alt="" />
            <span>New application</span>
          </button>
        </div>
      )}
    </>
  );
};

export default ApplicationsPage;
