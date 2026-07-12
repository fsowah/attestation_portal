import React from 'react';
import AdminInfoSection from './components/AdminInfoSection';
import AdminAuthSection from './components/AdminAuthSection';

const AdminLogin = () => {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-gradient-to-br from-[#0a192f] to-[#0e3b75] font-inter overflow-hidden relative">
      {/* Left Side: Info Section */}
      <div className="hidden lg:flex flex-1 h-full relative z-10">
        <AdminInfoSection />
      </div>

      {/* Right Side: Auth Section */}
      <div className="w-full lg:w-[45%] xl:w-[42%] h-full p-4 lg:p-6 shrink-0 z-10">
        <AdminAuthSection />
      </div>
    </div>
  );
};

export default AdminLogin;
