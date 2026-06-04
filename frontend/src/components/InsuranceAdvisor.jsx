import React, { useState } from 'react';
import { Phone, Check, Copy, MessageSquare, ShieldCheck, HeartPulse, Activity, Award, Briefcase } from 'lucide-react';

export default function InsuranceAdvisor() {
  const [copied, setCopied] = useState(false);

  const phoneNumber = "919940851598";

  const handleCopy = () => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = phoneNumber;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Unable to copy', err);
    }
    document.body.removeChild(tempTextArea);
  };

  return (
    <div className="w-full bg-[#0b3d51] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans antialiased">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#50ad77]/10 text-[#50ad77] border border-[#50ad77]/20">
            <HeartPulse className="w-3.5 h-3.5 animate-pulse" /> Kavin Health & Medicare Pvt Ltd
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Consult Our Certified <span className="text-[#50ad77]">Insurance Specialist</span>
          </h2>
          <div className="text-sm sm:text-base text-slate-300 font-medium">
            (Dealing with all types of insurance -{'>'}{' '}
            <a 
              href={`https://wa.me/${phoneNumber}?text=Hi,%20I%20am%20visiting%20the%20Health%20and%20Medicare%20website.%20I%20need%20assistance%20regarding%20life%20insurance`}
              target="_blank"
              rel="noreferrer"
              className="text-[#50ad77] hover:underline cursor-pointer"
            >
              life
            </a>
            /
            <a 
              href={`https://wa.me/${phoneNumber}?text=Hi,%20I%20am%20visiting%20the%20Health%20and%20Medicare%20website.%20I%20need%20assistance%20regarding%20health%20insurance`}
              target="_blank"
              rel="noreferrer"
              className="text-[#50ad77] hover:underline cursor-pointer"
            >
              health
            </a>
            )
          </div>
          <div className="text-sm sm:text-base text-yellow-300 font-semibold mb-2">
            Any queries free consultation is available
          </div>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-400">
            Get personalized medical coverage guidance, seamless cashless claims support, and policy reviews tailored to your family's safety.
          </p>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#50ad77] to-emerald-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-35 transition duration-500"></div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c2417] via-[#07170f] to-[#040d09] border border-[#50ad77]/30 shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d2f1d_1px,transparent_1px),linear-gradient(to_bottom,#0d2f1d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
            <div className="relative z-10 text-center md:text-left flex-1 space-y-3">
              <div className="space-y-1">
                <span className="text-lg sm:text-xl font-medium text-[#50ad77] tracking-wider uppercase block">
                  Contact
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-white leading-none tracking-tight relative inline-block">
                  Your Insurance Advisor
                  <span className="block h-[3.5px] bg-white w-full mt-2.5 rounded-full shadow-sm"></span>
                </h3>
              </div>
              <p className="text-yellow-300 text-lg sm:text-xl font-bold tracking-wide pt-2 inline-flex items-center gap-2">
                <Award className="w-5.5 h-5.5 text-yellow-300 animate-bounce" />
                15 Years Expertise in the Field
              </p>
            </div>
            <div className="hidden md:block w-[1.5px] h-24 bg-gradient-to-b from-transparent via-[#50ad77]/40 to-transparent mx-6 lg:mx-8"></div>
            <div className="relative z-10 w-full md:w-auto flex flex-col items-center justify-center space-y-4">
              <a 
                href={`tel:${phoneNumber}`}
                className="group/phone flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 active:bg-white/15 text-white rounded-2xl px-6 py-4 border border-white/10 hover:border-[#50ad77]/60 transition-all duration-300 w-full md:w-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="relative bg-[#50ad77] text-white p-3 rounded-full shadow-md group-hover/phone:scale-105 transition-transform">
                  <Phone className="w-6 h-6 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-xs text-emerald-300/80 font-semibold block uppercase tracking-widest">Call Specialist</span>
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-wider filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    {phoneNumber}
                  </span>
                </div>
              </a>
              <div className="grid grid-cols-2 gap-2 w-full">
                <button 
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-1.5 bg-slate-950/70 hover:bg-slate-950/90 text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl border border-slate-800 hover:border-[#50ad77]/30 transition duration-200 text-slate-300 active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#50ad77]" />
                      <span className="text-[#50ad77]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>Copy Call ID</span>
                    </>
                  )}
                </button>
                <a 
                  href={`https://wa.me/${phoneNumber}?text=Hi,%20I%20am%20visiting%20the%20Health%20and%20Medicare%20website.%20I%20need%20assistance%20regarding%20insurance.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-[#50ad77] hover:bg-[#419263] text-slate-950 font-bold py-2.5 px-3 rounded-xl shadow-lg shadow-[#50ad77]/20 hover:shadow-[#50ad77]/30 transition duration-200 text-xs sm:text-sm active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
            <div className="bg-[#50ad77]/10 p-2 rounded-lg text-[#50ad77] mt-0.5">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Cashless network</h4>
              <p className="text-xs text-slate-400 mt-0.5">We guide you to network hospitals offering paperless admissions.</p>
            </div>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
            <div className="bg-[#50ad77]/10 p-2 rounded-lg text-[#50ad77] mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Pre-existing disease cover</h4>
              <p className="text-xs text-slate-400 mt-0.5">Expert optimization of policy terms with minimal waiting times.</p>
            </div>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
            <div className="bg-[#50ad77]/10 p-2 rounded-lg text-[#50ad77] mt-0.5">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Family Floater Plans</h4>
              <p className="text-xs text-slate-400 mt-0.5">Get unified premium setups with multi-member loyalty benefits.</p>
            </div>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
            <div className="bg-[#50ad77]/10 p-2 rounded-lg text-[#50ad77] mt-0.5">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">GMC Policies</h4>
              <p className="text-xs text-slate-400 mt-0.5">Group Policies for Corporates / Companies</p>
            </div>
          </div>
        </div>
      </div>
      <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-950 border border-[#50ad77]/50 text-white px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 ${copied ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
        <div className="bg-[#50ad77] p-1 rounded-full">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="text-left">
          <p className="text-xs text-[#50ad77] font-bold">Copied Contact Number!</p>
          <p className="text-xs text-white font-semibold">{phoneNumber}</p>
        </div>
      </div>
    </div>
  );
}