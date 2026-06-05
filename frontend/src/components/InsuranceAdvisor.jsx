import React, { useState } from 'react';
import { Phone, Check, Copy, MessageSquare, ShieldCheck, HeartPulse, Activity, Award, Briefcase } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default function InsuranceAdvisor() {
  const [copied, setCopied] = useState(false);

  const phoneNumber = "9150118788";

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
    <div className="w-full bg-white py-4 md:py-16 lg:py-8 px-4 md:px-8 flex flex-col items-center justify-center font-sans antialiased overflow-hidden">
      <div className="max-w-7xl w-full space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#50ad77]/10 text-[#50ad77] border border-[#50ad77]/20">
            <HeartPulse className="w-4 h-4 animate-pulse" /> Kavin Health & Medicare Pvt Ltd
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Consult Our Certified <br className="hidden sm:block" />
            <span className="text-[#50ad77]">Insurance Specialist</span>
          </h2>
          <div className="text-base sm:text-lg text-slate-600 font-medium">
            Dealing with all types of insurance - click below
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1 pb-2">
            <a 
              href={`https://wa.me/${phoneNumber}?text=Hi,%20I%20am%20visiting%20the%20Health%20and%20Medicare%20website.%20I%20need%20assistance%20regarding%20life%20insurance`}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-2.5 rounded-full bg-white text-[#50ad77] font-bold hover:bg-[#50ad77] hover:text-white transition-all shadow-sm border-2 border-[#50ad77]/20 hover:border-[#50ad77] hover:shadow-md"
            >
              Life
            </a>
            <a 
              href={`https://wa.me/${phoneNumber}?text=Hi,%20I%20am%20visiting%20the%20Health%20and%20Medicare%20website.%20I%20need%20assistance%20regarding%20health%20insurance`}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-2.5 rounded-full bg-white text-[#50ad77] font-bold hover:bg-[#50ad77] hover:text-white transition-all shadow-sm border-2 border-[#50ad77]/20 hover:border-[#50ad77] hover:shadow-md"
            >
              Health
            </a>
          </div>
          <div className="inline-block bg-amber-100/80 text-amber-800 text-sm sm:text-base font-bold px-4 py-2 rounded-xl shadow-sm border border-amber-200">
            Any queries? Free consultation is available!
          </div>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-medium">
            Get personalized medical coverage guidance, seamless cashless claims support, and policy reviews tailored to your family's safety.
          </p>
        </div>
        
        <div className="relative group max-w-5xl mx-auto w-full">
          <div className="absolute -inset-1.5 bg-[#50ad77] rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative overflow-hidden rounded-3xl bg-[#50ad77] shadow-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50"></div>
            
            <div className="relative z-10 text-center md:text-left flex-1 space-y-4">
              <div className="space-y-2">
                <span className="text-lg sm:text-xl font-bold text-white/90 tracking-widest uppercase block drop-shadow-sm">
                  Contact
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                  Your Insurance Advisor
                </h3>
              </div>
              <p className="text-white text-base sm:text-lg font-bold tracking-wide pt-2 inline-flex items-center justify-center md:justify-start gap-2 bg-white/20 px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/20 shadow-sm">
                <Award className="w-6 h-6 text-yellow-300" />
                15 Years Expertise in the Field
              </p>
            </div>
            
            <div className="hidden md:block w-[2px] h-32 bg-gradient-to-b from-transparent via-white/40 to-transparent mx-4 lg:mx-8"></div>
            
            <div className="relative z-10 w-full md:w-auto flex flex-col items-center justify-center space-y-5">
              <a 
                href={`tel:${phoneNumber}`}
                className="group/phone flex items-center justify-center gap-5 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl px-6 py-4 transition-all duration-300 w-full shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="relative bg-[#50ad77]/10 text-[#50ad77] p-3 rounded-full group-hover/phone:scale-110 transition-transform">
                  <Phone className="w-7 h-7" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#50ad77] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#50ad77]"></span>
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-xs text-slate-500 font-bold block uppercase tracking-widest">Call Specialist</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#50ad77] tracking-wider">
                    {phoneNumber}
                  </span>
                </div>
              </a>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                <button 
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold py-3 px-4 rounded-xl border border-white/30 transition-all duration-200 active:scale-95 shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
                <a 
                  href={`https://wa.me/${phoneNumber}?text=Hi,%20I%20am%20visiting%20the%20Health%20and%20Medicare%20website.%20I%20need%20assistance%20regarding%20insurance.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
                >
                  <FaWhatsapp className="w-5 h-5 text-[#50ad77]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full pt-4">
          <div className="bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-[#50ad77]/30 transition-all duration-300 p-6 rounded-2xl flex items-start gap-4 group">
            <div className="bg-[#50ad77]/10 p-3 rounded-xl text-[#50ad77] shrink-0 group-hover:bg-[#50ad77] group-hover:text-white transition-colors duration-300">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base lg:text-lg">100% Cashless</h4>
              <p className="text-base text-slate-500 mt-2 leading-relaxed font-medium">We guide you to network hospitals offering paperless admissions.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-[#50ad77]/30 transition-all duration-300 p-6 rounded-2xl flex items-start gap-4 group">
            <div className="bg-[#50ad77]/10 p-3 rounded-xl text-[#50ad77] shrink-0 group-hover:bg-[#50ad77] group-hover:text-white transition-colors duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base lg:text-lg">Pre-existing disease</h4>
              <p className="text-base text-slate-500 mt-2 leading-relaxed font-medium">Expert optimization of policy terms with minimal waiting times.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-[#50ad77]/30 transition-all duration-300 p-6 rounded-2xl flex items-start gap-4 group">
            <div className="bg-[#50ad77]/10 p-3 rounded-xl text-[#50ad77] shrink-0 group-hover:bg-[#50ad77] group-hover:text-white transition-colors duration-300">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base lg:text-lg">Family Floater</h4>
              <p className="text-base text-slate-500 mt-2 leading-relaxed font-medium">Get unified premium setups with multi-member loyalty benefits.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-[#50ad77]/30 transition-all duration-300 p-6 rounded-2xl flex items-start gap-4 group">
            <div className="bg-[#50ad77]/10 p-3 rounded-xl text-[#50ad77] shrink-0 group-hover:bg-[#50ad77] group-hover:text-white transition-colors duration-300">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base lg:text-lg">GMC Policies</h4>
              <p className="text-base text-slate-500 mt-2 leading-relaxed font-medium">Comprehensive Group Policies specially designed for Corporates.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 border-l-4 border-[#50ad77] text-white px-5 py-4 rounded-xl shadow-2xl transition-all duration-300 ${copied ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
        <div className="bg-[#50ad77] p-1.5 rounded-full">
          <Check className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <p className="text-xs text-[#50ad77] font-bold uppercase tracking-wider">Copied Successfully!</p>
          <p className="text-sm text-white font-semibold mt-0.5">{phoneNumber}</p>
        </div>
      </div>
    </div>
  );
}