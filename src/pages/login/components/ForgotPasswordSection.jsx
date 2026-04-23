import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

const ForgotPasswordSection = ({ onBack, onSendCode }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className="flex-grow w-full flex flex-col p-6 lg:px-20 lg:py-8 overflow-y-auto animate-slide-in-right">
      {/* Back Button */}
      <div className="flex justify-start mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-neutral-600 transition-colors group"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-[13px] font-semibold">Back to Login</span>
        </button>
      </div>

      <div className="max-w-lg mx-auto w-full flex-grow flex flex-col justify-center lg:justify-start lg:pt-4">
        <div className="mb-8">
          <h1 className="text-neutral-800 text-[28px] lg:text-[32px] font-bold mb-1 tracking-tight">Forgot password?</h1>
          <p className="text-neutral-500 text-[15px] lg:text-base font-normal leading-relaxed">
            Enter the phone number linked to your account and we will send a 6-digit reset code.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          <div className="space-y-1.5">
            <label className="text-neutral-500 font-bold text-[9px] uppercase tracking-wider">PHONE NUMBER</label>
            <div className="phone-input-container">
              <PhoneInput
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={setPhoneNumber}
                defaultCountry="GH"
                className="w-full h-10 px-4 border border-neutral-200 rounded-lg focus-within:border-brand-navy-700 transition-colors text-neutral-800 text-sm flex items-center gap-3 bg-white"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => onSendCode(phoneNumber)}
          className="w-full h-10 bg-brand-gold-500 hover:bg-brand-gold-700 text-brand-navy-700 font-bold text-sm rounded-lg transition-all shadow-sm mb-4"
        >
          Send reset code
        </button>

        <div className="w-full h-px bg-neutral-100 mb-6" />

        <button 
          onClick={onBack}
          className="w-full h-10 bg-white border border-brand-navy-800 hover:bg-neutral-50 text-brand-navy-800 font-bold text-sm rounded-lg transition-all mb-6"
        >
          Back to sign in
        </button>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-neutral-400 text-[10px] mt-6 gap-4 shrink-0">
        <p className="font-bold">attestation.mfa.gov.gh</p>
        <p className="font-bold uppercase tracking-wider">© 2026 Ministry of Foreign Affairs, Ghana</p>
      </div>
    </div>
  );
};

export default ForgotPasswordSection;
