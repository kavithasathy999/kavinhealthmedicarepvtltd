import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import breadcrumbImg from '../../src/assets/breadcrumb-img.jpg';
import Footer from '../components/Footer';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import FloatingButtons from '../components/FloatingButtons';
import {
  Phone,
  MapPin,
  Mail,
  Clock,
  Send,
  ShieldCheck,
  Calendar,
  Info,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { FaLocationDot } from "react-icons/fa6";
import PhoneInputPkg from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';
import img5 from '../assets/img5.jpeg';
import { toast, ToastContainer } from 'react-toastify';

const PhoneInput = PhoneInputPkg.default || PhoneInputPkg;
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    companyEmail: '',
    department: 'OHC Setup & Operations',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentDialCode, setCurrentDialCode] = useState('91');
  const [phoneKey, setPhoneKey] = useState(0);

  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setFieldErrors({});
        setStatus({ type: '', message: '' });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'name' || name === 'companyName') && /[^a-zA-Z\s]/.test(value)) {
      return;
    }
    if (name === 'phone' && /[^0-9]/.test(value)) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else {
      const phoneWithPlus = formData.phone.startsWith('+') ? formData.phone : `+${formData.phone}`;
      if (!isValidPhoneNumber(phoneWithPlus)) {
        errors.phone = "Enter a valid mobile number for the selected country.";
      }
    }
    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required.";
    } else if (formData.companyName.trim().length < 2) {
      errors.companyName = "Company name must be at least 2 characters.";
    }
    if (!formData.companyEmail.trim()) {
      errors.companyEmail = "Company email is required.";
    } else if (!emailRegex.test(formData.companyEmail.trim())) {
      errors.companyEmail = "Enter a valid company email address.";
    }
    if (!formData.message.trim()) {
      errors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters.";
    }
    return errors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);
    setStatus({
      type: 'info',
      message: 'Processing your request...'
    });
    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Inquiry submitted successfully!');
        setStatus({
          type: 'success',
          message:
            'Thank you! Your workplace health inquiry has been submitted successfully.'
        });
        setPhoneKey(prev => prev + 1);
        setFormData({
          name: '',
          email: '',
          phone: currentDialCode,
          companyName: '',
          companyEmail: '',
          department: 'OHC Setup & Operations',
          message: ''
        });
        setFieldErrors({});
      } else {
        const errorMessage = data.message || 'Server error. Please verify your form data.';
        toast.error(errorMessage);
        setStatus({
          type: 'error',
          message: errorMessage
        });
      }
    } catch (error) {
      toast.error('Network error. Could not connect to the backend server.');
      setStatus({
        type: 'error',
        message:
          'Network error. Could not connect to the backend server.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#50ad77]/20 selection:text-[#50ad77] overflow-x-hidden">
      <Topbar />
      <Header />
      <section
        id="contact"
        className="bg-slate-50 font-sans min-h-screen pb-5 sm:pb-20 lg:pb-24 overflow-x-hidden"
      >
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full bg-slate-900 overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/60 z-10 mix-blend-multiply" />
          <img
            src={breadcrumbImg}
            alt="Medical Consultation Banner"
            className="w-full h-full object-cover object-center opacity-80 filter blur-[1px]"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <div className="bg-white/10 text-white text-xs uppercase font-bold tracking-widest px-3 py-1 rounded backdrop-blur-xs mb-3 animate-slide-in-left">
              Feel free to contact us
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight animate-slide-in-right">
              Contact
            </h2>
            <p className="text-slate-300 text-sm mt-3 max-w-xl font-medium animate-fade-in">
              <Link to="/" className="hover:text-white transition-colors duration-300">
                Home
              </Link>{" "}
              <span className="mx-2">/</span> Contact
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-6 px-4 pt-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-xl hover:border-[#50ad77]/30 group h-full">
            <div className="w-14 h-14 rounded-full bg-[#50ad77]/10 text-[#50ad77] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-[#50ad77] group-hover:text-white transition-all duration-300">
              <Phone size={24} fill="currentColor" />
            </div>
            <div className="space-y-2">
              <h5 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Call Us</h5>
              <div className="text-base font-bold text-slate-900 flex flex-col gap-1">
                <a href="tel:+919940851598" className="hover:text-[#50ad77] transition-colors">+91-9940851598</a>
                <a href="tel:+919080041887" className="hover:text-[#50ad77] transition-colors">+91-9080041887</a>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-xl hover:border-[#50ad77]/30 group h-full">
            <div className="w-14 h-14 rounded-full bg-[#50ad77]/10 text-[#50ad77] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-[#50ad77] group-hover:text-white transition-all duration-300">
              <Mail size={24} />
            </div>
            <div className="space-y-2">
              <h5 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Email Us</h5>
              <div className="text-sm font-bold text-slate-900 flex flex-col gap-1">
                <a href="mailto:adminoffice@kavinhealthcare.com" className="hover:text-[#50ad77] transition-colors truncate w-full">adminoffice@kavinhealthcare.com</a>
                <a href="mailto:kavingroupsofcompany@gmail.com" className="hover:text-[#50ad77] transition-colors truncate w-full">kavingroupsofcompany@gmail.com</a>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-xl hover:border-[#50ad77]/30 group h-full md:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 rounded-full bg-[#50ad77]/10 text-[#50ad77] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-[#50ad77] group-hover:text-white transition-all duration-300">
              <MapPin size={24} />
            </div>
            <div className="space-y-2">
              <h5 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Location</h5>
              <p className="text-sm font-bold text-slate-900 leading-relaxed max-w-[280px]">
                No. 76/6, Achuthan Street, Vazhavachanur, Thandarampattu, Tiruvannamalai, Tamilnadu, India - 606 753.
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-white shadow-xl sm:flex-row">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-full bg-[#50ad77]/20 flex items-center justify-center text-[#50ad77]">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide uppercase">Working Availability Matrix</p>
              <p className="text-sm text-slate-400 font-medium mt-1">Monday to Saturday — 9:00 AM to 6:00 PM</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#50ad77]/40 bg-[#50ad77]/15 px-5 py-2.5 text-center text-xs font-bold uppercase tracking-widest text-[#50ad77] sm:w-auto">
            <Calendar size={16} />
            <span>24/7 Medical Support Enabled</span>
          </div>
        </div>
        <div className="relative z-30 mx-auto max-w-7xl px-4 pt-16 sm:pt-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight">
              Let's Build a Safer <br className="hidden sm:block" />Workplace Together
            </h3>
            <p className="text-slate-600 text-sm sm:text-base mt-4 font-medium max-w-2xl mx-auto">
              For service enquiries, appointments, or partnership opportunities, feel free to reach out to us using the form below.
            </p>
          </div>
          <div className="mx-auto mb-16 grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5 w-full flex flex-col">
              <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-100 group overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-500">
                <div className="overflow-hidden rounded-2xl relative w-full">
                  <img
                    src={img5}
                    alt="Corporate Occupational Health Nurse Specialist"
                    className="w-full h-auto object-cover transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-[#50ad77] text-white flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">
                    <ShieldCheck size={14} />
                    <span>Verified Support</span>
                  </div>
                </div>
                <div className="pt-6 pb-4 px-4 text-center lg:text-left">
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">National Safety Compliance Standard</h4>
                  <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                    Deploying turn-key clinical environments aligned with Factories Act parameters and regional state health protocols.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 w-full h-full">
              <div className="bg-[#50ad77] rounded-3xl p-8 sm:p-10 shadow-2xl h-full flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <defs>
                      <pattern id="contact-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="2" fill="white" />
                        <circle cx="30" cy="30" r="2" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#contact-pattern)" />
                    <circle cx="85%" cy="20%" r="200" fill="white" opacity="0.2" filter="blur(40px)" />
                    <circle cx="15%" cy="80%" r="150" fill="white" opacity="0.1" filter="blur(30px)" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">Book An Appointment</h4>
                  <p className="text-white/90 text-sm font-medium mb-8">Fill the information matrix below to route data directly to our support desk.</p>
                  {status.message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-fade-in ${status.type === 'success' ? 'bg-emerald-600/50 text-white border border-emerald-400' :
                      status.type === 'error' ? 'bg-rose-500 text-white border border-rose-400' : 'bg-blue-500/50 text-white border border-blue-400'
                      }`}>
                      {status.type === 'success' && <ShieldCheck size={18} className="shrink-0" />}
                      {status.type === 'error' && <AlertTriangle size={18} className="shrink-0" />}
                      {status.type === 'info' && <Info size={18} className="shrink-0" />}
                      <span>{status.message}</span>
                    </div>
                  )}
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-white text-xs font-bold tracking-wide uppercase mb-1.5">Full Name <span className="text-[#ff0020]">*</span></label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={(e) => {
                            handleInputChange(e);
                            if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                          }}
                          placeholder="Your Name"
                          disabled={isSubmitting}
                          className={`w-full bg-white border-0 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all disabled:opacity-70 ${fieldErrors.name ? 'ring-4 ring-rose-400' : 'focus:ring-white/40 shadow-inner'}`}
                        />
                        {fieldErrors.name && <p className="text-rose-200 text-xs mt-1.5 font-bold">{fieldErrors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-white text-xs font-bold tracking-wide uppercase mb-1.5">Email Address <span className="text-[#ff0020]">*</span></label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => {
                            handleInputChange(e);
                            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                          }}
                          placeholder="your@email.com"
                          disabled={isSubmitting}
                          className={`w-full bg-white border-0 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all disabled:opacity-70 ${fieldErrors.email ? 'ring-4 ring-rose-400' : 'focus:ring-white/40 shadow-inner'}`}
                        />
                        {fieldErrors.email && <p className="text-rose-200 text-xs mt-1.5 font-bold">{fieldErrors.email}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-white text-xs font-bold tracking-wide uppercase mb-1.5">Phone Number <span className="text-[#ff0020]">*</span></label>
                        <div className="relative">
                          <PhoneInput
                            key={phoneKey}
                            country={'in'}
                            value={formData.phone}
                            onChange={(phone, country) => {
                              setFormData((prev) => ({ ...prev, phone }));
                              if (country && country.dialCode) {
                                setCurrentDialCode(country.dialCode);
                              }
                              if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: '' }));
                            }}
                            disabled={isSubmitting}
                            inputProps={{ name: 'phone', required: true }}
                            countryCodeEditable={false}
                            inputClass={`!w-full !bg-white !border-0 !rounded-xl !py-3.5 !pl-12 !text-sm !text-slate-900 focus:!outline-none focus:!ring-4 !transition-all disabled:!opacity-70 ${fieldErrors.phone ? '!ring-4 !ring-rose-400' : 'focus:!ring-white/40 !shadow-inner'}`}
                            buttonClass="!bg-transparent !border-0 !rounded-l-xl hover:!bg-slate-100 transition-colors pl-3"
                            dropdownClass="!text-slate-800 !text-sm !rounded-xl !shadow-xl"
                            containerClass={`w-full rounded-xl`}
                          />
                        </div>
                        {fieldErrors.phone && <p className="text-rose-200 text-xs mt-1.5 font-bold">{fieldErrors.phone}</p>}
                      </div>
                      <div>
                        <label className="block text-white text-xs font-bold tracking-wide uppercase mb-1.5">Select Segment <span className="text-[#ff0020]">*</span></label>
                        <div className="relative">
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-full bg-white border-0 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-white/40 transition-all appearance-none cursor-pointer pr-10 disabled:opacity-70 font-medium shadow-inner"
                          >
                            <option value="OHC Setup & Operations">OHC Setup & Operations</option>
                            <option value="On-Site Doctor / Nursing Staff">On-Site Doctor / Nursing Staff</option>
                            <option value="Statutory Medical Form-XI">Statutory Medical Form-XI</option>
                            <option value="Ambulance Provisioning Deployment">Ambulance Provisioning</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                            <ChevronDown size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-white text-xs font-bold tracking-wide uppercase mb-1.5">Company Name <span className="text-[#ff0020]">*</span></label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={(e) => {
                            handleInputChange(e);
                            if (fieldErrors.companyName) setFieldErrors((prev) => ({ ...prev, companyName: '' }));
                          }}
                          placeholder="Company Ltd"
                          disabled={isSubmitting}
                          className={`w-full bg-white border-0 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all disabled:opacity-70 ${fieldErrors.companyName ? 'ring-4 ring-rose-400' : 'focus:ring-white/40 shadow-inner'}`}
                        />
                        {fieldErrors.companyName && <p className="text-rose-200 text-xs mt-1.5 font-bold">{fieldErrors.companyName}</p>}
                      </div>
                      <div>
                        <label className="block text-white text-xs font-bold tracking-wide uppercase mb-1.5">Company Email <span className="text-[#ff0020]">*</span></label>
                        <input
                          type="email"
                          name="companyEmail"
                          value={formData.companyEmail}
                          onChange={(e) => {
                            handleInputChange(e);
                            if (fieldErrors.companyEmail) setFieldErrors((prev) => ({ ...prev, companyEmail: '' }));
                          }}
                          placeholder="contact@company.com"
                          disabled={isSubmitting}
                          className={`w-full bg-white border-0 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all disabled:opacity-70 ${fieldErrors.companyEmail ? 'ring-4 ring-rose-400' : 'focus:ring-white/40 shadow-inner'}`}
                        />
                        {fieldErrors.companyEmail && <p className="text-rose-200 text-xs mt-1.5 font-bold">{fieldErrors.companyEmail}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-white text-xs font-bold tracking-wide uppercase mb-1.5">Your Message <span className="text-[#ff0020]">*</span></label>
                      <textarea
                        rows="4"
                        name="message"
                        value={formData.message}
                        onChange={(e) => {
                          handleInputChange(e);
                          if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: '' }));
                        }}
                        placeholder="Tell us about your requirements..."
                        disabled={isSubmitting}
                        className={`w-full bg-white border-0 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all resize-none disabled:opacity-70 ${fieldErrors.message ? 'ring-4 ring-rose-400' : 'focus:ring-white/40 shadow-inner'}`}
                      />
                      {fieldErrors.message && <p className="text-rose-200 text-xs mt-1.5 font-bold">{fieldErrors.message}</p>}
                    </div>
                    <div className="flex justify-center mt-6">
                      <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 bg-white hover:bg-slate-50 active:scale-[0.98] text-[#50ad77] text-xs sm:text-sm lg:text-base font-extrabold tracking-wide sm:tracking-widest uppercase px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg sm:shadow-xl hover:shadow-2xl cursor-pointer disabled:opacity-50 disabled:active:scale-100">
                        <Send size={16} className="w-4 h-4 sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5" />
                        <span>
                          {isSubmitting ? "Sending Request..." : "Make Your Appointment"}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-12 mb-8">
            <div className="mx-auto max-w-6xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    Our Location on Google Maps
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    No. 76/6, Achuthan Street, Vazhavachanur, Thandarampattu, Tiruvannamalai, Tamilnadu - 606753
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  <a
                    href="https://maps.google.com/?q=No.+76/6,+Achuthan+Street,+Vazhavachanur,+Thandarampattu,+Tiruvannamalai,+Tamilnadu+606753"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors duration-200"
                  >
                    <FaLocationDot size={14} className="text-[#50ad77]" />
                    Choose on Maps
                  </a>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=No.+76/6,+Achuthan+Street,+Vazhavachanur,+Thandarampattu,+Tiruvannamalai,+Tamilnadu+606753"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#50ad77] hover:bg-[#459667] text-white text-xs font-bold uppercase tracking-wider transition-colors duration-200 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    Get Directions
                  </a>
                </div>
              </div>
              <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[480px] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[calc(100%+50px)]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.562154519441!2d78.98536312453375!3d12.073617883930357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bac97b055555555%3A0xd3f05f0667cec249!2sGovernment%20Agricultural%20College%20and%20Research%20Institute%2C%20Vazhavachanur!5e0!3m2!1sen!2sin!4v1779271808539!5m2!1sen!2sin"
                    title="Kavin Health Location"
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur border border-slate-100 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                  <FaLocationDot className="text-[#50ad77]" size={14} /> Kavin Healthcare Location
                </div>
              </div>
              <div className="sm:hidden px-4 py-4 border-t border-slate-100 flex flex-col gap-3">
                <a
                  href="https://maps.google.com/?q=No.+76/6,+Achuthan+Street,+Vazhavachanur,+Thandarampattu,+Tiruvannamalai,+Tamilnadu+606753"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors duration-200"
                >
                  <FaLocationDot size={14} className="text-[#50ad77]" />
                  Choose on Maps
                </a>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=No.+76/6,+Achuthan+Street,+Vazhavachanur,+Thandarampattu,+Tiruvannamalai,+Tamilnadu+606753"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#50ad77] hover:bg-[#459667] text-white text-xs font-bold uppercase tracking-wider transition-colors duration-200 shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FloatingButtons />
      <Footer />
      <ToastContainer position="top-right" autoClose={1500} />
    </div >
  );
};

export default Contact;
