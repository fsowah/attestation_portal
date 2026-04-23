import React, { useState } from 'react';

const LoginSection = ({ onBack, onSignUp, onLogin, onForgotPassword }) => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex-grow w-full flex flex-col p-6 lg:px-16 lg:py-8 overflow-y-auto animate-slide-in-right">
      {/* Back Button */}
      <div className="flex justify-start mb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-neutral-600 transition-colors group"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-[13px] font-semibold">Back to Welcome</span>
        </button>
      </div>

      <div className="max-w-lg mx-auto w-full flex-grow flex flex-col">
        <div className="mb-6">
          <h1 className="text-neutral-800 text-[32px] font-bold mb-1 tracking-tight">Log in</h1>
          <p className="text-neutral-500 text-base font-normal leading-relaxed">
            Welcome back to the Attestation Portal.
          </p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex gap-3 mb-6">
          <button 
            onClick={() => setLoginMethod('email')}
            className={`px-4 h-10 rounded-lg text-[13px] font-semibold transition-all ${
              loginMethod === 'email' 
                ? 'bg-brand-navy-800 text-white' 
                : 'bg-[#f9f8f7] text-brand-navy-800 hover:bg-neutral-100'
            }`}
          >
            Login with email
          </button>
          <button 
            onClick={() => setLoginMethod('phone')}
            className={`px-4 h-10 rounded-lg text-[13px] font-semibold transition-all ${
              loginMethod === 'phone' 
                ? 'bg-brand-navy-800 text-white' 
                : 'bg-[#f9f8f7] text-brand-navy-800 hover:bg-neutral-100'
            }`}
          >
            Login with phone
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          <div className="space-y-1.5">
            <label className="text-neutral-500 font-bold text-[9px] uppercase tracking-wider">
              {loginMethod === 'email' ? 'EMAIL ADDRESS' : 'PHONE NUMBER'}
            </label>
            <input 
              type={loginMethod === 'email' ? 'email' : 'tel'} 
              placeholder={loginMethod === 'email' ? 'Email Address' : 'Phone Number'} 
              className="w-full h-10 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:border-brand-navy-700 transition-colors placeholder:text-neutral-300 text-neutral-800 text-sm" 
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-neutral-500 font-bold text-[9px] uppercase tracking-wider">PASSWORD</label>
              <button 
                onClick={onForgotPassword}
                className="text-brand-gold-700 text-[11px] font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full h-10 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:border-brand-navy-700 transition-colors text-neutral-800 text-sm" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-2.278-2.278L15.07m-4.408-4.408a3 3 0 014.242 4.242" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={onLogin}
          className="w-full h-10 bg-brand-gold-500 hover:bg-brand-gold-700 text-brand-navy-700 font-bold text-sm rounded-lg transition-all shadow-sm mb-4"
        >
          Log in
        </button>

        <div className="w-full h-px bg-neutral-100 mb-6" />

        <button 
          onClick={onSignUp}
          className="w-full h-10 bg-white border border-brand-navy-800 hover:bg-neutral-50 text-brand-navy-800 font-bold text-sm rounded-lg transition-all mb-6"
        >
          Create a new account
        </button>

        <div className="text-center">
          <p className="text-neutral-400 text-xs font-medium">
            Having trouble? Contact mfa support at <span className="text-neutral-800 font-bold cursor-pointer hover:underline">support@mfa.gov.gh</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-neutral-400 text-[10px] mt-6 gap-4 shrink-0">
        <p className="font-bold">attestation.mfa.gov.gh</p>
        <p className="font-bold uppercase tracking-wider">© 2026 Ministry of Foreign Affairs, Ghana</p>
      </div>
    </div>
  );
};

export default LoginSection;
