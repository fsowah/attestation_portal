import React from 'react';
import InfoSection from './components/InfoSection';
import AuthSection from './components/AuthSection';

const Login = () => {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-white font-inter overflow-hidden">
      {/* Left Side: Info Section (Floating Card) - Hidden on Mobile */}
      <div className="hidden lg:block w-full lg:w-[45%] xl:w-[42%] h-full p-4 lg:p-5 shrink-0">
        <InfoSection />
      </div>

      {/* Right Side: Auth Section */}
      <div className="flex-grow h-auto lg:h-full">
        <AuthSection />
      </div>
    </div>
  );
};

export default Login;
