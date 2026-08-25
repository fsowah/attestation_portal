import React, { useState } from 'react';
import { X, Download, FileText, Send, Loader2 } from 'lucide-react';
import { supabase } from '../../../../supabaseClient';
import { useAuth } from '../../../../context/AuthContext';

const OfficerApplicationDrawer = ({ application, onClose, onRefresh }) => {
  const { user } = useAuth();
  const [isForwarding, setIsForwarding] = useState(false);

  if (!application) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending review':
        return <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-[11px] font-bold">Pending review</span>;
      case 'Approved':
        return <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] font-bold">Approved</span>;
      case 'Rejected':
        return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-[11px] font-bold">Rejected</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const getServiceBadge = (service) => {
    switch (service) {
      case 'Express':
        return <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold">Express</span>;
      case 'Standard':
        return <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">Standard</span>;
      default:
        return <span>{service}</span>;
    }
  };

  const docs = application.documents || [];
  const payment = application.payment_details || {};
  const personal = application.personal_details || {};

  const handleForwardToDirector = async () => {
    if (!user) return;
    setIsForwarding(true);
    try {
      // 1. Select available director
      const { data: directorId, error: rpcError } = await supabase.rpc('select_available_director', {
        p_officer_id: user.id
      });

      if (rpcError) throw rpcError;

      if (!directorId) {
        alert('No available director found or limit reached. Please try again later.');
        return;
      }

      // 2. Update application status and director
      const { error: updateError } = await supabase
        .from('applications')
        .update({ 
          status: 'Forwarded to Director',
          assigned_director_id: directorId
        })
        .eq('id', application.id);

      if (updateError) throw updateError;

      // 3. Log history
      await supabase.from('application_status_history').insert({
        application_id: application.id,
        status: 'Forwarded to Director',
        changed_by: user.id,
        comments: 'Auto-forwarded to available director'
      });

      alert('Application forwarded successfully.');
      onRefresh?.();
      onClose();
    } catch (err) {
      console.error('Error forwarding:', err);
      alert('Failed to forward application: ' + err.message);
    } finally {
      setIsForwarding(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[500px] bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{application.id}</h2>
            <p className="text-sm text-gray-500 mt-1">Submitted Date: {formatDate(application.submitted_at)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          
          {/* Applicant Section */}
          <section>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Applicant</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Name</span>
                <span className="font-bold text-gray-900">{application.full_name || personal.fullName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ghana Card</span>
                <span className="font-bold text-gray-900">{application.ghana_card_number || personal.ghanaCardNumber || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phone Number</span>
                <span className="font-bold text-gray-900">{application.phone_number || personal.phoneNumber || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Status</span>
                {getStatusBadge(application.status)}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Appointment</span>
                <span className="font-bold text-gray-900">
                  {application.appointment_details?.date ? `${formatDate(application.appointment_details.date)} ${application.appointment_details.time}` : 'Not scheduled'}
                </span>
              </div>
            </div>
          </section>

          {/* Documents Section */}
          <section>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Documents</h3>
            <div className="flex flex-col gap-3">
              {docs.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 flex items-center justify-center rounded-lg shrink-0">
                       <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-gray-900 truncate">{doc.name || 'Document'}</span>
                      <span className="text-[11px] text-gray-500 mt-0.5">{doc.size || 'Unknown size'}</span>
                    </div>
                  </div>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors shrink-0">
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              ))}
              {docs.length === 0 && <p className="text-sm text-gray-500">No documents attached.</p>}
            </div>
          </section>

          {/* Payment Section */}
          <section>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Payment</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Service Tier</span>
                {getServiceBadge(application.service_tier)}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-bold text-gray-900">{payment.price ? `GHS ${payment.price}` : 'GHS 0'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-bold text-gray-900">{payment.paymentMethod === 'momo' ? `${payment.momoNetwork} MoMo` : (payment.paymentMethod === 'card' ? 'Card' : '-')}</span>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white shrink-0">
          <button className="px-5 h-11 border border-red-200 text-red-600 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors">
            Reject
          </button>
          
          {application.status === 'Pending review' && (
            <button 
              onClick={handleForwardToDirector}
              disabled={isForwarding}
              className="px-5 h-11 bg-[#fef3c7] text-[#b45309] font-bold text-sm rounded-lg hover:bg-[#fde68a] transition-colors shadow-sm flex items-center gap-2"
            >
              {isForwarding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Forward to Director
            </button>
          )}

          <button className="px-5 h-11 bg-[#0a1b35] text-white font-bold text-sm rounded-lg hover:bg-[#122b50] transition-colors shadow-sm">
            Approve Check-in
          </button>
        </div>
      </div>
    </>
  );
};

export default OfficerApplicationDrawer;
