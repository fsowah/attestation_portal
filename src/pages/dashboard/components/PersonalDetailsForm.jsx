import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Upload, FileText } from 'lucide-react';

const PersonalDetailsForm = ({ onSave, onProgressUpdate, initialData }) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    phoneNumber: initialData?.phoneNumber || '',
    dob: initialData?.dob || '',
    ghanaCardNumber: initialData?.ghanaCardNumber || '',
    ghanaCardPhoto: initialData?.ghanaCardPhoto || null,
    agreed: initialData?.agreed || false
  });
  const dateInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Calculate progress based on filled fields
  useEffect(() => {
    const fields = [
      formData.fullName,
      formData.phoneNumber,
      formData.dob,
      formData.ghanaCardNumber,
      formData.ghanaCardPhoto,
      formData.agreed
    ];
    const filledFields = fields.filter(field => {
      if (typeof field === 'boolean') return field === true;
      return field !== null && field !== '';
    }).length;
    
    const progress = Math.round((filledFields / fields.length) * 100);
    if (onProgressUpdate) {
      onProgressUpdate(progress);
    }
  }, [formData, onProgressUpdate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        ghanaCardPhoto: {
          file: file,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        }
      }));
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, ghanaCardPhoto: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Helper to get current progress for UI
  const calculateInternalProgress = () => {
    const fields = [formData.fullName, formData.phoneNumber, formData.dob, formData.ghanaCardNumber, formData.ghanaCardPhoto, formData.agreed];
    const filled = fields.filter(f => typeof f === 'boolean' ? f : (f !== null && f !== '')).length;
    return Math.round((filled / fields.length) * 100);
  };

  const currentProgress = calculateInternalProgress();

  return (
    <div className="w-full bg-white animate-fade-in px-1">
      {/* Step Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-[52px] h-[52px] bg-brand-gold-50/50 border border-brand-gold-200 rounded-lg flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-brand-gold-500" />
        </div>
        <div className="flex flex-col gap-1 pt-0.5">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 text-[13px] font-medium">Step 1:</span>
            <span className="text-brand-navy-800 text-[15px] font-bold">Complete profile</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-800 transition-all duration-500 ease-out" 
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <span className="text-neutral-400 text-[12px] font-bold">{currentProgress}%</span>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 xl:gap-x-20 2xl:gap-x-32 gap-y-5 xl:gap-y-8">
        {/* Left Column */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Ama Dziedzom Barnor" 
              className="w-full h-10 px-4 bg-neutral-50 rounded-lg border border-neutral-100 outline-none text-sm placeholder:text-neutral-300 focus:border-brand-gold-300 transition-colors"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-grow">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Phone Number</label>
              <div className="flex items-center gap-2 px-3 h-10 bg-neutral-50 rounded-lg border border-neutral-100 focus-within:border-brand-gold-300 transition-colors">
                <span className="text-base leading-none">🇬🇭</span>
                <span className="text-[13px] text-neutral-500">+233</span>
                <ChevronDown className="w-3 h-3 opacity-30" />
                <div className="w-px h-4 bg-neutral-200 mx-0.5" />
                <input 
                  type="text" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="548902177" 
                  className="bg-transparent outline-none text-sm placeholder:text-neutral-300 w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-[180px]">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Date of Birth</label>
              <div className="relative group h-10 cursor-pointer" onClick={triggerDatePicker}>
                <input
                  ref={dateInputRef}
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="w-full h-full px-4 bg-white rounded-lg border border-neutral-200 flex items-center text-sm text-neutral-800 transition-colors group-hover:border-brand-gold-400">
                  {formData.dob ? new Date(formData.dob).toLocaleDateString('en-GB') : <span className="text-neutral-300 tracking-wider">DD / MM / YYYY</span>}
                </div>
                <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center bg-neutral-50 border-l border-neutral-200 rounded-r-lg z-10">
                  <Calendar className="w-3.5 h-3.5 opacity-40" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Ghana Card Number</label>
            <input 
              type="text" 
              name="ghanaCardNumber"
              value={formData.ghanaCardNumber}
              onChange={handleInputChange}
              placeholder="GHA-XXXXXXXXXXXXX-X" 
              className="w-full h-10 px-4 bg-white rounded-lg border border-neutral-200 outline-none text-sm placeholder:text-neutral-300 focus:border-brand-gold-300 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Ghana Card Photo</label>
            <input 
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf"
            />
            {formData.ghanaCardPhoto ? (
              <div className="w-full h-[90px] border border-neutral-200 rounded-lg bg-white p-5 flex items-center justify-between group">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-neutral-700">{formData.ghanaCardPhoto.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-neutral-400">{formData.ghanaCardPhoto.size}</span>
                    <span className="text-[12px] text-emerald-600 font-bold">Ready</span>
                  </div>
                </div>
                <button 
                  onClick={removeFile}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 text-neutral-300 hover:text-red-500 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ) : (
              <div 
                onClick={triggerFileSelect}
                className="w-full h-[90px] border-2 border-dashed border-brand-gold-500 rounded-lg flex flex-col items-center justify-center gap-1 bg-brand-gold-50/20 cursor-pointer hover:bg-brand-gold-50/40 transition-colors"
              >
                <Upload className="w-5 h-5 text-brand-gold-500" />
                <span className="text-neutral-500 text-[12px] font-medium">Click to upload or drag & drop</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col gap-6 border-t border-neutral-50 mt-8">
        <div className="flex flex-col gap-2 max-w-xl pt-6">
          <h4 className="text-[12px] font-bold text-neutral-600">Statutory declaration</h4>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            I confirm that all information and documents I submit are genuine and belong to me. I understand that submitting false documents is an offence under Ghanaian law and I accept full legal accountability for this submission.
          </p>
          <label className="flex items-center gap-2.5 cursor-pointer group mt-1">
            <input 
              type="checkbox"
              name="agreed"
              checked={formData.agreed}
              onChange={handleInputChange}
              className="hidden"
            />
            <div className={`w-4 h-4 rounded border-2 transition-colors flex items-center justify-center ${formData.agreed ? 'border-brand-gold-500 bg-brand-gold-500' : 'border-brand-gold-500 bg-white group-hover:bg-brand-gold-50'}`}>
              {formData.agreed && (
                <svg className="w-2.5 h-2.5 text-brand-navy-800 fill-current" viewBox="0 0 20 20">
                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                </svg>
              )}
            </div>
            <span className="text-[11px] font-medium text-neutral-500">I agree to the above declaration</span>
          </label>
        </div>

        <div className="flex justify-end pt-2 mb-4">
          <button 
            onClick={() => onSave(formData)}
            disabled={!formData.agreed || currentProgress < 100}
            className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 ${
              formData.agreed && currentProgress === 100
                ? 'bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-800' 
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none'
            }`}
          >
            Save & continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
