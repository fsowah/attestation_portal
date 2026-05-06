import React from 'react';
import { X, FileText, Calendar, CreditCard, User, Download, ExternalLink, Printer } from 'lucide-react';
import MoFACrest from '../../../assets/images/Logo_crest.png';

const ApplicationDetailsModal = ({ application, onClose }) => {
  if (!application) return null;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Pending review':
        return 'bg-[#fef6b8] text-[#7a6209] border-[#f5e6a0]';
      case 'Approved':
      case 'Completed':
        return 'bg-[#e5f4ed] text-[#004728] border-[#c3e6d5]';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 animate-fade-in">
      <div className="absolute inset-0 bg-[#0a1628]/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-[900px] bg-white rounded-[24px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-brand-gold-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand-gold-600" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-brand-navy-900 leading-tight">Application Details</h2>
              <p className="text-[12px] text-neutral-400 font-medium uppercase tracking-wider">{application.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-neutral-500 hover:text-brand-navy-900 hover:bg-neutral-50 rounded-lg transition-all text-sm font-bold border border-neutral-100"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-grow overflow-y-auto p-8 lg:p-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column: Summary & Status */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <div className="flex flex-col gap-4 p-6 bg-neutral-50/50 rounded-2xl border border-neutral-100">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Current Status</span>
                <div className={`px-4 py-2 rounded-full border text-[13px] font-bold text-center ${getStatusStyle(application.status)}`}>
                  {application.status}
                </div>
                <div className="h-px bg-neutral-100 my-2" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Submitted On</span>
                  <span className="text-[14px] font-bold text-brand-navy-900">
                    {application.submission_date ? new Date(application.submission_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-6 bg-brand-navy-900 rounded-2xl text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-brand-gold-500" />
                  <span className="text-[13px] font-bold">Appointment</span>
                </div>
                {application.appointment_details ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <span className="text-[20px] font-bold tracking-tight">{application.appointment_details.date}</span>
                      <span className="text-[13px] opacity-70 font-medium">{application.appointment_details.time}</span>
                    </div>
                    <div className="text-[11px] bg-white/10 p-3 rounded-lg border border-white/10 leading-relaxed">
                       Main Ministry Building, Independence Ave, Accra. Please arrive 15 mins early.
                    </div>
                  </div>
                ) : (
                  <p className="text-sm opacity-60 italic">No appointment scheduled</p>
                )}
              </div>
            </div>

            {/* Right Column: Detailed Info */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              
              {/* Personal Details */}
              <section className="flex flex-col gap-5">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                  <User className="w-5 h-5 text-neutral-400" />
                  <h3 className="text-[16px] font-bold text-brand-navy-900">Applicant Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Full Name</span>
                    <span className="text-[14px] font-bold text-neutral-700">{application.personal_details?.fullName}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Phone Number</span>
                    <span className="text-[14px] font-bold text-neutral-700">{application.personal_details?.phone}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Document Type</span>
                    <span className="text-[14px] font-bold text-neutral-700">{application.document_type}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Service Tier</span>
                    <span className="text-[14px] font-bold text-neutral-700">{application.service_tier}</span>
                  </div>
                </div>
              </section>

              {/* Uploaded Documents */}
              <section className="flex flex-col gap-5">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                  <FileText className="w-5 h-5 text-neutral-400" />
                  <h3 className="text-[16px] font-bold text-brand-navy-900">Uploaded Documents</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {application.documents?.map((doc, idx) => (
                    <div key={idx} className="p-4 bg-white border border-neutral-100 rounded-xl flex items-center justify-between group hover:border-brand-gold-500/30 hover:bg-neutral-50/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-neutral-100 rounded-lg flex items-center justify-center group-hover:bg-brand-gold-500/10 transition-colors">
                          <FileText className="w-5 h-5 text-neutral-400 group-hover:text-brand-gold-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-neutral-800 tracking-tight truncate max-w-[120px]">{doc.name}</span>
                          <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">{doc.type}</span>
                        </div>
                      </div>
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="size-8 flex items-center justify-center rounded-lg text-neutral-300 hover:text-brand-navy-900 hover:bg-white transition-all shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                  {(!application.documents || application.documents.length === 0) && (
                    <p className="text-sm text-neutral-400 italic">No documents found</p>
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 opacity-40 grayscale pointer-events-none">
             <img src={MoFACrest} className="h-10 w-auto" alt="" />
             <div className="flex flex-col text-[10px] font-medium leading-tight">
               <span>Ministry of Foreign Affairs</span>
               <span>Republic of Ghana</span>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-brand-navy-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;
