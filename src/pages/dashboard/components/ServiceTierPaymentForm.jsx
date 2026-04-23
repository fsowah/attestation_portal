import React, { useState } from 'react';

// Assets from Figma context
const imgCreditCardPos = "http://localhost:3845/assets/e91a5574ca20cc6b71c856d08890538d17346655.svg";
const imgGhanaGh = "http://localhost:3845/assets/8d25541c19dab5dc3c40ed0d6d96c0c85a31d0eb.svg";
const imgArrowDown = "http://localhost:3845/assets/4c04e9307657a673a7b8f66510075aa6b571cdf2.svg";

const ServiceTierPaymentForm = ({ onSave }) => {
  const [serviceTier, setServiceTier] = useState('standard'); // 'standard' or 'express'
  const [paymentMethod, setPaymentMethod] = useState('momo'); // 'momo' or 'card'
  const [momoNetwork, setMomoNetwork] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasPaid, setHasPaid] = useState(false);

  const pricing = {
    standard: { label: 'Standard', time: '3 – 5 working days', price: 200 },
    express: { label: 'Express', time: '24 to 48 hours', price: 450 }
  };

  const totalPrice = pricing[serviceTier].price;

  return (
    <div className="w-full bg-white animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12">
        {/* Left Column: Service Tier & Summary */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {/* Standard Option */}
            <div 
              onClick={() => setServiceTier('standard')}
              className={`h-[88px] px-6 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                serviceTier === 'standard' 
                  ? 'bg-white border-brand-gold-500' 
                  : 'bg-[#F9F8F7] border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors ${
                  serviceTier === 'standard' ? 'border-brand-gold-500 bg-brand-gold-500' : 'border-neutral-200 bg-white'
                }`}>
                  {serviceTier === 'standard' && <div className="w-2 h-2 bg-[#0A1628] rounded-full" />}
                </div>
                <span className="text-[14px] font-bold text-neutral-800">Standard</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[13px] text-neutral-400 font-medium tracking-tight">3 – 5 working days</span>
                <span className="text-[14px] font-bold text-neutral-300 tracking-tight">GHS 200</span>
              </div>
            </div>

            {/* Express Option */}
            <div 
              onClick={() => setServiceTier('express')}
              className={`h-[88px] px-6 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                serviceTier === 'express' 
                  ? 'bg-white border-brand-gold-500' 
                  : 'bg-[#F9F8F7] border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors ${
                  serviceTier === 'express' ? 'border-brand-gold-500 bg-brand-gold-500' : 'border-neutral-200 bg-white'
                }`}>
                  {serviceTier === 'express' && <div className="w-2 h-2 bg-[#0A1628] rounded-full" />}
                </div>
                <span className="text-[14px] font-bold text-neutral-800">Express</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[13px] text-neutral-400 font-medium tracking-tight">24 to 48 hours</span>
                <span className="text-[14px] font-bold text-neutral-300 tracking-tight">GHS 450</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#0A1628] text-white rounded-xl p-8 mt-2 h-[260px] flex flex-col">
            <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.1em] mb-10">ORDER SUMMARY</h4>
            <div className="flex flex-col gap-5 flex-grow">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-neutral-400">Document</span>
                <span className="text-[14px] font-medium">University transcript</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-neutral-400">Service tier</span>
                <span className="text-[14px] font-medium">{pricing[serviceTier].label}</span>
              </div>
            </div>
            <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-[15px] font-medium text-neutral-400">Total</span>
              <span className="text-[15px] font-bold">GHS {totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Method */}
        <div className="flex flex-col gap-6 lg:pl-10">
          <div className="flex flex-col gap-5">
            <h4 className="text-[14px] font-bold text-neutral-800">Payment method</h4>
            
            {/* Payment Toggle */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPaymentMethod('momo')}
                className={`w-[140px] h-[44px] rounded-lg text-sm font-bold transition-all ${
                  paymentMethod === 'momo' ? 'bg-[#0A1628] text-white' : 'bg-[#F9F8F7] text-neutral-500'
                }`}
              >
                Mobile money
              </button>
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`w-[140px] h-[44px] rounded-lg text-sm font-bold transition-all ${
                  paymentMethod === 'card' ? 'bg-[#0A1628] text-white' : 'bg-[#F9F8F7] text-neutral-500'
                }`}
              >
                Credit card
              </button>
            </div>

            {/* MOMO Form */}
            {paymentMethod === 'momo' && (
              <div className="flex flex-col gap-6 animate-fade-in mt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">MOBILE NETWORK</label>
                  <div className="relative group">
                    <select 
                      value={momoNetwork || 'mtn'}
                      onChange={(e) => setMomoNetwork(e.target.value)}
                      className="w-full h-11 px-4 bg-white rounded-lg border border-neutral-200 outline-none text-sm appearance-none cursor-pointer text-neutral-800 font-medium"
                    >
                      <option value="">Select network</option>
                      <option value="mtn">MTN MoMo</option>
                      <option value="vodafone">Vodafone Cash</option>
                      <option value="airteltigo">AirtelTigo Money</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                      <img src={imgArrowDown} className="w-3 h-3" alt="" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">PHONE NUMBER</label>
                  <div className="flex h-11 rounded-lg border border-neutral-200 overflow-hidden">
                    <div className="w-[95px] h-full bg-[#F0EFEE] flex items-center justify-center gap-1.5 border-r border-neutral-100">
                      <img src={imgGhanaGh} className="w-[14px] h-[11px]" alt="" />
                      <span className="text-[13px] font-medium text-neutral-400">+233</span>
                      <img src={imgArrowDown} className="w-2.5 h-2.5 opacity-30" alt="" />
                    </div>
                    <input 
                      type="text" 
                      defaultValue="548902177"
                      className="flex-grow px-4 outline-none text-sm font-medium text-neutral-800"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">NAME ON ACCOUNT</label>
                  <input 
                    type="text" 
                    defaultValue="Ama Dziedzom Barnor"
                    className="w-full h-11 px-4 bg-[#F0EFEE] rounded-lg border border-transparent outline-none text-sm text-neutral-500 font-medium"
                    disabled
                  />
                </div>
              </div>
            )}

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div className="flex flex-col gap-6 animate-fade-in mt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">NAME ON CARD</label>
                  <input 
                    type="text" 
                    placeholder="Name on card"
                    className="w-full h-11 px-4 bg-white rounded-lg border border-neutral-200 outline-none text-sm placeholder:text-neutral-200 font-medium text-neutral-300"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">CARD NUMBER</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000"
                    className="w-full h-11 px-4 bg-white rounded-lg border border-neutral-200 outline-none text-sm placeholder:text-neutral-200 font-medium text-neutral-300 tracking-[0.1em]"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">EXPIRY DATE</label>
                    <input 
                      type="text" 
                      placeholder="MM / YYYY"
                      className="w-full h-11 px-4 bg-white rounded-lg border border-neutral-200 outline-none text-sm placeholder:text-neutral-300 font-medium text-neutral-400"
                    />
                  </div>
                  <div className="w-[100px] flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">CVC</label>
                    <input 
                      type="text" 
                      placeholder="• • •"
                      className="w-full h-11 px-4 bg-white rounded-lg border border-neutral-200 outline-none text-sm placeholder:text-neutral-300 font-medium text-neutral-400 tracking-widest"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => {
              if (!hasPaid) {
                setHasPaid(true);
              } else {
                onSave({ tier: serviceTier, method: paymentMethod });
              }
            }}
            className={`w-full h-[54px] rounded-lg text-[15px] font-bold transition-all mt-6 flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] ${
              hasPaid 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                : 'bg-[#FCD116] text-[#0A1628] hover:bg-[#FCD116]/90'
            }`}
          >
            {hasPaid ? 'I have paid' : `Proceed to pay GHS 450`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceTierPaymentForm;
