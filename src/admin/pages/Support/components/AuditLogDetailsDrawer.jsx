import React from 'react';
import { X } from 'lucide-react';

const AuditLogDetailsDrawer = ({ isOpen, onClose, logData }) => {
  if (!logData) return null;

  const getCategoryBadge = (category) => {
    switch(category) {
      case 'Payment':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#f3e8ff] text-[#9333ea]">Payment</span>;
      case 'Submission':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#dcfce7] text-[#166534]">Submission</span>;
      case 'User':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#e0f2fe] text-[#0369a1]">User</span>;
      case 'Config':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#fef3c7] text-[#b45309]">Config</span>;
      case 'Auth':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#f1f5f9] text-[#475569]">Auth</span>;
      default:
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">{category}</span>;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-5 shrink-0 flex justify-between items-start">
          <div className="pr-4">
            <h2 className="text-[18px] font-bold text-[#1e293b] mb-2 leading-tight">
              {logData.action}
            </h2>
            <p className="text-[12px] font-medium text-gray-400">
              Submitted Date: {logData.date.split(' ')[0]} May 2026 {/* Mock formatting */}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors shrink-0"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          
          <h3 className="text-[12px] font-bold text-[#1e293b] mb-6">Event Details</h3>

          <div className="flex flex-col gap-5">
            {logData.reference && (
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-gray-500">Reference</span>
                <span className="text-[13px] font-bold text-[#1e293b]">{logData.reference}</span>
              </div>
            )}
            
            {/* Mocking additional data fields for demonstration as per Figma */}
            {logData.category === 'Payment' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-medium text-gray-500">Amount</span>
                  <span className="text-[13px] font-bold text-[#1e293b]">GHS 450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-medium text-gray-500">Payment method</span>
                  <span className="text-[13px] font-bold text-[#1e293b]">MTN MoMo</span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-gray-500">Category</span>
              <div>{getCategoryBadge(logData.category)}</div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-gray-500">Transaction ID</span>
              <span className="text-[13px] font-bold text-[#1e293b]">EPY-928374</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-gray-500">IP address</span>
              <span className="text-[13px] font-bold text-[#1e293b]">192.168.1.1</span>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditLogDetailsDrawer;
