import React from 'react';

const FeesAndTiers = () => {
  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[22px] font-bold text-[#1e293b]">Fees & Tiers</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center text-center h-[400px]">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🚧</span>
        </div>
        <h2 className="text-[18px] font-bold text-[#1e293b] mb-2">Coming Soon</h2>
        <p className="text-[14px] text-gray-500 max-w-sm">The Fees & Tiers configuration page is currently under construction. Please check back later.</p>
      </div>
    </div>
  );
};

export default FeesAndTiers;
