import React, { useState, useRef } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

const VerificationSection = ({ onBack, onVerify, isLoading, error, onResend }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const handleVerifyClick = () => {
    const code = otp.join('');
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple chars unless pasted
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.length === 0) return;
    
    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (index < 6 && /^[0-9]$/.test(char)) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    
    const lastIndex = Math.min(pastedData.length, 5);
    otpRefs.current[lastIndex].focus();
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

      <div className="max-w-md mx-auto w-full flex-grow flex flex-col justify-center items-center text-center lg:justify-start lg:pt-12">
        <div className="mb-8">
          <h1 className="text-neutral-800 text-[28px] lg:text-[32px] font-bold mb-2 tracking-tight">Verify your number</h1>
          <p className="text-neutral-500 text-[15px] lg:text-base font-medium leading-relaxed max-w-xs mx-auto">
            Enter the 6-digit code we sent to your phone number.
          </p>
        </div>

        {error && (
          <div className="mb-6 w-full p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
        )}

        <div className="flex gap-2 lg:gap-3 mb-8 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (otpRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-11 h-16 lg:w-[60px] lg:h-[80px] text-center text-xl lg:text-2xl font-bold bg-[#fffdf0] border border-[#e5c05c] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold-500 transition-all text-neutral-800"
            />
          ))}
        </div>

        <div className="text-center space-y-2 mb-8">
          <p className="text-[13px] font-medium text-neutral-400">
            Didn't receive the code? <span onClick={onResend} className="text-[#facc15] font-bold cursor-pointer hover:underline">Resend it</span>
          </p>
          <p className="text-[13px] font-medium text-neutral-600">
            Code expires in 00:32
          </p>
        </div>

        <button 
          onClick={handleVerifyClick}
          disabled={isLoading || otp.join('').length < 6}
          className="w-full h-12 bg-[#fcd34d] hover:bg-[#facc15] text-[#1e293b] font-bold text-[15px] rounded-lg transition-all shadow-sm mb-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
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
