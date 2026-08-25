import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import OfficerHeader from './OfficerHeader';
import OfficerSidebar from './OfficerSidebar';

const OfficerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8f9fa] overflow-hidden font-inter relative">
      <OfficerHeader toggleSidebar={() => setIsSidebarOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden relative">
        <OfficerSidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
        
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OfficerLayout;
