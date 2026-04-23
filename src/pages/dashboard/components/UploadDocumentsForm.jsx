import React, { useState, useRef } from 'react';

// Assets from Figma context
const imgArrowDown = "http://localhost:3845/assets/4c04e9307657a673a7b8f66510075aa6b571cdf2.svg";
const imgPaperClip = "http://localhost:3845/assets/d827cc0b049e588e4f4f4e928faecd7ee87f7192.svg";
const imgSupremeSeal = "http://localhost:3845/assets/05930268ec354d2091722d41530e84b8034d6f25dc0.png";
const imgUploadCloud = "http://localhost:3845/assets/666b39efe1e7c9d3a2aaea96e632e6a683be0f19.svg";
const imgTrashIcon = "http://localhost:3845/assets/51177012a191a71f8fe16d8da05fc4f3d747736f.svg";
const imgPDFIcon = "http://localhost:3845/assets/d827cc0b049e588e4f4f4e928faecd7ee87f7192.svg";

const UploadDocumentsForm = ({ onSave }) => {
  const [agreed, setAgreed] = useState(false);
  const [selectedType, setSelectedType] = useState('Birth certificate');
  const [uploadedDocs, setUploadedDocs] = useState([
    { id: 1, type: 'WASSCE / BECE certificate', name: 'wassce_bece_certificate_2026.pdf', size: '2.2 MB' },
    { id: 2, type: 'WASSCE / BECE certificate', name: 'wassce_bece_certificate_2026.pdf', size: '2.2 MB' },
    { id: 3, type: 'WASSCE / BECE certificate', name: 'wassce_bece_certificate_2026.pdf', size: '2.2 MB' },
    { id: 4, type: 'WASSCE / BECE certificate', name: 'wassce_bece_certificate_2026.pdf', size: '2.2 MB' },
    { id: 5, type: 'WASSCE / BECE certificate', name: 'wassce_bece_certificate_2026.pdf', size: '2.2 MB' },
  ]);

  const fileInputRef = useRef(null);

  const handleDelete = (id) => {
    setUploadedDocs(uploadedDocs.filter(doc => doc.id !== id));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full bg-white animate-fade-in px-1">
      {/* Step Header */}
      <div className="flex items-start gap-4 mb-8 bg-emerald-50/10 p-4 rounded-xl border border-emerald-50/50">
        <div className="w-[52px] h-[52px] bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center shrink-0">
          <img src={imgPaperClip} className="w-6 h-6 text-emerald-800" alt="" />
        </div>
        <div className="flex flex-col gap-1 pt-0.5 w-full">
          <div className="flex items-center gap-2">
            <span className="text-emerald-800 text-[14px] font-bold">Step 2: Upload documents</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1">
            <p className="text-[11px] text-neutral-400 max-w-lg leading-tight">
              Add all the documents you need attested in this submission. Each document needs its own seal confirmation. Maximum <span className="font-bold text-neutral-600">5 documents</span> per submission.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-32 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-800 w-[100%]" />
              </div>
              <span className="text-neutral-400 text-[12px] font-bold">100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
        {/* Left Side: Upload Controls */}
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
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <img src={imgArrowDown} className="w-3 h-3" alt="" />
                </div>
              </div>
            </div>

            {/* Seal Confirmation Visual */}
            <div className="flex items-center gap-5 mb-8">
              <div className="w-24 h-24 shrink-0">
                <img src={imgSupremeSeal} className="w-full h-full object-contain opacity-70" alt="Supreme Court Seal" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-neutral-700">Confirm the Supreme Court seal is present</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  The Supreme Court or Judicial Service Registry stamp must be clearly visible before you upload.
                </p>
              </div>
            </div>

            {/* Upload Zone */}
            <div className="flex flex-col gap-2 mb-8">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Ghana Card Photo</label>
              <div 
                onClick={handleUploadClick}
                className="w-full h-32 border-2 border-dashed border-brand-gold-500 rounded-xl flex flex-col items-center justify-center gap-2 bg-white cursor-pointer hover:bg-brand-gold-50/30 transition-all group"
              >
                <img src={imgUploadCloud} className="w-6 h-6 text-brand-gold-500 group-hover:scale-110 transition-transform" alt="" />
                <div className="flex flex-col items-center">
                  <span className="text-brand-gold-500 text-[13px] font-bold">Click to upload document scan</span>
                  <span className="text-neutral-300 text-[11px]">PDF, JPG or PNG  Max 10MB per file</span>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" />
              </div>
            </div>

            <button className="w-full h-12 bg-neutral-300 text-white rounded-lg text-sm font-bold cursor-not-allowed shadow-none">
              Add another document
            </button>
          </div>
        </div>

        {/* Right Side: Uploaded List */}
        <div className="flex flex-col gap-4">
          {uploadedDocs.map((doc) => (
            <div key={doc.id} className="w-full p-4 bg-white border border-neutral-100 rounded-xl flex items-center justify-between group hover:border-neutral-200 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center relative">
                   <img src={imgPDFIcon} className="w-5 h-5 opacity-40" alt="" />
                   <span className="absolute bottom-1 text-[8px] font-black text-neutral-400 uppercase">PDF</span>
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
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
              I confirm all documents listed above bear the official Supreme Court or Judicial Service seal, are genuine originals, and I accept full legal accountability for this submission.
            </p>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={() => onSave({})}
            disabled={!agreed}
            className={`px-10 py-3 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 ${
              agreed 
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
