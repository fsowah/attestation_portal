import React, { useState } from 'react';
import PersonalDetailsForm from './PersonalDetailsForm';
import UploadDocumentsForm from './UploadDocumentsForm';
import ServiceTierPaymentForm from './ServiceTierPaymentForm';
import AppointmentBookingForm from './AppointmentBookingForm';
import ApplicationSubmittedSuccess from './ApplicationSubmittedSuccess';
import { ArrowLeft, CreditCard, Paperclip, Calendar, Pencil, CheckCircle, Loader2 } from 'lucide-react';
import MoFACrest from '../../../assets/images/Logo_crest.png';
import { supabase } from '../../../supabaseClient';
import { useAuth } from '../../../context/AuthContext';

const NewApplicationSteps = ({ onBack }) => {
  const { user } = useAuth();
  const [expandedStep, setExpandedStep] = useState(null); // null, 1, 2, 3, 4
  const [completedSteps, setCompletedSteps] = useState([]); // [1, 2, ...]
  const [step1Progress, setStep1Progress] = useState(0);
  const [step2Progress, setStep2Progress] = useState(0);
  const [step3Progress, setStep3Progress] = useState(0);
  const [step4Progress, setStep4Progress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [applicationData, setApplicationData] = useState({
    personalDetails: null,
    documents: [],
    documentType: 'Birth certificate',
    serviceTier: 'Standard',
    appointment: null
  });

  const handleStartStep1 = () => {
    setExpandedStep(1);
    // Removed the hardcoded 80% - it's now dynamic from the form
  };

  const handleSaveStep1 = (data) => {
    setApplicationData(prev => ({ ...prev, personalDetails: data }));
    if (!completedSteps.includes(1)) {
      setCompletedSteps([...completedSteps, 1]);
    }
    setExpandedStep(2); 
    setStep1Progress(100);
    setStep2Progress(0);
  };

  const handleSaveStep2 = (data) => {
    setApplicationData(prev => ({ 
      ...prev, 
      documents: data.uploadedDocs,
      documentType: data.selectedType 
    }));
    if (!completedSteps.includes(2)) {
      setCompletedSteps([...completedSteps, 2]);
    }
    setExpandedStep(3);
    setStep2Progress(100);
    setStep3Progress(0);
  };

  const handleSaveStep3 = (data) => {
    setApplicationData(prev => ({ ...prev, serviceTier: data.tier }));
    if (!completedSteps.includes(3)) {
      setCompletedSteps([...completedSteps, 3]);
    }
    setExpandedStep(4);
    setStep3Progress(100);
    setStep4Progress(0);
  };

  const handleSaveStep4 = (data) => {
    setApplicationData(prev => ({ ...prev, appointment: data }));
    if (!completedSteps.includes(4)) {
      setCompletedSteps([...completedSteps, 4]);
    }
    setExpandedStep(null);
    setStep4Progress(100);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const appNumber = `ATT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const uploadedDocUrls = [];
      for (const doc of applicationData.documents) {
        if (doc.file) {
          const fileExt = doc.file.name.split('.').pop();
          const fileName = `${appNumber}/${doc.id}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('attestations')
            .upload(filePath, doc.file, { upsert: true });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('attestations')
            .getPublicUrl(filePath);
          
          uploadedDocUrls.push({
            id: doc.id,
            type: doc.type,
            name: doc.name,
            url: publicUrl,
            size: doc.size
          });
        }
      }

      const { error } = await supabase
        .from('applications')
        .insert([{
          id: appNumber,
          user_id: user.id,
          document_type: applicationData.documentType,
          status: 'Submitted',
          personal_details: applicationData.personalDetails,
          service_tier: applicationData.serviceTier,
          appointment_details: applicationData.appointment,
          documents: uploadedDocUrls,
          submitted_at: new Date().toISOString()
        }]);

      if (error) throw error;
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Complete profile',
      description: 'Step 1: ',
      icon: CreditCard,
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
      icon: Paperclip,
      isCompleted: completedSteps.includes(2),
      isActive: expandedStep === 2 || (completedSteps.includes(1) && !completedSteps.includes(2) && expandedStep === null),
      buttonText: 'Start uploading',
      hasProgress: true,
      progress: step2Progress,
      info: 'Complete Step 1 to continue'
    },
    {
      id: 3,
      title: 'Select service tier & pay',
      description: 'Step 3: ',
      icon: CreditCard,
      isCompleted: completedSteps.includes(3),
      isActive: expandedStep === 3 || (completedSteps.includes(2) && !completedSteps.includes(3) && expandedStep === null),
      buttonText: 'Proceed to payment',
      hasProgress: true,
      progress: step3Progress,
      info: 'Complete Step 2 to continue'
    },
    {
      id: 4,
      title: 'Book appointment slot',
      description: 'Step 4: ',
      icon: Calendar,
      isCompleted: completedSteps.includes(4),
      isActive: expandedStep === 4 || (completedSteps.includes(3) && !completedSteps.includes(4) && expandedStep === null),
      buttonText: 'Book appointment',
      hasProgress: true,
      progress: step4Progress,
      info: 'Complete Step 3 to continue'
    }
  ];

  if (isSubmitted) {
    return <ApplicationSubmittedSuccess onGoHome={onBack} />;
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 transition-colors group">
          <ArrowLeft className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="text-sm font-medium">Go back to Applications</span>
        </button>
        <button className="bg-neutral-50 hover:bg-neutral-100 text-brand-navy-800 px-5 py-2.5 rounded-lg text-sm font-bold transition-all border border-neutral-100">
          Need help? Schedule call
        </button>
      </div>

      <div className="relative flex flex-col gap-8 ml-4 lg:ml-8 pb-12">
        <div className="absolute left-[25px] xl:left-[35px] top-6 bottom-6 w-[1.5px] bg-brand-gold-700 z-0" />

        {steps.map((step) => {
          const isLocked = step.id > 1 && !completedSteps.includes(step.id - 1);
          
          return (
            <div key={step.id} className="relative flex items-start gap-8 xl:gap-12 z-10">
              <div className={`shrink-0 w-[52px] h-[52px] xl:w-[70px] xl:h-[70px] rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step.isCompleted
                ? 'bg-emerald-800 border-emerald-800'
                : step.isActive && !isLocked
                  ? 'bg-brand-gold-500 border-brand-gold-500'
                  : 'bg-white border-neutral-200'
                }`}>
                {step.isCompleted ? (
                  <CheckCircle className="w-6 h-6 xl:w-8 xl:h-8 text-white" />
                ) : (
                  <span className={`text-[20px] xl:text-[28px] font-bold ${step.isActive && !isLocked ? 'text-white' : 'text-neutral-300'}`}>
                    {step.id}
                  </span>
                )}
              </div>

              <div className={`flex-grow rounded-2xl border transition-all duration-300 overflow-hidden ${expandedStep === step.id
                ? 'p-8 bg-white ring-2 ring-brand-gold-500/20 border-brand-gold-500/30 shadow-xl'
                : step.isCompleted
                  ? 'p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-emerald-50/50 border-emerald-100'
                  : 'p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white border-neutral-50 shadow-sm'
                } ${(!isLocked || step.isCompleted) ? 'opacity-100' : 'opacity-60 cursor-not-allowed'}`}>
                
                {expandedStep === step.id ? (
                  <div className="w-full">
                    {step.id === 1 && (
                      <PersonalDetailsForm 
                        initialData={applicationData.personalDetails} 
                        onSave={handleSaveStep1} 
                        onProgressUpdate={setStep1Progress} 
                      />
                    )}
                    {step.id === 2 && (
                      <UploadDocumentsForm 
                        initialData={{ 
                          uploadedDocs: applicationData.documents, 
                          selectedType: applicationData.documentType 
                        }} 
                        onSave={handleSaveStep2} 
                        onProgressUpdate={setStep2Progress} 
                      />
                    )}
                    {step.id === 3 && (
                      <ServiceTierPaymentForm 
                        initialData={{ tier: applicationData.serviceTier }} 
                        onSave={handleSaveStep3} 
                        onProgressUpdate={setStep3Progress} 
                      />
                    )}
                    {step.id === 4 && (
                      <AppointmentBookingForm 
                        initialData={applicationData.appointment} 
                        onSave={handleSaveStep4} 
                        onProgressUpdate={setStep4Progress} 
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-5">
                      <div className={`w-[55px] h-[55px] rounded-xl flex items-center justify-center border transition-colors ${(!isLocked || step.isCompleted) ? 'bg-brand-gold-500/10 border-brand-gold-500/30' : 'bg-white border-neutral-200'}`}>
                        <step.icon className={`w-7 h-7 ${(!isLocked || step.isCompleted) ? 'text-brand-gold-600' : 'text-neutral-300 opacity-30'}`} />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm lg:text-[15px] xl:text-[18px]">
                          <span className="text-neutral-500 font-normal">{step.description}</span>
                          <span className={`font-bold tracking-tight ${step.isCompleted ? 'text-emerald-800' : 'text-neutral-800'}`}>{step.title}</span>
                        </div>

                        {isLocked ? (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 rounded-full bg-neutral-200"></div>
                            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">{step.info}</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className={`w-32 lg:w-48 h-1.5 rounded-full overflow-hidden ${step.isCompleted ? 'bg-emerald-100' : 'bg-neutral-100'}`}>
                              <div className={`h-full transition-all duration-1000 ease-out ${step.isCompleted ? 'bg-emerald-800' : 'bg-brand-gold-500'}`} style={{ width: `${step.progress}%` }} />
                            </div>
                            <span className={`text-[12px] font-bold ${step.isCompleted ? 'text-emerald-600' : 'text-neutral-400'}`}>{step.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isLocked && step.isActive && !step.isCompleted && (
                      <button onClick={() => setExpandedStep(step.id)} className="bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-800 px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap">
                        {step.buttonText}
                      </button>
                    )}
                    {step.isCompleted && (
                      <button onClick={() => setExpandedStep(step.id)} className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 text-sm font-bold transition-colors">
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {completedSteps.length === 4 && expandedStep === null && (
        <div className="mt-6 mb-20 ml-[110px] animate-fade-in-up">
          <div className="relative overflow-hidden bg-[#F7FCF9] rounded-[16px] border border-emerald-100/60 p-6 shadow-sm flex items-center justify-between">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex flex-wrap gap-12 items-center justify-center -rotate-12 scale-110">
              {[...Array(8)].map((_, i) => <img key={i} src={MoFACrest} className="w-16 h-16" alt="" />)}
            </div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="size-[56px] bg-emerald-800 rounded-full flex items-center justify-center shadow-lg shadow-emerald-800/10">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-[20px] font-bold text-[#0A1628] tracking-tight">All steps complete</h3>
                <p className="text-[14px] text-neutral-400 font-medium">You can still edit any section above before submitting.</p>
              </div>
            </div>
            <button onClick={handleFinalSubmit} disabled={isSubmitting} className="relative z-10 bg-[#FCD116] hover:bg-[#ebc215] text-[#0A1628] px-10 h-[52px] rounded-xl text-[15px] font-bold shadow-md shadow-[#FCD116]/10 transition-all active:scale-[0.98] min-w-[240px] flex items-center justify-center gap-2">
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Submitting...</span></> : 'Submit application'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewApplicationSteps;
