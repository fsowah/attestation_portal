import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Loader2,
  Clock
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import StatusTimeline from '../../components/StatusTimeline';

const AdminApplicationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewStatus, setReviewStatus] = useState('pending'); // 'pending', 'approving', 'rejecting'
  const [rejectionReason, setRejectionReason] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('application_status_history')
      .select('*')
      .eq('application_id', id)
      .order('changed_at', { ascending: true })
      .then(({ data }) => setHistory(data || []));
  }, [id]);

  const fetchApplication = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    setReviewStatus('approving');
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'Approved' })
        .eq('id', id);

      if (error) throw error;
      await supabase
        .from('application_status_history')
        .insert([{ application_id: id, status: 'Approved', changed_by: user?.id }]);
      alert('Application Approved Successfully');
      navigate('/admin/applications');
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve application');
      setReviewStatus('pending');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) return alert('Please provide a reason for rejection');
    setReviewStatus('rejecting');
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status: 'Rejected',
          rejection_reason: rejectionReason
        })
        .eq('id', id);

      if (error) throw error;
      await supabase
        .from('application_status_history')
        .insert([{ application_id: id, status: 'Rejected', changed_by: user?.id, notes: rejectionReason }]);
      alert('Application Rejected');
      navigate('/admin/applications');
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application');
      setReviewStatus('pending');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-brand-gold-500 animate-spin" />
        <p className="mt-4 text-neutral-400 font-medium">Loading application details...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500">Application not found.</p>
        <button onClick={() => navigate('/admin/applications')} className="mt-4 text-brand-navy-800 font-bold underline">Go back</button>
      </div>
    );
  }

  const applicant = application.personal_details || {};
  const appointment = application.appointment_details || {};
  const docs = application.documents || [];

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
              <span className={`px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider ${
                application.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                application.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {application.status}
              </span>
            </div>
            <p className="text-neutral-400 text-xs mt-1">Submitted on {new Date(application.submitted_at).toLocaleString()}</p>
          </div>
        </div>

        {application.status === 'Pending review' && (
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
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Applicant & Appointment Info */}
        <div className="xl:col-span-1 space-y-6">
          {/* Applicant Profile */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 bg-brand-navy-800 text-white flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center text-brand-gold-500 font-black text-xl">
                {(applicant.fullName || 'U').charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">{applicant.fullName || 'Unknown'}</h2>
                <p className="text-white/50 text-xs font-medium uppercase tracking-widest mt-0.5">Applicant Profile</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="w-9 h-9 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 group-hover:bg-brand-navy-50 group-hover:text-brand-navy-600 transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Phone Number</span>
                  <span className="text-sm font-semibold text-neutral-800">{applicant.phoneNumber || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-9 h-9 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 group-hover:bg-brand-navy-50 group-hover:text-brand-navy-600 transition-all">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Ghana Card</span>
                  <span className="text-sm font-semibold text-neutral-800">{applicant.ghanaCardNumber || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-9 h-9 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 group-hover:bg-brand-navy-50 group-hover:text-brand-navy-600 transition-all">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Date of Birth</span>
                  <span className="text-sm font-semibold text-neutral-800">{applicant.dob || 'N/A'}</span>
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
                <span className="text-sm font-bold text-brand-navy-800">{appointment.date || 'TBD'} @ {appointment.time || 'TBD'}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Document Type</span>
                <span className="text-sm text-neutral-600 font-medium leading-relaxed">{application.document_type}</span>
              </div>
            </div>
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
              {docs.map((doc) => (
                <div key={doc.id} className="p-4 border border-neutral-100 rounded-xl hover:border-brand-gold-300 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 group-hover:bg-brand-gold-50 group-hover:text-brand-gold-600 transition-all">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-neutral-300 hover:text-brand-navy-800 hover:bg-neutral-50 rounded-lg transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-neutral-300 hover:text-brand-gold-600 hover:bg-brand-gold-50 rounded-lg transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
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

            {/* Status History */}
            <div className="px-6 pb-6">
              <div className="flex items-center gap-2 mb-5 pt-2 border-t border-neutral-50">
                <Clock className="w-4 h-4 text-brand-gold-600" />
                <h3 className="font-bold text-brand-navy-800 text-sm uppercase tracking-wider">Status History</h3>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <StatusTimeline history={history} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationDetail;
