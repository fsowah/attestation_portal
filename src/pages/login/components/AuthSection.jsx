import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import VerificationSection from './VerificationSection';
import LoginSection from './LoginSection';
import ForgotPasswordSection from './ForgotPasswordSection';
import SetPasswordSection from './SetPasswordSection';

const imgHelpCircle = "http://localhost:3845/assets/8bff9de17499bf9f8b76cd0629aa6c554ff7d243.svg";

const AuthSection = () => {
  const [view, setView] = useState('welcome'); // 'welcome', 'signup', 'signin', 'otp', 'forgotpassword', 'setpassword'
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const goToSignUp = () => setView('signup');
  const goToWelcome = () => setView('welcome');
  const goToSignIn = () => setView('signin');
  const goToOtp = () => setView('otp');
  const goToForgotPassword = () => setView('forgotpassword');
  const goToSetPassword = () => setView('setpassword');
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="relative h-full w-full bg-white overflow-hidden">
      {/* Decorative Background Elements (persistent) */}
      <div className="absolute inset-0 opacity-[0.3] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[120%] h-[120%] flex flex-wrap gap-32 rotate-[10deg]">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="flex gap-32">
              <img src="http://localhost:3845/assets/1f48a3207868058edf3b90fe1d2997082b5ba5b4.svg" className="w-24 h-24 rotate-45" alt="" />
              <img src="http://localhost:3845/assets/bf0300fcd0ddb2e16da711386589650749306798.svg" className="w-20 h-20 -rotate-12 mt-16" alt="" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 h-full w-full flex flex-col">
        {/* Persistent Top Header Section */}
        <div className="px-12 lg:px-20 pt-12 lg:pt-16 flex justify-end items-center gap-10 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center">
              <img src={imgHelpCircle} alt="Help" className="w-3 h-3 opacity-60" />
            </div>
            <span className="text-neutral-800 font-semibold text-sm">Help</span>
          </div>
          <div className="cursor-pointer">
            <span className="text-brand-gold-800 font-bold text-sm">
              Track my application
            </span>
          </div>
        </div>

        {view === 'welcome' && (
          <div className="flex-grow w-full flex flex-col p-6 lg:px-16 lg:py-8 overflow-y-auto animate-in fade-in duration-500">
            {/* Main Content */}
            <div className="max-w-lg mx-auto w-full flex-grow flex flex-col justify-center">
              <div className="mb-6">
                <h1 className="text-neutral-800 text-[32px] font-bold mb-1 tracking-tight">Welcome</h1>
                <p className="text-neutral-500 text-sm font-medium leading-relaxed">
                  Sign in or create an account to begin your attestation request.
                </p>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <button 
                  onClick={goToSignUp}
                  className="w-full h-11 bg-brand-gold-500 hover:bg-brand-gold-700 text-brand-navy-700 font-bold text-sm rounded-lg transition-all shadow-sm"
                >
                  Create an account
                </button>
                <button 
                  onClick={goToSignIn}
                  className="w-full h-11 bg-white border border-brand-navy-800 hover:bg-neutral-50 text-brand-navy-800 font-bold text-sm rounded-lg transition-all"
                >
                  Sign in to existing account
                </button>
              </div>

              <div className="w-full h-px bg-neutral-100 mb-5" />

              <div className="space-y-6">
                <div>
                  <h3 className="text-neutral-500 font-bold text-sm mb-1 tracking-tight">
                    Already submitted an application?
                  </h3>
                  <p className="text-neutral-400 text-[13px] leading-relaxed font-medium">
                    Sign in to track your documents and manage your scheduled appointment.
                  </p>
                </div>
                <div>
                  <h3 className="text-neutral-500 font-bold text-sm mb-1 tracking-tight">
                    New to the portal?
                  </h3>
                  <p className="text-neutral-400 text-[13px] leading-relaxed font-medium">
                    Create an account. You will need your Ghana Card number and mobile number to register.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center text-neutral-400 text-[10px] mt-6 gap-4 shrink-0">
              <p className="font-bold">attestation.mfa.gov.gh</p>
              <p className="font-bold uppercase tracking-wider">© 2026 Ministry of Foreign Affairs, Ghana</p>
            </div>
          </div>
        )}

        {view === 'signup' && (
          <div className="flex-grow w-full flex flex-col p-6 lg:px-16 lg:py-8 overflow-y-auto animate-slide-in-right">
            {/* Back Button for SignUp */}
            <div className="flex justify-start mb-4">
              <button 
                onClick={goToWelcome}
                className="flex items-center gap-2 text-neutral-400 hover:text-neutral-600 transition-colors group"
              >
                <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                <span className="text-[13px] font-semibold">Back to Welcome</span>
              </button>
            </div>

            <div className="max-w-lg mx-auto w-full flex-grow flex flex-col">
              <div className="mb-6">
                <h1 className="text-neutral-800 text-[32px] font-bold mb-1 tracking-tight">Sign up for an account</h1>
                <p className="text-neutral-500 text-sm font-medium">
                  Welcome back to the Attestation Portal.
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-neutral-500 font-bold text-[9px] uppercase tracking-wider">Full Name</label>
                  <input type="text" placeholder="Your name" className="w-full h-10 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:border-brand-navy-700 transition-colors placeholder:text-neutral-300 text-neutral-800 text-sm" />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <label className="text-neutral-500 font-bold text-[9px] uppercase tracking-wider">Phone Number</label>
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
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <label className="text-neutral-500 font-bold text-[9px] uppercase tracking-wider">Email Address</label>
                    <input type="email" placeholder="Email address" className="w-full h-10 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:border-brand-navy-700 transition-colors placeholder:text-neutral-300 text-neutral-800 text-sm" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-500 font-bold text-[9px] uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full h-10 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:border-brand-navy-700 transition-colors text-neutral-800 text-sm" 
                    />
                    <button 
                      type="button"
                      onClick={togglePassword}
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

                <button 
                  onClick={goToOtp}
                  className="w-full h-10 bg-brand-gold-500 hover:bg-brand-gold-700 text-brand-navy-700 font-bold text-sm rounded-lg transition-all shadow-sm mt-1"
                >
                  Continue
                </button>

                <div className="text-center mt-4">
                  <p className="text-neutral-400 text-xs font-medium">
                    Already have an account?{' '}
                    <span onClick={goToSignIn} className="text-brand-gold-800 font-bold cursor-pointer hover:underline">
                      Sign in
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer for SignUp */}
            <div className="flex flex-col sm:flex-row justify-between items-center text-neutral-400 text-[10px] mt-6 gap-4 shrink-0">
              <p className="font-bold">attestation.mfa.gov.gh</p>
              <p className="font-bold uppercase tracking-wider">© 2026 Ministry of Foreign Affairs, Ghana</p>
            </div>
          </div>
        )}

        {view === 'signin' && (
          <LoginSection 
            onBack={goToWelcome}
            onSignUp={goToSignUp}
            onForgotPassword={goToForgotPassword}
            onLogin={() => console.log('User Logged In')}
          />
        )}

        {view === 'otp' && (
          <VerificationSection 
            onBack={goToSignUp}
            onVerify={() => {
              console.log('OTP Verified');
              goToSetPassword();
            }}
          />
        )}

        {view === 'forgotpassword' && (
          <ForgotPasswordSection 
            onBack={goToSignIn}
            onSendCode={(phone) => {
              console.log('Sending reset code to:', phone);
              goToOtp();
            }}
          />
        )}

        {view === 'setpassword' && (
          <SetPasswordSection 
            onComplete={() => {
              console.log('Password set successfully');
              goToSignIn();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AuthSection;
