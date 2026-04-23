import React, { useState } from 'react';
import PersonalDetailsForm from './PersonalDetailsForm';
import UploadDocumentsForm from './UploadDocumentsForm';
import ServiceTierPaymentForm from './ServiceTierPaymentForm';
import AppointmentBookingForm from './AppointmentBookingForm';
import ApplicationSubmittedSuccess from './ApplicationSubmittedSuccess';

// Assets from Figma context
const imgBackArrowIcon = "http://localhost:3845/assets/2ac6a0ed6284e8cbd883191131d638d924b6b903.svg";
const imgPaymentIcon = "http://localhost:3845/assets/109d654bc063f8eb5868e1201e4b044e2bbc2e3e.svg";
const imgAttachmentIcon = "http://localhost:3845/assets/d827cc0b049e588e4f4f4e928faecd7ee87f7192.svg";
const imgCreditCardPos = "http://localhost:3845/assets/01930d4abd751f7cfc41738589046034d6f25dc0.svg";
const imgAppointmentIcon = "http://localhost:3845/assets/badedf20cf60d68e77900634410efdea645872f5.svg";
const imgEditPencil = "http://localhost:3845/assets/fd6a9e97da6f3fec7da6b558abebb1eba7c38bfb.svg";
const imgGreenTick = "http://localhost:3845/assets/7e6c7f33b5cbe6c387a50fcc6f255e8b6146592b.svg";

