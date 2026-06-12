import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useNavigate } from 'react-router-dom';
import VerificationSection from './VerificationSection';
import LoginSection from './LoginSection';
import ForgotPasswordSection from './ForgotPasswordSection';
import SetPasswordSection from './SetPasswordSection';
import { HelpCircle, AlertCircle, Loader2 } from 'lucide-react';
import LogoCrest from '../../../assets/images/Logo_crest.png';
import vector0 from '../../../assets/images/Vector.svg';
import vector1 from '../../../assets/images/vector1.svg';
import { supabase } from '../../../supabaseClient';

const AuthSection = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('welcome'); // 'welcome', 'signup', 'signin', 'otp', 'forgotpassword', 'setpassword'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resetPhone, setResetPhone] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const goToSignUp = () => { setView('signup'); setIsMenuOpen(false); setError(null); setIsResettingPassword(false); };
  const goToWelcome = () => { setView('welcome'); setIsMenuOpen(false); setError(null); setIsResettingPassword(false); };
  const goToSignIn = () => { setView('signin'); setIsMenuOpen(false); setError(null); setIsResettingPassword(false); };
  const goToOtp = () => { setView('otp'); setIsMenuOpen(false); setError(null); };
  const goToForgotPassword = () => { setView('forgotpassword'); setIsMenuOpen(false); setError(null); };
  const goToSetPassword = () => { setView('setpassword'); setIsMenuOpen(false); setError(null); };
  
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phoneNumber,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Link the phone number to the auth identity so they can login with it
        const { error: phoneError } = await supabase.auth.updateUser({
          phone: phoneNumber
        });
        if (phoneError) {
          console.error("Could not link phone number to auth identity:", phoneError);
        }

        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          phone_number: phoneNumber,
          role: 'user',
        }, { onConflict: 'id' });

        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleSendResetCode = async (phone) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: false,
        }
      });
      if (otpError) {
        if (otpError.message.includes('Signups not allowed')) {
          throw new Error('No account found with this phone number.');
        }
        throw otpError;
      }
      setResetPhone(phone);
      setIsResettingPassword(true);
      goToOtp();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otpValue) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: isResettingPassword ? resetPhone : phoneNumber,
        token: otpValue,
        type: 'sms',
      });
      if (verifyError) throw verifyError;
      
      if (isResettingPassword) {
        goToSetPassword();
      } else {
        handleLoginSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (newPassword) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;
      setIsResettingPassword(false);
      handleLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-full w-full bg-white overflow-hidden">
      {/* Decorative Background Elements (persistent) */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[120%] h-[120%] flex flex-wrap gap-32 rotate-[10deg]">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="flex gap-32">
              <img src={vector0} className="w-24 h-24 rotate-45 opacity-50" alt="" />
              <img src={vector1} className="w-20 h-20 -rotate-12 mt-16 opacity-50" alt="" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 h-full w-full flex flex-col">
        {/* Unified Mobile Header (Expandable) */}
        <div
          className={`lg:hidden relative shrink-0 transition-all duration-500 ease-in-out overflow-hidden z-50 ${isMenuOpen ? 'pb-12 rounded-b-[32px]' : 'pb-4 rounded-b-[24px]'
            }`}
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1f36] to-[#0c4fa5]" />

          {/* Header Content */}
          <div className="relative z-10">
            <div className="px-6 pt-10 flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={LogoCrest}
                  alt="Logo"
                  className="h-8 w-auto object-contain"
                />
                <span className="text-white font-medium text-[15px]">Ministry of Foreign Affairs</span>
              </div>
              <button onClick={toggleMenu} className="p-2 text-white">
                {isMenuOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>

            {/* Expandable Menu Items */}
            <div
              className={`px-8 space-y-6 transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
                }`}
            >
              <div
                onClick={() => { console.log('Help clicked'); setIsMenuOpen(false); }}
                className="flex items-center gap-4 text-white/90 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <HelpCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-base">Help Center</span>
              </div>
              <div
                onClick={() => { console.log('Track clicked'); setIsMenuOpen(false); }}
                className="flex items-center gap-4 text-white/90 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold-500">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="font-bold text-base text-brand-gold-500">Track my application</span>
              </div>

            </div>
          </div>
        </div>

        {/* Persistent Desktop Top Header Section */}
        <div className="hidden lg:flex px-12 lg:px-20 pt-12 lg:pt-16 justify-end items-center gap-10 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center">
              <HelpCircle className="w-3 h-3 text-neutral-800 opacity-60" />
            </div>
            <span className="text-neutral-800 font-semibold text-sm">Help</span>
          </div>
          <div className="cursor-pointer">
            <span className="text-brand-gold-800 font-bold text-sm">Track my application</span>
          </div>
        </div>
        {view === 'welcome' && (
          <div className="flex-grow w-full flex flex-col p-6 lg:px-20 overflow-y-auto">
            {/* Main Content */}
            <div className="max-w-lg mx-auto w-full flex-grow flex flex-col justify-center lg:justify-start lg:pt-12">
              <div className="mb-10 lg:mb-12 xl:mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h1 className="flex text-neutral-800 text-[28px] sm:text-[32px] lg:text-[38px] xl:text-[44px] font-black mb-2 tracking-tight">Welcome</h1>
                <p className="text-neutral-500 text-[15px] lg:text-base xl:text-lg font-normal leading-relaxed max-w-sm xl:max-w-md">
                  Sign in or create an account to begin your attestation request.
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-10 xl:mb-14 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <button
                  onClick={goToSignUp}
                  className="w-full h-11 lg:h-12 xl:h-14 bg-brand-gold-500 hover:bg-brand-gold-700 text-brand-navy-700 font-bold text-sm lg:text-base xl:text-lg rounded-lg transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99]"
                >
                  Create an account
                </button>
                <button
                  onClick={goToSignIn}
                  className="w-full h-11 lg:h-12 xl:h-14 bg-white  border border-brand-navy-800 hover:bg-neutral-50 text-brand-navy-800 font-bold text-sm lg:text-base xl:text-lg rounded-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Sign in to existing account
                </button>
              </div>

              <div className="w-full h-px bg-neutral-100 mb-8 animate-slow-fade-in" style={{ animationDelay: '0.3s' }} />

              <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="space-y-2">
                  <h3 className="text-neutral-500 font-bold text-[13px] lg:text-sm uppercase tracking-wider">
                    Already submitted an application?
                  </h3>
                  <p className="text-neutral-400 text-[13px] lg:text-sm leading-relaxed font-normal">
                    Sign in to track your documents and manage your scheduled appointment.
                  </p>
                </div>
                <div className="hidden lg:block space-y-2">
                  <h3 className="text-neutral-500 font-bold text-[13px] lg:text-sm uppercase tracking-wider">
                    New to the portal?
                  </h3>
                  <p className="text-neutral-400 text-[13px] lg:text-sm leading-relaxed font-normal">
                    Create an account. You will need your Ghana Card number and mobile number to register.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center text-neutral-400 text-[10px] mt-10 gap-1 lg:mt-6 lg:flex-row lg:justify-between lg:text-[11px] shrink-0 animate-slow-fade-in" style={{ animationDelay: '0.6s' }}>
              <p className="font-medium lg:font-bold">attestation.mfa.gov.gh</p>
              <p className="font-medium lg:font-bold uppercase tracking-wider">© 2026 Ministry of Foreign Affairs, Ghana</p>
            </div>
          </div>
        )}

        {view === 'signup' && (
          <div className="flex-grow w-full flex flex-col p-6 lg:px-20 lg:py-8 overflow-y-auto animate-slide-in-right">
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

            <form onSubmit={handleSignUp} className="max-w-lg mx-auto w-full flex-grow flex flex-col justify-center lg:justify-start lg:pt-8">
              <div className="mb-8">
                <h1 className="text-neutral-800 text-[28px] lg:text-[32px] font-bold mb-1 tracking-tight">Sign up for an account</h1>
                <p className="text-neutral-500 text-[15px] lg:text-base font-medium">
                  Join the Ministry of Foreign Affairs Attestation Portal.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-bold leading-tight">{error}</p>
                </div>
              )}

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-neutral-500 font-bold text-[9px] uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ama Dziedzom Barnor" 
                    className="w-full h-10 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:border-brand-navy-700 transition-colors placeholder:text-neutral-300 text-neutral-800 text-sm" 
                  />
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
                        required
                        className="w-full h-10 px-4 border border-neutral-200 rounded-lg focus-within:border-brand-navy-700 transition-colors text-neutral-800 text-sm flex items-center gap-3 bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <label className="text-neutral-500 font-bold text-[9px] uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ama@example.com" 
                      className="w-full h-10 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:border-brand-navy-700 transition-colors placeholder:text-neutral-300 text-neutral-800 text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-500 font-bold text-[9px] uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 bg-brand-gold-500 hover:bg-brand-gold-700 text-brand-navy-700 font-bold text-sm rounded-lg transition-all shadow-sm mt-1 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    'Continue'
                  )}
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
            </form>

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
            onSuccess={handleLoginSuccess}
          />
        )}

        {view === 'otp' && (
          <VerificationSection
            onBack={isResettingPassword ? goToForgotPassword : goToSignUp}
            onVerify={handleVerifyOTP}
            isLoading={isLoading}
            error={error}
            onResend={() => {
              if (isResettingPassword && resetPhone) {
                handleSendResetCode(resetPhone);
              }
            }}
          />
        )}

        {view === 'forgotpassword' && (
          <ForgotPasswordSection
            onBack={goToSignIn}
            onSendCode={handleSendResetCode}
            isLoading={isLoading}
            error={error}
          />
        )}

        {view === 'setpassword' && (
          <SetPasswordSection
            onComplete={handleSetNewPassword}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default AuthSection;
