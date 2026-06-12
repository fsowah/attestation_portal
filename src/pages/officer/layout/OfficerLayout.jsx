import React from 'react';
import { Outlet } from 'react-router-dom';
import OfficerHeader from './OfficerHeader';
import OfficerSidebar from './OfficerSidebar';

const OfficerLayout = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-[#f8f9fa] overflow-hidden font-inter">
      <OfficerHeader />
      <div className="flex flex-1 overflow-hidden">
        <OfficerSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OfficerLayout;