const NewApplicationSteps = ({ onBack }) => {
  const [expandedStep, setExpandedStep] = useState(null); // null, 1, 2, 3, 4
  const [completedSteps, setCompletedSteps] = useState([]); // [1, 2, ...]
  const [step1Progress, setStep1Progress] = useState(0);
  const [step2Progress, setStep2Progress] = useState(0);
  const [step3Progress, setStep3Progress] = useState(0);
  const [step4Progress, setStep4Progress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStartStep1 = () => {
    setExpandedStep(1);
    setStep1Progress(80); // As per Figma design
  };

  const handleSaveStep1 = () => {
    setCompletedSteps([...completedSteps, 1]);
    setExpandedStep(2); // Automatically move to Step 2
    setStep1Progress(100);
    setStep2Progress(0);
  };

  const handleSaveStep2 = () => {
    if (!completedSteps.includes(2)) {
      setCompletedSteps([...completedSteps, 2]);
    }
    setExpandedStep(3); // Automatically move to Step 3
    setStep2Progress(100);
    setStep3Progress(0);
  };

  const handleSaveStep3 = () => {
    if (!completedSteps.includes(3)) {
      setCompletedSteps([...completedSteps, 3]);
    }
    setExpandedStep(4); // Automatically move to Step 4
    setStep3Progress(100);
    setStep4Progress(0);
  };

  const handleSaveStep4 = () => {
    if (!completedSteps.includes(4)) {
      setCompletedSteps([...completedSteps, 4]);
    }
    setExpandedStep(null);
    setStep4Progress(100);
  };

  const handleFinalSubmit = () => {
    setIsSubmitted(true);
  };

  const steps = [
    {
      id: 1,
      title: 'Complete profile',
      description: 'Step 1: ',
      icon: imgPaymentIcon,
      isCompleted: completedSteps.includes(1),
      isActive: expandedStep === 1 || (!completedSteps.includes(1) && expandedStep === null),
      buttonText: 'Start application',
      hasProgress: true,
      progress: step1Progress
    },
    {
      id: 2,
      title: 'Upload documents',
      description: 'Step 2: ',
      icon: imgAttachmentIcon,
      isCompleted: completedSteps.includes(2),
      isActive: expandedStep === 2 || (completedSteps.includes(1) && !completedSteps.includes(2) && expandedStep === null),
      buttonText: 'Start uploading',
      hasProgress: true,
      progress: step2Progress,
      info: 'Complete the section above to continue with this step'
    },
    {
      id: 3,
      title: 'Select service tier & pay',
      description: 'Step 3: ',
      icon: imgCreditCardPos,
      isCompleted: completedSteps.includes(3),
      isActive: expandedStep === 3 || (completedSteps.includes(2) && !completedSteps.includes(3) && expandedStep === null),
      buttonText: 'Proceed to payment',
      hasProgress: true,
      progress: step3Progress,
      info: 'Complete the section above to continue with this step'
    },
    {
      id: 4,
      title: 'Book appointment slot',
      description: 'Step 4: ',
      icon: imgAppointmentIcon,
      isCompleted: completedSteps.includes(4),
      isActive: expandedStep === 4 || (completedSteps.includes(3) && !completedSteps.includes(4) && expandedStep === null),
      buttonText: 'Book appointment',
      hasProgress: true,
      progress: step4Progress,
      info: 'Complete the section above to continue with this step'
    }
  ];

  if (isSubmitted) {
    return <ApplicationSubmittedSuccess onGoHome={onBack} />;
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 transition-colors group"
        >
          <img src={imgBackArrowIcon} className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" alt="Back" />
          <span className="text-sm font-medium">Go back to Applications</span>
        </button>

        <button className="bg-neutral-50 hover:bg-neutral-100 text-brand-navy-800 px-5 py-2.5 rounded-lg text-sm font-bold transition-all border border-neutral-100">
          Need help? Schedule call
        </button>
      </div>

      {/* Steps Container */}
      <div className="relative flex flex-col gap-8 ml-4 lg:ml-8 pb-12">
        {/* Step Indicator Connecting Line */}
        <div className="absolute left-[25px] top-6 bottom-6 w-[1.5px] bg-brand-gold-700 z-0" />

        {steps.map((step) => (
          <div key={step.id} className="relative flex items-start gap-8 z-10">
            {/* Step Badge */}
            <div className={`shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step.isCompleted
              ? 'bg-emerald-800 border-emerald-800'
              : step.isActive
                ? 'bg-brand-gold-500 border-brand-gold-500'
                : 'bg-white border-neutral-200'
              }`}>
              {step.isCompleted ? (
                <img src={imgGreenTick} className="w-6 h-6 invert brightness-0" alt="Done" />
              ) : (
                <span className={`text-[20px] font-bold ${step.isActive ? 'text-white' : 'text-neutral-300'
                  }`}>
                  {step.id}
                </span>
              )}
            </div>

            {/* Step Card */}
            <div className={`flex-grow rounded-2xl border transition-all duration-300 overflow-hidden ${expandedStep === step.id
              ? 'p-8 bg-white ring-2 ring-brand-gold-500/20 border-brand-gold-500/30 shadow-xl'
              : step.isCompleted
                ? 'p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-emerald-50/50 border-emerald-100 shadow-none'
                : 'p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white border-neutral-50 shadow-[0px_4px_12px_rgba(0,0,0,0.03)]'
              } ${step.isActive || step.isCompleted ? 'opacity-100' : 'opacity-80'
              }`}>
              {expandedStep === step.id ? (
                <div className="w-full">
                  {step.id === 1 && <PersonalDetailsForm onSave={handleSaveStep1} />}
                  {step.id === 2 && <UploadDocumentsForm onSave={handleSaveStep2} />}
                  {step.id === 3 && <ServiceTierPaymentForm onSave={handleSaveStep3} />}
                  {step.id === 4 && <AppointmentBookingForm onSave={handleSaveStep4} />}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-5">
                    <div className={`w-[55px] h-[55px] rounded-xl flex items-center justify-center border transition-colors ${step.isActive || step.isCompleted ? 'bg-brand-gold-500/10 border-brand-gold-500/30' : 'bg-white border-neutral-200'
                      }`}>
                      <img src={step.icon} className={`w-8 h-8 ${step.isActive || step.isCompleted ? '' : 'opacity-30 grayscale'}`} alt="" />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-sm lg:text-[15px]">
                        <span className="text-neutral-500 font-normal">{step.description}</span>
                        <span className={`font-bold tracking-tight ${step.isCompleted ? 'text-emerald-800' : 'text-neutral-800'}`}>{step.title}</span>
                      </div>

                      {!step.isCompleted && step.id >= 2 && !completedSteps.includes(step.id - 1) ? (
                        <p className="text-[11px] text-neutral-400 font-medium mt-0.5">{step.info}</p>
                      ) : (
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className={`w-32 lg:w-48 h-1.5 rounded-full overflow-hidden ${step.isCompleted ? 'bg-emerald-100' : 'bg-neutral-100'}`}>
                            <div
                              className={`h-full transition-all duration-1000 ease-out ${step.isCompleted ? 'bg-emerald-800' : 'bg-brand-gold-500'}`}
                              style={{ width: `${step.progress}%` }}
                            />
                          </div>
                          <span className={`text-[12px] font-bold ${step.isCompleted ? 'text-emerald-600' : 'text-neutral-400'}`}>{step.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {step.isActive && !step.isCompleted && step.buttonText && (
                    <button
                      onClick={() => setExpandedStep(step.id)}
                      className="bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-800 px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                      {step.buttonText}
                    </button>
                  )}
                  {step.isCompleted && (
                    <button
                      onClick={() => setExpandedStep(step.id)}
                      className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 text-sm font-bold transition-colors"
                    >
                      <img src={imgEditPencil} className="w-4 h-4" alt="" />
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* All Steps Complete Banner */}
      {completedSteps.length === 4 && expandedStep === null && (
        <div className="mt-6 mb-20 ml-[110px] animate-fade-in-up">
          <div className="relative overflow-hidden bg-[#F7FCF9] rounded-[16px] border border-emerald-100/60 p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] flex items-center justify-between">
            {/* Watermark Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex flex-wrap gap-12 items-center justify-center -rotate-12 scale-110">
              {[...Array(8)].map((_, i) => (
                <img key={i} src="http://localhost:3845/assets/f2061c498da3143761f19b9e370d1c33b8a29e86.svg" className="w-16 h-16" alt="" />
              ))}
            </div>

            <div className="flex items-center gap-6 relative z-10">
              <div className="size-[56px] bg-emerald-800 rounded-full flex items-center justify-center shadow-lg shadow-emerald-800/10">
                <img src={imgGreenTick} className="w-6 h-6 invert brightness-0" alt="Complete" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-[20px] font-bold text-[#0A1628] tracking-tight">All steps complete</h3>
                <p className="text-[14px] text-neutral-400 font-medium">You can still edit any section above before submitting.</p>
              </div>
            </div>

            <button 
              onClick={handleFinalSubmit}
              className="relative z-10 bg-[#FCD116] hover:bg-[#ebc215] text-[#0A1628] px-10 h-[52px] rounded-xl text-[15px] font-bold shadow-md shadow-[#FCD116]/10 transition-all active:scale-[0.98] min-w-[240px]"
            >
              Submit application
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewApplicationSteps;
