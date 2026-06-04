import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import img1 from '../assets/img2.jpeg';
import img2 from '../assets/img1.jpeg';
import img3 from '../assets/img3.jpeg';
import { FaUserDoctor, FaFlaskVial, FaChevronRight, FaCheck } from "react-icons/fa6";
import { FaAward, FaShieldAlt } from "react-icons/fa";

export default function AboutSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true); 
        } else {
          setIsVisible(false); 
        }
      },
      {
        root: null,
        threshold: 0.15, 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const bookDemo = () => {
    closeModal();
    showToast("Opening Appointment scheduler... Please wait.");
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased font-sans relative overflow-hidden w-full">
      <style>{`
        @keyframes floatX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(12px); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulseSoft {
          0%, 100% { transform: scale(1) translate(0px, 0px); }
          50% { transform: scale(1.08) translate(10px, -10px); }
        }
        .animate-float-x { animation: floatX 6s ease-in-out infinite; }
        .animate-float-y { animation: floatY 6s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulseSoft 8s ease-in-out infinite; }
      `}</style>

      <section
        ref={sectionRef}
        className="relative py-12 md:py-16 lg:py-24 overflow-hidden bg-white z-10 w-full"
      >
        <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-[#50ad77]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft -z-10"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft -z-10" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 left-4 lg:left-12 opacity-15 pointer-events-none hidden md:block duration-1000 ease-out">
          <svg className="w-20 h-20 lg:w-24 lg:h-24 text-[#50ad77] animate-[spin_24s_linear_infinite]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
            <path d="M50 10V90M10 50H90" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        <div className="absolute bottom-1/4 right-4 lg:right-20 animate-float-x opacity-25 pointer-events-none hidden md:block">
          <svg className="w-12 h-12 lg:w-16 lg:h-16 text-emerald-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="60" height="60" rx="10" stroke="currentColor" strokeWidth="2" transform="rotate(45 50 50)" />
          </svg>
        </div>

        <div className="absolute top-12 right-1/4 w-3.5 h-3.5 bg-[#50ad77] rounded-full animate-ping pointer-events-none"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-16 items-center">
              <div className="md:col-span-5 lg:col-span-5 relative flex justify-center md:justify-start w-full">
                <div className="relative grid w-full max-w-[320px] sm:max-w-[460px] md:max-w-[520px] grid-cols-2 gap-4 sm:gap-5">
                  <div className={`col-span-2 aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-10 bg-slate-100 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                    }`}>
                    <img
                      src={img1}
                      alt="Doctor examining lab report"
                      className="w-full h-full object-cover bg-white transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className={`aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-white animate-float-y z-20 bg-slate-100 transition-all duration-1000 delay-500 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                    }`}>
                    <img
                      src={img3}
                      alt="Scientist looking in microscope"
                      className="w-full h-full object-cover bg-white"
                    />
                  </div>
                  <div className={`aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-white animate-float-x z-20 bg-slate-100 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                    }`}>
                    <img
                      src={img2}
                      alt="Lab tube sample testing"
                      className="w-full h-full object-cover bg-white"
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 opacity-20 -z-10 text-slate-400">
                    <svg width="100%" height="100%" fill="currentColor">
                      <pattern id="react-dot-pattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="2" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#react-dot-pattern)" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7 lg:col-span-7 w-full">
                <div className="space-y-6 sm:space-y-8">
                  <div className={`space-y-3 transition-all duration-700 delay-100 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#50ad77]/10 border border-[#50ad77]/20 rounded-full text-xs font-bold uppercase tracking-wider text-[#50ad77]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#50ad77] animate-pulse"></span> ABOUT US
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                      Occupational Health Services <span className="text-[#50ad77]">& OHC Setup</span>
                    </h2>
                  </div>
                  <div className={`space-y-4 text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl transition-all duration-700 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <p>
                      At <strong className="text-slate-900">Kavin Health and Medicare Pvt Ltd</strong>, we understand that a healthy workforce is the foundation of a productive and thriving workplace. Our Occupational Health Centre (OHC) is a dedicated wing that offers comprehensive on-site healthcare services to safeguard the well-being of employees and support industries in meeting statutory health compliance.
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#50ad77] mt-1 font-bold">➢</span>
                      <span>With a clear focus on prevention, early detection, and effective intervention, our OHC services are designed to reduce workplace-related health risks, improve employee wellness, and help organizations adhere to national safety standards such as the <strong className="text-slate-900">Factories Act, BOCW Act</strong>, and relevant industrial health regulations.</span>
                    </p>
                  </div>
                  <div className={`pt-2 transition-all duration-700 delay-750 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}>
                    <button
                      onClick={() => {
                        navigate("/aboutus");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 bg-[#50ad77] text-white rounded-2xl font-bold hover:bg-[#439665] transition-all shadow-lg shadow-[#50ad77]/20 active:scale-95 duration-200 cursor-pointer text-sm sm:text-base"
                    >
                      More About Us
                      <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs group-hover:translate-x-1 transition-transform">
                        <FaChevronRight />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        onClick={(e) => e.target === e.currentTarget && closeModal()}
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          className={`bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all duration-300 ${isModalOpen ? 'scale-100' : 'scale-95'
            }`}
        >
          <div className="p-6 bg-[#50ad77] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <h3 className="font-bold text-lg">Our Laboratory Credentials</h3>
            </div>
            <button
              onClick={closeModal}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-white"
            >
              ✕
            </button>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <p className="text-sm text-slate-600 leading-relaxed">
              Welcome to our state-of-the-art healthcare hub where accuracy meets empathy. We combine advanced diagnostic systems with human expertise to bring you trusted test results.
            </p>
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FaAward className="text-[#50ad77]" />
                Accreditations & Standards
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                  <FaShieldAlt className="text-[#50ad77]" />
                  CAP Accredited
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                  <FaShieldAlt className="text-[#50ad77]" />
                  ISO 15189 Certified
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                  <FaShieldAlt className="text-[#50ad77]" />
                  HIPAA Compliant
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                  <FaShieldAlt className="text-[#50ad77]" />
                  NABL Certified
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-slate-900 text-sm">Instant Lab Stats</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#50ad77]/5 rounded-xl">
                  <span className="block text-xl font-black text-[#50ad77]">99.9%</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Accuracy</span>
                </div>
                <div className="p-3 bg-[#50ad77]/5 rounded-xl">
                  <span className="block text-xl font-black text-[#50ad77]">1.2M+</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Tests Done</span>
                </div>
                <div className="p-3 bg-[#50ad77]/5 rounded-xl">
                  <span className="block text-xl font-black text-[#50ad77]">under 6 hrs</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">TAT Report</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Close Window
            </button>
            <button
              onClick={bookDemo}
              className="px-4 py-2 bg-[#50ad77] hover:bg-[#439665] text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-[#50ad77]/10 cursor-pointer"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
      <div
        className={`fixed bottom-6 right-6 px-4 py-3 bg-slate-900 text-white rounded-2xl text-xs font-medium shadow-xl flex items-center gap-3 transition-all duration-300 z-50 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
          }`}
      >
        <div className="w-6 h-6 rounded-full bg-[#50ad77] flex items-center justify-center text-white text-[10px]">
          ✓
        </div>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
