import React, { useState, useRef } from 'react';

const VerificationSection = ({ onBack, onVerify }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple chars
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex-grow w-full flex flex-col p-6 lg:px-16 lg:py-8 overflow-y-auto animate-slide-in-right">
      {/* Back Button for OTP */}
      <div className="flex justify-start mb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-neutral-600 transition-colors group"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-[13px] font-semibold">Back to Sign up</span>
        </button>
      </div>

      <div className="max-w-lg mx-auto w-full flex-grow flex flex-col justify-center">
        <div className="mb-6">
          <h1 className="text-neutral-800 text-[32px] font-bold mb-1 tracking-tight">Enter verification code</h1>
          <p className="text-neutral-500 text-sm font-normal leading-relaxed">
            A 6-digit code was sent to your number ending with <span className="text-neutral-800 font-semibold">+233 xx xxx xx67</span>.
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (otpRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-[60px] h-[80px] text-center text-2xl font-bold bg-[#fffce5]/50 border border-brand-gold-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold-500 transition-all text-neutral-800"
            />
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-[13px] font-medium text-neutral-400">
            Didn't receive the code? <span className="text-brand-gold-700 font-bold cursor-pointer hover:underline">Resend it</span>
          </p>
          <p className="text-[13px] font-medium text-neutral-600">
            Code expires in 00:32
          </p>
        </div>

        <button 
          onClick={onVerify}
          className="w-full h-10 bg-brand-gold-500 hover:bg-brand-gold-700 text-brand-navy-700 font-bold text-sm rounded-lg transition-all shadow-sm mb-4"
        >
          Verify
        </button>

        <div className="text-center">
          <p className="text-neutral-400 text-xs font-medium">
            Having trouble? Contact mfa support at <span className="text-neutral-800 font-bold cursor-pointer hover:underline">support@mfa.gov.gh</span>
          </p>
        </div>
      </div>

      {/* Footer for OTP */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-neutral-400 text-[10px] mt-6 gap-4 shrink-0">
        <p className="font-bold">attestation.mfa.gov.gh</p>
        <p className="font-bold uppercase tracking-wider">© 2026 Ministry of Foreign Affairs, Ghana</p>
      </div>
    </div>
  );
};

export default VerificationSection;
