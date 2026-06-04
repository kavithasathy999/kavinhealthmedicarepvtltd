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
import 'react-toastify/dist/ReactToastify.css';

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
        className="bg-slate-50 font-sans min-h-screen pb-16 sm:pb-20 lg:pb-24 overflow-x-hidden"
      >
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full bg-slate-900 overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/60 z-10 mix-blend-multiply" />
          <img
            src={breadcrumbImg}
            alt="Medical Consultation Banner"
            className="w-full h-full object-cover object-center opacity-80 filter blur-[1px]"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <div className="bg-white/10 text-white text-[10px] sm:text-xs uppercase font-bold tracking-widest px-3 py-1 rounded backdrop-blur-xs mb-2 animate-slide-in-left">
              Feel free to contact us
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight animate-slide-in-right">
              Contact
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light animate-fade-in">
              <Link to="/" className="hover:text-white transition-colors duration-300">
                Home
              </Link>{" "}
              / Contact
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-5 px-4 pt-10 sm:px-6 md:grid-cols-2 lg:grid-cols-[minmax(220px,0.8fr)_minmax(360px,1.2fr)_minmax(300px,1fr)] lg:px-8">
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-100 flex items-start gap-3 sm:gap-4 transition-all duration-300 hover:shadow-md h-full">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1e90ff] flex items-center justify-center shrink-0 shadow-inner">
              <Phone size={18} fill="currentColor" className="text-[#1e90ff]" />
            </div>
            <div className="min-w-0 space-y-1">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Call Us</h5>
              <div className="text-xs font-semibold text-slate-800 space-y-0.5">
                <a href="tel:+919940851598" className="block whitespace-nowrap hover:text-[#1e90ff] transition-colors">+91-9940851598</a>
                <a href="tel:+919080041887" className="block whitespace-nowrap hover:text-[#1e90ff] transition-colors">+91-9080041887</a>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-100 flex items-start gap-3 sm:gap-4 transition-all duration-300 hover:shadow-md h-full">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1e90ff] flex items-center justify-center shrink-0 shadow-inner">
              <Mail size={18} className="text-[#1e90ff]" />
            </div>
            <div className="min-w-0 space-y-1">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Us</h5>
              <div className="space-y-0.5 text-[11px] font-semibold text-slate-800 lg:text-xs">
                <a href="mailto:adminoffice@kavinhealthcare.com" className="block break-all leading-relaxed hover:text-[#1e90ff] transition-colors lg:break-normal lg:whitespace-nowrap">adminoffice@kavinhealthcare.com</a>
                <a href="mailto:kavingroupsofcompany@gmail.com" className="block break-all leading-relaxed hover:text-[#1e90ff] transition-colors lg:break-normal lg:whitespace-nowrap">kavingroupsofcompany@gmail.com</a>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-100 flex items-start gap-3 sm:gap-4 transition-all duration-300 hover:shadow-md h-full md:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1e90ff] flex items-center justify-center shrink-0 shadow-inner">
              <MapPin size={18} className="text-[#1e90ff]" />
            </div>
            <div className="min-w-0 space-y-1">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</h5>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                No. 76/6, Achuthan Street, Vazhavachanur, Thandarampattu, Tiruvannamalai, Tamilnadu, India - 606 753.
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-6 flex max-w-5xl flex-col items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 text-white shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#33b3a6]">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide">Working Availability Matrix</p>
              <p className="text-[11px] text-slate-400 font-light mt-0.5">Monday to Saturday — 9:00 AM to 6:00 PM</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-center gap-1.5 rounded border border-[#33b3a6]/30 bg-[#33b3a6]/10 px-4 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-[#33b3a6] sm:w-auto">
            <Calendar size={12} />
            <span>24/7 Medical Support Enabled For Deployed Sites</span>
          </div>
        </div>
        <div className="relative z-30 mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-4xl rounded-xl border border-slate-100 bg-white p-6 text-center shadow-xs sm:p-8 lg:mb-10">
            <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-neutral-900 uppercase tracking-wide">
              Let's Build a Safer Workplace Together
            </h3>
            <p className="text-slate-900 text-xs sm:text-sm mt-2 font-light">
              For service enquiries, appointments, or partnership opportunities, feel free to reach out to us:
            </p>
          </div>
          <div className="mx-auto mb-12 grid max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5 w-full flex flex-col">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 group overflow-hidden flex flex-col justify-between h-full">
                <div className="overflow-hidden rounded-xl bg-slate-100 relative flex-grow">
                  <img
                    src={img5}
                    alt="Corporate Occupational Health Nurse Specialist"
                    className="w-full h-64 sm:h-72 md:h-80 lg:h-full lg:min-h-[340px] object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute top-3 left-3 bg-[#33b3a6] text-white flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs">
                    <ShieldCheck size={12} />
                    <span>Verified Support</span>
                  </div>
                </div>
                <div className="pt-4 pb-2 px-2 text-center lg:text-left">
                  <h4 className="text-sm font-bold text-neutral-900">National Safety Compliance Standard</h4>
                  <p className="text-xs text-slate-900 font-light mt-1.5 leading-relaxed">
                    Deploying turn-key clinical environments aligned with Factories Act parameters and regional state health protocols.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 w-full">
              <div className="bg-[#1e90ff] rounded-2xl p-6 sm:p-8 shadow-md text-white h-full flex flex-col justify-center">
                <h4 className="text-base sm:text-lg font-bold tracking-wide mb-1">Book An Appointment</h4>
                <p className="text-blue-100 text-xs font-light mb-6">Fill the information matrix below to route data directly to our support desk.</p>
                {status.message && (
                  <div className={`mb-4 p-3 rounded text-xs font-medium flex items-center gap-2 animate-fade-in ${status.type === 'success' ? 'bg-emerald-500 text-white' :
                    status.type === 'error' ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white'
                    }`}>
                    {status.type === 'success' && <ShieldCheck size={14} className="shrink-0" />}
                    {status.type === 'error' && <AlertTriangle size={14} className="shrink-0" />}
                    {status.type === 'info' && <Info size={14} className="shrink-0" />}
                    <span>{status.message}</span>
                  </div>
                )}
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 text-slate-900" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-[11px] font-medium tracking-wide uppercase mb-1.5">Full Name <span className="text-[#ff0000]">*</span></label>
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
                        className={`w-full bg-white rounded-lg px-4 py-3 text-xs focus:outline-none focus:ring-2 font-normal shadow-xs transition-all disabled:opacity-70 ${fieldErrors.name ? 'ring-2 ring-red-400' : 'focus:ring-white/50'}`}
                      />
                      {fieldErrors.name && <p className="text-red-200 text-[10px] mt-1 font-medium">{fieldErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-white text-[11px] font-medium tracking-wide uppercase mb-1.5">Email Address <span className="text-[#ff0000]">*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => {
                          handleInputChange(e);
                          if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        placeholder="Your email"
                        disabled={isSubmitting}
                        className={`w-full bg-white rounded-lg px-4 py-3 text-xs focus:outline-none focus:ring-2 font-normal shadow-xs transition-all disabled:opacity-70 ${fieldErrors.email ? 'ring-2 ring-red-400' : 'focus:ring-white/50'}`}
                      />
                      {fieldErrors.email && <p className="text-red-200 text-[10px] mt-1 font-medium">{fieldErrors.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-[11px] font-medium tracking-wide uppercase mb-1.5">Phone Number <span className="text-[#ff0000]">*</span></label>
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
                          inputProps={{
                            name: 'phone',
                            required: true,
                          }}
                          countryCodeEditable={false}
                          inputClass={`!w-full !bg-white !rounded-lg !py-3 !pl-12 !text-xs !font-normal !shadow-xs !transition-all disabled:!opacity-70 !border-0 ${fieldErrors.phone ? '!ring-2 !ring-red-400' : 'focus:!ring-2 focus:!ring-white/50'}`}
                          buttonClass="!bg-transparent !border-0 !rounded-l-lg hover:!bg-slate-50 transition-colors pl-2"
                          dropdownClass="!text-slate-800 !text-xs"
                          containerClass={`w-full rounded-lg bg-white shadow-xs ${fieldErrors.phone ? 'ring-2 ring-red-400' : ''}`}
                        />
                      </div>
                      {fieldErrors.phone && <p className="text-red-200 text-[10px] mt-1 font-medium">{fieldErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-white text-[11px] font-medium tracking-wide uppercase mb-1.5">Select Segment <span className="text-[#ff0000]">*</span></label>
                      <div className="relative">
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="w-full bg-white rounded-lg px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-white/50 font-normal shadow-xs transition-all appearance-none cursor-pointer text-slate-700 pr-10 disabled:opacity-70"
                        >
                          <option value="OHC Setup & Operations">OHC Setup & Operations</option>
                          <option value="On-Site Doctor / Nursing Staff">On-Site Doctor / Nursing Staff</option>
                          <option value="Statutory Medical Form-XI">Statutory Medical Form-XI</option>
                          <option value="Ambulance Provisioning Deployment">Ambulance Provisioning Deployment</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-[11px] font-medium tracking-wide uppercase mb-1.5">Company Name <span className="text-[#ff0000]">*</span></label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={(e) => {
                          handleInputChange(e);
                          if (fieldErrors.companyName) setFieldErrors((prev) => ({ ...prev, companyName: '' }));
                        }}
                        placeholder="Your Company Name"
                        disabled={isSubmitting}
                        className={`w-full bg-white rounded-lg px-4 py-3 text-xs focus:outline-none focus:ring-2 font-normal shadow-xs transition-all disabled:opacity-70 ${fieldErrors.companyName ? 'ring-2 ring-red-400' : 'focus:ring-white/50'}`}
                      />
                      {fieldErrors.companyName && <p className="text-red-200 text-[10px] mt-1 font-medium">{fieldErrors.companyName}</p>}
                    </div>
                    <div>
                      <label className="block text-white text-[11px] font-medium tracking-wide uppercase mb-1.5">Company Email <span className="text-[#ff0000]">*</span></label>
                      <input
                        type="email"
                        name="companyEmail"
                        value={formData.companyEmail}
                        onChange={(e) => {
                          handleInputChange(e);
                          if (fieldErrors.companyEmail) setFieldErrors((prev) => ({ ...prev, companyEmail: '' }));
                        }}
                        placeholder="company@example.com"
                        disabled={isSubmitting}
                        className={`w-full bg-white rounded-lg px-4 py-3 text-xs focus:outline-none focus:ring-2 font-normal shadow-xs transition-all disabled:opacity-70 ${fieldErrors.companyEmail ? 'ring-2 ring-red-400' : 'focus:ring-white/50'}`}
                      />
                      {fieldErrors.companyEmail && <p className="text-red-200 text-[10px] mt-1 font-medium">{fieldErrors.companyEmail}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-white text-[11px] font-medium tracking-wide uppercase mb-1.5">Your Message <span className="text-[#ff0000]">*</span></label>
                    <textarea
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={(e) => {
                        handleInputChange(e);
                        if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: '' }));
                      }}
                      placeholder="Write your message..."
                      disabled={isSubmitting}
                      className={`w-full bg-white rounded-lg p-4 text-xs focus:outline-none focus:ring-2 font-normal shadow-xs transition-all resize-none disabled:opacity-70 ${fieldErrors.message ? 'ring-2 ring-red-400' : 'focus:ring-white/50'}`}
                    />
                    {fieldErrors.message && <p className="text-red-200 text-[10px] mt-1 font-medium">{fieldErrors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#33b3a6] hover:bg-[#2aa094] text-white text-xs font-bold tracking-wider uppercase px-6 py-3.5 rounded-lg transition-all duration-300 shadow-md transform hover:-translate-y-0.5 cursor-pointer mt-2 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    <Send size={13} />
                    <span>{isSubmitting ? 'Sending...' : 'Make Your Appointment'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="w-full mt-10 mb-6 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 sm:px-5 lg:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">
                    Our Location on Google Maps
                  </h3>
                  <p className="text-[11px] sm:text-xs lg:text-sm text-slate-500 mt-0.5 leading-relaxed">
                    No. 76/6, Achuthan Street, Vazhavachanur, Thandarampattu, Tiruvannamalai, Tamilnadu - 606753
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <a
                    href="https://maps.google.com/?q=No.+76/6,+Achuthan+Street,+Vazhavachanur,+Thandarampattu,+Tiruvannamalai,+Tamilnadu+606753"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e90ff] hover:bg-blue-600 text-white text-[11px] font-semibold transition-colors duration-200 shadow-sm whitespace-nowrap"
                  >
                    <FaLocationDot size={11} />
                    Choose on Maps
                  </a>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=No.+76/6,+Achuthan+Street,+Vazhavachanur,+Thandarampattu,+Tiruvannamalai,+Tamilnadu+606753"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#33b3a6] hover:bg-[#2aa094] text-white text-[11px] font-semibold transition-colors duration-200 shadow-sm whitespace-nowrap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    Get Directions
                  </a>
                </div>
              </div>
              <div className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] lg:h-[420px] overflow-hidden">
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
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#50ad77] text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  <FaLocationDot className="text-white text-xs inline-block mr-1" /> Kavin Healthcare Location
                </div>
              </div>
              <div className="sm:hidden px-4 py-3 border-t border-slate-100 flex gap-2">
                <a
                  href="https://maps.google.com/?q=No.+76/6,+Achuthan+Street,+Vazhavachanur,+Thandarampattu,+Tiruvannamalai,+Tamilnadu+606753"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#1e90ff] hover:bg-blue-600 text-white text-[11px] font-semibold transition-colors duration-200 shadow-sm"
                >
                  <FaLocationDot size={11} />
                  Choose on Maps
                </a>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=No.+76/6,+Achuthan+Street,+Vazhavachanur,+Thandarampattu,+Tiruvannamalai,+Tamilnadu+606753"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#33b3a6] hover:bg-[#2aa094] text-white text-[11px] font-semibold transition-colors duration-200 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
