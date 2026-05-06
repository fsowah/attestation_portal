import React, { useState, useEffect } from 'react';
import { CreditCard, ChevronDown, CheckCircle } from 'lucide-react';

const imgGhanaGh = "https://flagcdn.com/w40/gh.png";

const ServiceTierPaymentForm = ({ onSave, onProgressUpdate, initialData }) => {
  const [serviceTier, setServiceTier] = useState(initialData?.tier?.toLowerCase() || 'standard'); // 'standard' or 'express'
  const [paymentMethod, setPaymentMethod] = useState('momo'); // 'momo' or 'card'
  const [momoNetwork, setMomoNetwork] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('548902177');
  const [cardName, setCardName] = useState('');
  const [hasPaid, setHasPaid] = useState(!!initialData?.tier);

  const pricing = {
    standard: { label: 'Standard', time: '3 – 5 working days', price: 200 },
    express: { label: 'Express', time: '24 to 48 hours', price: 450 }
  };

  const totalPrice = pricing[serviceTier].price;

  // Calculate progress
  useEffect(() => {
    let progress = 33; // Starting state (tier selected by default)
    
    if (paymentMethod === 'momo' && momoNetwork) progress = 66;
    if (paymentMethod === 'card' && cardName) progress = 66;
    if (hasPaid) progress = 100;

    if (onProgressUpdate) {
      onProgressUpdate(progress);
    }
  }, [serviceTier, paymentMethod, momoNetwork, cardName, hasPaid, onProgressUpdate]);

  return (
    <div className="w-full bg-white animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 xl:gap-x-14 gap-y-8">
        {/* Left Column: Service Tier & Summary */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div
              onClick={() => setServiceTier('standard')}
              className={`px-4 py-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                serviceTier === 'standard'
                  ? 'bg-white border-brand-gold-500'
                  : 'bg-[#F9F8F7] border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  serviceTier === 'standard' ? 'border-brand-gold-500 bg-brand-gold-500' : 'border-neutral-200 bg-white'
                }`}>
                  {serviceTier === 'standard' && <div className="w-1.5 h-1.5 bg-[#0A1628] rounded-full" />}
                </div>
                <span className="text-[14px] font-bold text-neutral-800">Standard</span>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-4 text-right sm:text-left">
                <span className="text-[12px] text-neutral-400 font-medium">3 – 5 working days</span>
                <span className="text-[14px] font-bold text-neutral-300">GHS 200</span>
              </div>
            </div>

            <div
              onClick={() => setServiceTier('express')}
              className={`px-4 py-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                serviceTier === 'express'
                  ? 'bg-white border-brand-gold-500'
                  : 'bg-[#F9F8F7] border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  serviceTier === 'express' ? 'border-brand-gold-500 bg-brand-gold-500' : 'border-neutral-200 bg-white'
                }`}>
                  {serviceTier === 'express' && <div className="w-1.5 h-1.5 bg-[#0A1628] rounded-full" />}
                </div>
                <span className="text-[14px] font-bold text-neutral-800">Express</span>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-4 text-right sm:text-left">
                <span className="text-[12px] text-neutral-400 font-medium">24 to 48 hours</span>
                <span className="text-[14px] font-bold text-neutral-300">GHS 450</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#0A1628] text-white rounded-xl p-6 mt-2 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <CreditCard className="w-24 h-24" />
            </div>
            <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.2em] mb-10 opacity-60">ORDER SUMMARY</h4>
            <div className="flex flex-col gap-5 flex-grow relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-neutral-400">Status</span>
                <span className={`text-[14px] font-bold ${hasPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {hasPaid ? 'Payment Confirmed' : 'Awaiting Payment'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-neutral-400">Service tier</span>
                <span className="text-[14px] font-medium">{pricing[serviceTier].label}</span>
              </div>
            </div>
            <div className="pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
              <span className="text-[15px] font-medium text-neutral-400">Total</span>
              <span className="text-[18px] font-black text-brand-gold-500">GHS {totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Method */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <h4 className="text-[14px] font-bold text-brand-navy-800">Payment method</h4>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPaymentMethod('momo')}
                className={`flex-1 h-10 rounded-lg text-sm font-bold transition-all ${
                  paymentMethod === 'momo' ? 'bg-[#0A1628] text-white' : 'bg-[#F9F8F7] text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                Mobile Money
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 h-10 rounded-lg text-sm font-bold transition-all ${
                  paymentMethod === 'card' ? 'bg-[#0A1628] text-white' : 'bg-[#F9F8F7] text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                Credit Card
              </button>
            </div>

            {/* MOMO Form */}
            {paymentMethod === 'momo' && (
              <div className="flex flex-col gap-6 animate-fade-in mt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">MOBILE NETWORK</label>
                  <div className="relative group">
                    <select 
                      value={momoNetwork}
                      onChange={(e) => setMomoNetwork(e.target.value)}
                      className="w-full h-11 px-4 bg-white rounded-lg border border-neutral-200 outline-none text-sm appearance-none cursor-pointer text-neutral-800 font-medium focus:border-brand-gold-500 transition-colors"
                    >
                      <option value="">Select network</option>
                      <option value="mtn">MTN MoMo</option>
                      <option value="vodafone">Vodafone Cash</option>
                      <option value="airteltigo">AirtelTigo Money</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">PHONE NUMBER</label>
                  <div className="flex h-11 rounded-lg border border-neutral-200 overflow-hidden focus-within:border-brand-gold-500 transition-colors">
                    <div className="w-[95px] h-full bg-[#F0EFEE] flex items-center justify-center gap-1.5 border-r border-neutral-100">
                      <img src={imgGhanaGh} className="w-[18px] h-auto object-contain" alt="Ghana Flag" />
                      <span className="text-[13px] font-medium text-neutral-400">+233</span>
                    </div>
                    <input 
                      type="text" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-grow px-4 outline-none text-sm font-medium text-neutral-800"
                    />
                  </div>
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
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name on card"
                    className="w-full h-11 px-4 bg-white rounded-lg border border-neutral-200 outline-none text-sm placeholder:text-neutral-200 font-medium text-neutral-800 focus:border-brand-gold-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">CARD NUMBER</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000"
                    className="w-full h-11 px-4 bg-white rounded-lg border border-neutral-200 outline-none text-sm placeholder:text-neutral-200 font-medium text-neutral-800 tracking-[0.1em]"
                  />
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => {
              if (!hasPaid) {
                setHasPaid(true);
              } else {
                onSave({ 
                  tier: pricing[serviceTier].label, 
                  price: totalPrice,
                  paymentMethod,
                  momoNetwork: paymentMethod === 'momo' ? momoNetwork : null,
                  momoPhone: paymentMethod === 'momo' ? phoneNumber : null,
                  cardName: paymentMethod === 'card' ? cardName : null
                });
              }
            }}
            className={`w-full h-[54px] rounded-lg text-[15px] font-bold transition-all mt-6 flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98] ${
              hasPaid 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' 
                : 'bg-brand-gold-500 text-brand-navy-800 hover:bg-brand-gold-600 shadow-brand-gold-100'
            }`}
          >
            {hasPaid ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Payment Confirmed — Continue</span>
              </>
            ) : `Pay GHS ${totalPrice}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceTierPaymentForm;
