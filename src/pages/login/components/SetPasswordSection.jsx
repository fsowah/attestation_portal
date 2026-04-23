import React, { useState } from 'react';

const imgAlertCircle = "http://localhost:3845/assets/c46b324b6a0955363ecb396e7ab05b213c09826d.svg";
const imgCheckmarkSquareChecked = "http://localhost:3845/assets/71460a552443d17c49a1f980adbd24c2c629a24d.svg";
const imgCheckmarkSquareUnchecked = "http://localhost:3845/assets/3495c72c6679e296fb6c3aa96a260c8d9c885300.svg";

const SetPasswordSection = ({ onComplete }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const requirements = [
    { label: 'Be at least 8 characters long', met: password.length >= 8 },
    { label: 'At least one uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'At least one special character (!@#$%^&*)', met: /[!@#$%^&*]/.test(password) },
  ];

  const metCount = requirements.filter(req => req.met).length;
  let strength = 'Weak';
  let strengthColor = 'bg-red-500';
  let strengthTextColor = 'text-red-500';

  if (metCount === 2) {
    strength = 'Medium';
    strengthColor = 'bg-yellow-500';
    strengthTextColor = 'text-yellow-500';
  } else if (metCount === 3) {
    strength = 'Strong';
    strengthColor = 'bg-green-500';
    strengthTextColor = 'text-green-500';
  }

  const passwordsMatch = password === confirmPassword;
  const showMismatchError = confirmPassword.length > 0 && !passwordsMatch;
  const isFormValid = metCount === 3 && passwordsMatch && password !== '';

  return (
    <div className="flex-grow w-full flex flex-col p-6 lg:px-16 lg:py-8 overflow-y-auto animate-slide-in-right">
      <div className="max-w-lg mx-auto w-full flex-grow flex flex-col justify-center">
        <div className="mb-6">
          <h1 className="text-neutral-800 text-[32px] font-bold mb-1 tracking-tight">Set a new password</h1>
          <p className="text-neutral-500 text-sm font-normal leading-relaxed">
            Your new password must be at least 8 characters and include a number.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {/* New Password Field */}
          <div className="space-y-1.5">
            <label className="text-neutral-500 font-bold text-[9px] uppercase tracking-wider">NEW PASSWORD</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-10 px-4 border rounded-lg focus:outline-none transition-colors text-neutral-800 text-sm ${
                  showMismatchError 
                    ? 'border-red-500 bg-red-50/10' 
                    : 'border-neutral-200 focus:border-brand-navy-700'
                }`} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Strength Indicator (Verification Status) */}
          {password.length > 0 && (
            <div className="bg-[#f9f8f7] rounded-lg p-4 space-y-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <img src={imgAlertCircle} alt="" className="w-4 h-4" />
                <span className={`text-sm font-medium ${strengthTextColor}`}>{strength}</span>
              </div>
              
              <div className="flex gap-1 h-1">
                <div className={`flex-1 rounded-full ${metCount >= 1 ? strengthColor : 'bg-neutral-200'}`} />
                <div className={`flex-1 rounded-full ${metCount >= 2 ? strengthColor : 'bg-neutral-200'}`} />
                <div className={`flex-1 rounded-full ${metCount >= 3 ? strengthColor : 'bg-neutral-200'}`} />
              </div>

              <div className="space-y-2">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <img 
                      src={req.met ? imgCheckmarkSquareChecked : imgCheckmarkSquareUnchecked} 
                      alt="" 
                      className="w-4 h-4 transition-all"
                    />
                    <span className={`text-[13px] transition-colors ${req.met ? 'text-neutral-800' : 'text-neutral-400'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="text-neutral-500 font-bold text-[9px] uppercase tracking-wider">CONFIRM PASSWORD</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full h-10 px-4 border rounded-lg focus:outline-none transition-colors text-neutral-800 text-sm ${
                  showMismatchError 
                    ? 'border-red-500 bg-red-50/10' 
                    : 'border-neutral-200 focus:border-brand-navy-700'
                }`} 
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
            {showMismatchError && (
              <div className="flex items-center gap-2 mt-2 animate-fade-in">
                <img src={imgAlertCircle} alt="" className="w-4 h-4" />
                <p className="text-red-500 text-[13px] font-medium">Passwords do not match. Please check and try again.</p>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={onComplete}
          disabled={!isFormValid}
          className={`w-full h-10 font-bold text-sm rounded-lg transition-all shadow-sm mb-6 ${
            isFormValid 
              ? 'bg-brand-gold-500 hover:bg-brand-gold-700 text-brand-navy-700' 
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
          }`}
        >
          Set new password
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

export default SetPasswordSection;
