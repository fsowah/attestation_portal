import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download, 
  ExternalLink,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const AdminApplicationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reviewStatus, setReviewStatus] = useState('pending'); // 'pending', 'approving', 'rejecting'
  const [rejectionReason, setRejectionReason] = useState('');

  const application = {
    id: id || 'ATT-2026-00847',
    status: 'Pending review',
    submittedAt: '11 Apr 2026, 09:42 AM',
    documentType: 'Marriage Certificate',
    serviceTier: 'Express Service',
    applicant: {
      name: 'Ama Dziedzom Barnor',
      email: 'ama.dziedzom@gmail.com',
      phone: '+233 54 890 2177',
      ghanaCard: 'GHA-723491028-4',
      dob: '14 May 1992',
      address: '24 Ring Road Central, Accra, Ghana'
    },
    documents: [
      { id: 1, name: 'Marriage_Cert_Original.pdf', size: '2.4 MB', type: 'Certificate' },
      { id: 2, name: 'Ghana_Card_Front.jpg', size: '1.1 MB', type: 'Identification' },
      { id: 3, name: 'Proof_of_Residence.pdf', size: '0.8 MB', type: 'Other' }
    ],
    appointment: {
      date: '22 Apr 2026',
      time: '09:00 AM - 10:00 AM',
      location: 'Ministry of Foreign Affairs, Headquarters - Accra'
    }
  };

  const handleApprove = () => {
    setReviewStatus('approving');
    // Logic to update Supabase would go here
    setTimeout(() => {
      alert('Application Approved Successfully');
      navigate('/admin/applications');
    }, 1500);
  };

  const handleReject = () => {
    if (!rejectionReason) return alert('Please provide a reason for rejection');
    setReviewStatus('rejecting');
    // Logic to update Supabase would go here
    setTimeout(() => {
      alert('Application Rejected');
      navigate('/admin/applications');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/applications')}
            className="w-10 h-10 bg-white border border-neutral-200 rounded-lg flex items-center justify-center text-neutral-400 hover:text-brand-navy-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-brand-navy-800">{application.id}</h1>
              <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-wider">
                {application.status}
              </span>
            </div>
            <p className="text-neutral-400 text-xs mt-1">Submitted on {application.submittedAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setReviewStatus('rejecting')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-all"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject</span>
          </button>
          <button 
            onClick={handleApprove}
            disabled={reviewStatus === 'approving'}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{reviewStatus === 'approving' ? 'Processing...' : 'Approve Application'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Applicant & Appointment Info */}
        <div className="xl:col-span-1 space-y-6">
          {/* Applicant Profile */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 bg-brand-navy-800 text-white flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center text-brand-gold-500 font-black text-xl">
                {application.applicant.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">{application.applicant.name}</h2>
                <p className="text-white/50 text-xs font-medium uppercase tracking-widest mt-0.5">Applicant Profile</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="w-9 h-9 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 group-hover:bg-brand-navy-50 group-hover:text-brand-navy-600 transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</span>
                  <span className="text-sm font-semibold text-neutral-800">{application.applicant.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-9 h-9 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 group-hover:bg-brand-navy-50 group-hover:text-brand-navy-600 transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Phone Number</span>
                  <span className="text-sm font-semibold text-neutral-800">{application.applicant.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-9 h-9 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 group-hover:bg-brand-navy-50 group-hover:text-brand-navy-600 transition-all">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Ghana Card</span>
                  <span className="text-sm font-semibold text-neutral-800">{application.applicant.ghanaCard}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-9 h-9 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 group-hover:bg-brand-navy-50 group-hover:text-brand-navy-600 transition-all">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Residential Address</span>
                  <span className="text-sm font-semibold text-neutral-800 leading-tight">{application.applicant.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-brand-navy-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-gold-600" />
              <span>Appointment Info</span>
            </h3>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 space-y-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Date & Time</span>
                <span className="text-sm font-bold text-brand-navy-800">{application.appointment.date} @ {application.appointment.time}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Location</span>
                <span className="text-sm text-neutral-600 font-medium leading-relaxed">{application.appointment.location}</span>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-lg border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-all">
              Reschedule Appointment
            </button>
          </div>
        </div>

        {/* Right Column: Documents & Review */}
        <div className="xl:col-span-2 space-y-6">
          {/* Rejection Modal/Area */}
          {reviewStatus === 'rejecting' && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 space-y-4 animate-slide-down">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <h3 className="font-bold">Rejection Reason Required</h3>
              </div>
              <textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., The Supreme Court seal is not visible in the uploaded scan. Please re-upload a clearer image."
                className="w-full h-32 p-4 bg-white border border-red-200 rounded-xl outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setReviewStatus('pending')}
                  className="px-6 py-2 text-sm font-bold text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReject}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-600/10"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}

          {/* Document Section */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="font-bold text-brand-navy-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-gold-600" />
                <span>Submitted Documents</span>
              </h2>
              <span className="text-[10px] font-bold text-emerald-600 px-2 py-1 bg-emerald-50 rounded-full uppercase tracking-wider">Verified Format</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.documents.map((doc) => (
                <div key={doc.id} className="p-4 border border-neutral-100 rounded-xl hover:border-brand-gold-300 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 group-hover:bg-brand-gold-50 group-hover:text-brand-gold-600 transition-all">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-neutral-300 hover:text-brand-navy-800 hover:bg-neutral-50 rounded-lg transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-neutral-300 hover:text-brand-gold-600 hover:bg-brand-gold-50 rounded-lg transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{doc.type}</span>
                    <span className="text-sm font-bold text-brand-navy-800 truncate">{doc.name}</span>
                    <span className="text-xs text-neutral-400 mt-1">{doc.size}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Viewer Mockup */}
            <div className="px-6 pb-6">
              <div className="w-full h-[500px] bg-neutral-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-neutral-200 relative group">
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl z-10">
                   <button className="bg-white text-brand-navy-800 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-2xl active:scale-95 transition-all">
                     <ExternalLink className="w-5 h-5" />
                     <span>Open Fullscreen Viewer</span>
                   </button>
                </div>
                <div className="flex flex-col items-center gap-4 text-neutral-400">
                  <FileText className="w-16 h-16 opacity-20" />
                  <p className="text-sm font-medium">Click a document to preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationDetail;
