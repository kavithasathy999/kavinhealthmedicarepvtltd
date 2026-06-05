import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import {
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const footerRef = useRef(null);

  const handleNavigate = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
  };

  const animatedBlockClass = (delayClass) => `
    transition-all duration-1000 ${delayClass} ease-[cubic-bezier(0.16,1,0.3,1)]
    ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
  `;

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#051129] font-sans text-slate-300 antialiased overflow-hidden border-t border-slate-800"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          <div className={`flex flex-col space-y-6 md:col-span-2 lg:col-span-5 xl:col-span-5 ${animatedBlockClass('delay-[100ms]')}`}>
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-white p-1 shadow-md ring-1 ring-slate-200 shrink-0">
                  <img
                    src="/KHMCPL_LOGO.png"
                    alt="Kavin Health Logo"
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
                <div className="leading-tight flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-red-600 leading-none">
                    KAVIN
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-tight text-[#ffffff] leading-none mt-1 sm:mt-1.5 whitespace-nowrap [word-spacing:0.15em] sm:[word-spacing:0.22em]">
                    Health & Medicare Pvt Ltd
                  </p>
                </div>
              </div>
            </Link>
            <p className="text-sm md:text-base lg:text-sm leading-relaxed text-slate-400 w-full">
              We are dedicated to providing flexible & accessible healthcare services. Safeguarding your workforce with standard-compliant on-site setup, medical staffing, and preventive clinical care interventions.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl bg-slate-900/50 p-4 border border-slate-800 w-full lg:max-w-md">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-[#50ad77]/10 text-[#50ad77]">
                <Phone size={20} className="animate-pulse" />
              </div>
              <div className="flex flex-col w-full">
                <p className="text-xs sm:text-sm text-slate-400 font-medium mb-1.5 sm:mb-1">For Booking & Enquiries</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                  <a href="tel:+919940851598" className="text-sm sm:text-base font-bold text-white hover:text-[#50ad77] transition-colors whitespace-nowrap">
                    +91 9940851598
                  </a>
                  <span className="hidden sm:inline-block text-slate-600 text-sm">|</span>
                  <a href="tel:+919080041887" className="text-sm sm:text-base font-bold text-white hover:text-[#50ad77] transition-colors whitespace-nowrap">
                    +91 9080041887
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={`md:col-span-1 lg:col-span-3 xl:col-span-3 lg:pl-6 xl:pl-10 flex flex-col ${animatedBlockClass('delay-[250ms]')}`}>
            <h4 className="text-base font-bold uppercase tracking-wider text-white border-l-2 border-[#50ad77] pl-3">
              Quick Links
            </h4>
            <ul className="mt-6 space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-sm font-semibold">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/aboutus' },
                { label: 'Careers', path: '/career' },
                { label: "Resource Repository", path: '/resourcerepository' },
                { label: 'Blogs', path: '/blogsandarticles' },
                { label: 'Contact', path: '/contact' }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    onClick={handleNavigate}
                    className="group flex items-center text-slate-400 hover:text-[#50ad77] transition-colors duration-200"
                  >
                    <ChevronRight size={16} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2 text-[#50ad77]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={`space-y-6 md:col-span-1 lg:col-span-4 xl:col-span-4 flex flex-col ${animatedBlockClass('delay-[550ms]')}`}>
            <h4 className="text-base font-bold uppercase tracking-wider text-white border-l-2 border-[#50ad77] pl-3">
              Contact Us
            </h4>
            <div className="space-y-5 text-sm sm:text-base lg:text-sm font-medium w-full">
              <div className="flex items-start gap-3.5">
                <MapPin size={20} className="mt-0.5 shrink-0 text-[#50ad77]" />
                <p className="text-slate-400 leading-relaxed w-full">
                  <strong className="text-slate-200 font-semibold block mb-1.5">Registered Office:</strong>
                  No. 76/6, Achuthan Street, Vazhavachanur, Thandarampattu, Tiruvannamalai, Tamilnadu, India - 606 753
                </p>
              </div>
              <div className="flex items-start gap-3.5 border-t border-slate-800/60 pt-4 w-full">
                <Mail size={20} className="mt-0.5 shrink-0 text-[#50ad77]" />
                <div className="flex flex-col space-y-1.5 w-full min-w-0">
                  <a href="mailto:adminoffice@kavinhealthcare.com" className="block text-slate-400 hover:text-[#50ad77] transition-colors break-words">
                    adminoffice@kavinhealthcare.com
                  </a>
                  <a href="mailto:kavingroupsofcompany@gmail.com" className="block text-slate-400 hover:text-[#50ad77] transition-colors break-words">
                    kavingroupsofcompany@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3.5 border-t border-slate-800/60 pt-4 w-full">
                <Clock size={20} className="mt-0.5 shrink-0 text-[#50ad77]" />
                <div className="text-slate-400 space-y-1.5 w-full">
                  <p><span className="text-slate-200 font-semibold">Mon - Sat:</span> 9:00 AM to 6:00 PM</p>
                  <p className="inline-flex items-start sm:items-center gap-2 text-xs sm:text-sm lg:text-xs font-bold text-[#50ad77] bg-[#50ad77]/10 px-2.5 py-1.5 rounded mt-2 break-words">
                    <ShieldCheck size={16} className="shrink-0 mt-0.5 sm:mt-0" />
                    <span>24/7 Medical Support for Deployed Sites</span>
                  </p>
                </div>
              </div>
            </div>            
            <div className="flex items-start gap-3.5 w-full pt-1">
              <a
                href="https://www.instagram.com/kavin_health_groups?igsh=MWhseWw0OWw3dTdwaA=="
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 transition-all duration-300 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <FaInstagram size={20} className="shrink-0 text-[#50ad77]" />
                <span className="text-sm sm:text-base lg:text-sm font-medium text-slate-400 group-hover:text-[#50ad77] transition-colors duration-300">
                  Follow us on Instagram
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#030b1c] border-t border-slate-900 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 sm:flex-row md:px-6 lg:px-8">
          <p className="text-center text-xs font-medium text-slate-500">
            Copyright &copy; 2026 <span className="text-slate-400 font-semibold">Kavin Health & Medicare Pvt Ltd</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
