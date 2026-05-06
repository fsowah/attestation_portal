import React from 'react';
import { CheckCircle } from 'lucide-react';
import MoFACrest from '../../../assets/images/Logo_crest.png';

const ApplicationSubmittedSuccess = ({ onGoHome }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 animate-fade-in-up relative overflow-hidden min-h-[700px]">
      {/* Background Decals (from Figma pattern) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="grid grid-cols-4 gap-40 rotate-[15deg] scale-150">
          {[...Array(12)].map((_, i) => (
            <img key={i} src={MoFACrest} className="w-32 h-32" alt="" />
          ))}
        </div>
      </div>

      {/* 1. Success Icon with Rings (Reduced size) */}
      <div className="relative mb-6">
        <div className="size-[64px] bg-[#00875A] rounded-full flex items-center justify-center relative z-10">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        {/* Soft mint outer rings */}
        <div className="absolute inset-0 size-[84px] -left-[10px] -top-[10px] bg-[#00875A]/10 rounded-full" />
        <div className="absolute inset-0 size-[104px] -left-[20px] -top-[20px] bg-[#00875A]/5 rounded-full" />
      </div>

      {/* 2. Main Heading (Reduced size) */}
      <div className="text-center mb-8 max-w-[500px]">
        <h1 className="text-[22px] font-bold text-[#0A1628] mb-2">Your application has been submitted</h1>
        <p className="text-[14px] text-neutral-400 leading-snug font-medium px-4">
          An SMS has been sent to your registered number with your appointment details and reference number.
        </p>
      </div>

      {/* 3. Application ID Bar (More compact) */}
      <div className="w-full max-w-[540px] bg-[#F7FCF9] border border-[#E6F4ED] rounded-[10px] p-4 mb-4 flex items-center justify-between shadow-sm shadow-emerald-900/5">
        <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">APPLICATION ID</span>
        <span className="text-[20px] font-bold text-[#0A1628]">ATT-2026-00847</span>
      </div>

      {/* 4. Submission Details Card (More compact) */}
      <div className="w-full max-w-[540px] bg-white border border-neutral-100 rounded-[10px] p-6 pb-8 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-4">
        <h3 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider mb-1">SUBMISSION DETAILS</h3>
        
        <div className="flex flex-col gap-3.5">
          <DetailRow label="Applicant" value="Ama Dziedzom" />
          <DetailRow label="Document 1" value="University transcript" />
          <DetailRow label="Document 1" value="University transcript" />
          <DetailRow label="Total documents" value="2 documents" />
          <DetailRow label="Service tier" value="Standard 3 to 5 working days" />
          <DetailRow label="Fee paid" value="GHS 450" />
          <DetailRow label="Payment method" value="Mobile Money" />
          <DetailRow label="Appointment date" value="9:00am 9 April 2026" />
          
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[13px] text-neutral-400 font-medium">Status</span>
            <span className="bg-[#FEF9C3] text-[#A16207] px-3.5 py-1 rounded-full text-[12px] font-bold shadow-sm">
              Pending review
            </span>
          </div>
        </div>
      </div>

      {/* 5. Final CTA (Scaled down) */}
      <div className="mt-8 w-full max-w-[400px]">
        <button 
          onClick={onGoHome}
          className="w-full bg-[#0A1628] hover:bg-[#111e35] text-white h-[52px] rounded-lg text-[14px] font-bold transition-all active:scale-[0.99] shadow-lg shadow-navy-900/10"
        >
          Track my application
        </button>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-[13px] text-neutral-400 font-medium">{label}</span>
    <span className="text-[13px] text-[#0A1628] font-bold">{value}</span>
  </div>
);

export default ApplicationSubmittedSuccess;
