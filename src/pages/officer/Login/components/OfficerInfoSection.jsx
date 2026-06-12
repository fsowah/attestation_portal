import React from 'react';
import LogoCrest from '../../../../assets/images/Logo_crest.png';

const OfficerInfoSection = () => {
  const stats = [
    { label: 'Total Today', value: '47', iconBg: 'bg-transparent' },
    { label: 'Pending Review', value: '12', iconBg: 'bg-yellow-100' },
    { label: 'Approved', value: '29', iconBg: 'bg-green-100' },
    { label: 'Rejected', value: '6', iconBg: 'bg-red-100' }
  ];

  return (
    <div className="relative h-full w-full flex flex-col pt-12 px-12 lg:px-20 pb-12 animate-in fade-in slide-in-from-left duration-1000">

      {/* Watermarks (subtle background patterns) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <img src={LogoCrest} className="absolute top-[20%] left-[10%] w-64 h-64 -rotate-[15deg]" alt="" />
        <img src={LogoCrest} className="absolute bottom-[10%] right-[20%] w-96 h-96 rotate-[25deg]" alt="" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Logo and Title */}
        <div className="flex items-start gap-4 mb-16">
          <img src={LogoCrest} alt="MoFA Logo" className="h-14 w-auto object-contain" />
          <div className="flex flex-col pt-1">
            <h2 className="text-white font-bold text-lg tracking-tight leading-tight">Ministry of Foreign Affairs</h2>
            <p className="text-brand-gold-500 font-medium text-xs tracking-wide">
              Republic of Ghana &nbsp;<span className="text-brand-gold-500/70">Document Attestation Portal</span>
            </p>
          </div>
        </div>

        {/* Tagline Section */}
        <div className="mb-10">
          <h1 className="text-white text-[42px] xl:text-[56px] font-bold leading-[1.1] mb-6 tracking-tight">
            Document Attestation<br />Management System
          </h1>
          <p className="text-[#a1b0c0] text-[15px] xl:text-[17px] max-w-lg font-medium leading-relaxed">
            For authorised MOFA staff only. Access is governed by your<br />government Active Directory credentials.
          </p>
        </div>

        {/* Stats White Container */}
        <div className="bg-white rounded-r-[32px] rounded-l-none w-[calc(100%+3rem)] lg:w-[calc(100%+5rem)] -ml-12 lg:-ml-20 max-w-[750px] overflow-hidden shadow-lg relative flex flex-col mb-24 -mt-4">

          {/* Top padding area above the color bar */}
          <div className="h-10 w-full bg-white shrink-0"></div>

          {/* Color bar divider */}
          <div className="w-full h-1 flex shrink-0">
            <div className="flex-1 bg-[#CE1126]"></div>
            <div className="flex-1 bg-[#FCD116]"></div>
            <div className="flex-1 bg-[#006B3F]"></div>
          </div>

          <div className="pt-10 pb-28 pl-12 lg:pl-20 pr-12">
            <div className="grid grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-5 flex items-start gap-3 shadow-sm border border-[#f4f4f5]">
                  {stat.iconBg !== 'bg-transparent' && (
                    <div className={`w-5 h-5 rounded-sm mt-1 shrink-0 ${stat.iconBg}`}></div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[28px] font-bold text-[#2a2a2a] leading-none mb-2">{stat.value}</span>
                    <span className="text-[11px] font-semibold text-[#a1a1aa] whitespace-nowrap">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <p className="text-[#49658a] text-[12px] max-w-md font-medium leading-relaxed">
            Restricted system. Unauthorised access is a criminal<br />offence under the Electronic Transactions Act 2008.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficerInfoSection;
