import React from 'react';

import vector0 from '../../../assets/images/Vector.svg';
import vector1 from '../../../assets/images/vector1.svg';
import LogoCrest from '../../../assets/images/Logo_crest.png';

const InfoSection = () => {
  const steps = [
    { id: '01', title: 'Submit documents online' },
    { id: '02', title: 'Book your appointment slot' },
    { id: '03', title: 'Gather certified original documents' },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[32px] p-10 lg:p-12 flex flex-col justify-between animate-in fade-in slide-in-from-left duration-1000">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f36] via-[#081524] to-[#0e4388] opacity-100" />

      {/* Randomized Local Symbol Pattern */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none select-none mix-blend-soft-light overflow-hidden">
        {/* Manually placed "random" patterns for precision matching */}
        <img src={vector0} className="absolute top-[10%] left-[5%] w-32 h-32 rotate-[15deg]" alt="" />
        <img src={vector1} className="absolute top-[5%] right-[10%] w-40 h-40 -rotate-[25deg]" alt="" />
        <img src={vector0} className="absolute top-[40%] left-[25%] w-24 h-24 rotate-[45deg]" alt="" />
        <img src={vector1} className="absolute bottom-[20%] left-[10%] w-36 h-36 rotate-[10deg]" alt="" />
        <img src={vector0} className="absolute bottom-[10%] right-[15%] w-28 h-28 -rotate-[35deg]" alt="" />
        <img src={vector1} className="absolute top-[50%] right-[5%] w-32 h-32 rotate-[60deg]" alt="" />
        <img src={vector0} className="absolute top-[70%] left-[40%] w-20 h-20 -rotate-[15deg]" alt="" />
      </div>

      {/* Radial Glow */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(14,106,225,0.25),transparent_70%)]" />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Logo and Title */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-1.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-2xl">
            <img src={LogoCrest} alt="MoFA Logo" className="h-10 w-auto object-contain" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-white font-bold text-base tracking-tight leading-tight">Ministry of Foreign Affairs</h2>
            <p className="text-brand-gold-500 font-semibold text-[10px] tracking-wide uppercase opacity-90">Republic of Ghana • Document Attestation Portal</p>
          </div>
        </div>

        {/* Tagline Section */}
        <div className="mb-8 xl:mb-12">
          <h1 className="text-white text-[40px] xl:text-[54px] 2xl:text-[64px] font-black leading-[1.1] mb-4 tracking-tighter">
            Secure.<br />
            Transparent.<br />
            Efficient.
          </h1>
          <p className="text-neutral-100/70 text-[13px] xl:text-[15px] max-w-sm xl:max-w-md font-medium leading-relaxed">
            The official MFA Document Attestation Portal lets you submit, track, and collect attested documents from anywhere, at any time.
          </p>
        </div>

        {/* Steps List */}
        <div className="flex flex-col gap-0 mt-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-center gap-5 pb-6 last:pb-0">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[18px] top-[36px] w-[1.5px] h-[30px] bg-brand-gold-800" />
              )}

              {/* Step Number Circle */}
              <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-brand-gold-500 text-brand-navy-700 font-bold text-xs shrink-0 shadow-lg">
                {step.id}
              </div>

              {/* Step Title */}
              <p className="text-white/90 font-bold text-base xl:text-lg">
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative patterns could go here */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none transform translate-x-1/2 -translate-y-1/2">
        {/* Placeholder for the decorative pattern seen in Figma */}
      </div>
    </div>
  );
};

export default InfoSection;
