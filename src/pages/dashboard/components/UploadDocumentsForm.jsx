import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, ChevronDown, UploadCloud, Trash2, FileText, AlertCircle } from 'lucide-react';
import SupremeSeal from '../../../assets/images/Vector.svg';

const UploadDocumentsForm = ({ onSave, onProgressUpdate, initialData }) => {
  const [agreed, setAgreed] = useState(initialData?.uploadedDocs?.length > 0);
  const [selectedType, setSelectedType] = useState(initialData?.selectedType || 'Birth certificate');
  const [uploadedDocs, setUploadedDocs] = useState(initialData?.uploadedDocs || []);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Calculate progress
  useEffect(() => {
    let progress = 0;
    if (uploadedDocs.length > 0) progress += 50;
    if (agreed) progress += 50;
    
    if (onProgressUpdate) {
      onProgressUpdate(progress);
    }
  }, [uploadedDocs, agreed, onProgressUpdate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    if (uploadedDocs.length >= 5) {
      setError('Maximum 5 documents per submission.');
      return;
    }

    const newDoc = {
      id: Date.now(),
      type: selectedType,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      file: file 
    };

    setUploadedDocs([...uploadedDocs, newDoc]);
    setError(null);
    e.target.value = ''; 
  };

  const handleDelete = (id) => {
    setUploadedDocs(uploadedDocs.filter(doc => doc.id !== id));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    onSave({ uploadedDocs, selectedType });
  };

  const currentProgress = (uploadedDocs.length > 0 ? 50 : 0) + (agreed ? 50 : 0);

  return (
    <div className="w-full bg-white animate-fade-in px-1">
      {/* Step Header */}
      <div className="flex items-start gap-4 mb-8 bg-emerald-50/10 p-4 rounded-xl border border-emerald-50/50">
        <div className="w-[52px] h-[52px] bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center shrink-0">
          <Paperclip className="w-6 h-6 text-emerald-800" />
        </div>
        <div className="flex flex-col gap-1 pt-0.5 w-full">
          <div className="flex items-center gap-2">
            <span className="text-emerald-800 text-[14px] font-bold">Step 2: Upload documents</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1">
            <p className="text-[11px] text-neutral-400 max-w-lg leading-tight">
              Add all the documents you need attested. Each document needs its own seal confirmation. Max <span className="font-bold text-neutral-600">5 documents</span>.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-32 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-800 transition-all duration-500" style={{ width: `${currentProgress}%` }} />
              </div>
              <span className="text-neutral-400 text-[12px] font-bold">{currentProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-shake">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 2xl:gap-32 mb-10 xl:mb-16">
        <div className="flex flex-col gap-8">
          <div className="w-full p-6 border border-neutral-100 rounded-2xl bg-neutral-50/30">
            <div className="flex flex-col gap-2 mb-8">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Document Type</label>
              <div className="relative group">
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full h-11 px-4 bg-white rounded-lg border border-neutral-200 outline-none text-sm appearance-none cursor-pointer text-neutral-700 font-medium"
                >
                  <option value="Birth certificate">Birth certificate</option>
                  <option value="Admission letter">Admission letter</option>
                  <option value="Passport bio data">Bio data of passport</option>
                  <option value="Result slip">Result slip</option>
                  <option value="Marriage Certificate">Marriage Certificate</option>
                  <option value="Police Clearance">Police Clearance</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 mb-8">
              <div className="w-24 h-24 shrink-0">
                <img src={SupremeSeal} className="w-full h-full object-contain opacity-70" alt="Supreme Court Seal" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-neutral-700">Confirm the Supreme Court seal is present</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  The Supreme Court stamp must be visible before you upload.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-8">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">File Upload</label>
              <div 
                onClick={handleUploadClick}
                className="w-full h-32 border-2 border-dashed border-brand-gold-500 rounded-xl flex flex-col items-center justify-center gap-2 bg-white cursor-pointer hover:bg-brand-gold-50/30 transition-all group"
              >
                <UploadCloud className="w-6 h-6 text-brand-gold-500 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col items-center">
                  <span className="text-brand-gold-500 text-[13px] font-bold">Click to upload document scan</span>
                  <span className="text-neutral-300 text-[11px]">PDF, JPG or PNG  Max 5MB</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden" 
                />
              </div>
            </div>

            <button 
              onClick={handleUploadClick}
              disabled={uploadedDocs.length >= 5}
              className={`w-full h-12 rounded-lg text-sm font-bold transition-all shadow-sm ${
                uploadedDocs.length < 5 
                  ? 'bg-brand-navy-800 text-white hover:bg-brand-navy-900' 
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              }`}
            >
              Add another document
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {uploadedDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-neutral-50/20 rounded-2xl border-2 border-dashed border-neutral-100 opacity-60">
              <FileText className="w-10 h-10 text-neutral-200 mb-2" />
              <p className="text-neutral-400 text-xs font-medium">No documents added yet</p>
            </div>
          ) : (
            uploadedDocs.map((doc) => (
              <div key={doc.id} className="w-full p-4 bg-white border border-neutral-100 rounded-xl flex items-center justify-between group hover:border-neutral-200 transition-all shadow-sm animate-fade-in-up">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center">
                     <FileText className="w-5 h-5 opacity-40 text-neutral-400" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-neutral-800 tracking-tight">{doc.type}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-neutral-300 font-medium truncate max-w-[150px]">{doc.name}</span>
                      <span className="text-[11px] text-neutral-300 font-medium">{doc.size}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(doc.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Section */}
      <div className="flex flex-col gap-8 border-t border-neutral-50 pt-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h4 className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">Confirm your submission</h4>
          <label className="flex items-start gap-3 cursor-pointer group mt-2">
            <input 
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="hidden"
            />
            <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${agreed ? 'border-brand-gold-500 bg-brand-gold-500' : 'border-neutral-200 bg-white group-hover:border-brand-gold-500'}`}>
              {agreed && (
                <svg className="w-3 h-3 text-brand-navy-900 fill-current" viewBox="0 0 20 20">
                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                </svg>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-medium">
              I confirm all documents listed bear the Supreme Court seal and I accept legal accountability.
            </p>
          </label>
        </div>

        <div className="flex justify-end pt-4 mb-4">
          <button 
            onClick={handleSave}
            disabled={!agreed || uploadedDocs.length === 0}
            className={`px-10 py-3 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 ${
              (agreed && uploadedDocs.length > 0)
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

export default UploadDocumentsForm;
