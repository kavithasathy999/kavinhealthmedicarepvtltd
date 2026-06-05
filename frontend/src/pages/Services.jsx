import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import breadcrumbImg from '../../src/assets/breadcrumb-img.jpg';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import { Loader2 } from 'lucide-react';

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }
`;
document.head.appendChild(styleSheet);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Services = () => {
  const { slug } = useParams();
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const createSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

  useEffect(() => {
    const fetchServices = async () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      try {
        const response = await axios.get(`${API_BASE}/api/services`);
        if (response.data.success) {
          const services = response.data.services;
          setServicesData(services);
          if (!slug && services.length > 0) {
            setSelectedServiceId(services[0].id.toString());
          }
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (slug && servicesData.length > 0) {
      const matched = servicesData.find(s => createSlug(s.title) === slug);
      if (matched) setSelectedServiceId(matched.id.toString());
    }
  }, [slug, servicesData]);

  const filteredServices = selectedServiceId
    ? servicesData.filter(s => String(s.id) === String(selectedServiceId))
    : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-x-hidden">
      <Topbar />
      <Header />
      <div className="relative h-40 sm:h-56 md:h-64 lg:h-72 w-full bg-slate-900 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-black/60 z-10 mix-blend-multiply" />
        <img src={breadcrumbImg} alt="Medical Consultation Banner" className="w-full h-full object-cover object-center opacity-80" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="bg-white/10 text-white text-[9px] sm:text-[10px] md:text-xs uppercase font-bold tracking-widest px-2 sm:px-3 py-1 rounded mb-2 animate-fade-in-up">Our Offerings</div>
          <h2 className="text-xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>Our Services</h2>
          <p className="text-slate-300 text-base mt-1 sm:mt-2 max-w-xl font-light animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Link to="/" className="hover:text-white transition-colors duration-300">Home</Link>{" "}/ Services
          </p>
        </div>
      </div>
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="flex flex-col items-center space-y-4 animate-fade-in">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-[#50ad77] animate-spin" />
              <span className="text-slate-500 font-medium tracking-wider uppercase text-xs sm:text-sm">Loading Offerings</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-col sm:gap-5 md:flex-row md:justify-between md:items-center md:gap-6 mb-6 sm:mb-8 lg:mb-10 animate-fade-in-up">
              <div className="flex-1 min-w-0">
                <h2 className="font-extrabold text-[#1a233a] tracking-tight mb-2 sm:mb-3 text-2xl sm:text-3xl lg:text-4xl leading-tight">{filteredServices[0]?.title || ''}</h2>
                <div className="h-1 sm:h-1.5 w-16 sm:w-20 lg:w-24 bg-[#50ad77] rounded-full" />
              </div>
              <div className="w-full flex-shrink-0 sm:w-full md:w-64 lg:w-72">
                <p className="font-semibold uppercase tracking-widest text-gray-700 mb-1.5 text-xs sm:text-sm text-center">Choose Services</p>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm font-semibold cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#50ad77]/50 focus:border-[#50ad77] hover:shadow-md py-2.5 pl-4 pr-9 text-sm sm:text-base" value={selectedServiceId || ''} onChange={(e) => setSelectedServiceId(e.target.value)}>
                    {servicesData.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 sm:px-4 text-gray-500">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {filteredServices.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm sm:text-base animate-fade-in">No services found.</div>
            ) : (
              <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                {filteredServices.map((service, index) => (
                  <div key={service.id} className="animate-fade-in-up bg-white rounded-2xl lg:rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col lg:flex-row border border-slate-100 group" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="w-full lg:w-5/12 min-h-[250px] sm:min-h-[300px] lg:min-h-full relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[#50ad77]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                      <img src={`${API_BASE}/uploads/${service.image}`} alt={service.title} className="absolute inset-0 w-full h-full transform transition-transform duration-700" />
                    </div>
                    <div className="w-full lg:w-7/12 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#50ad77]/10 text-[#50ad77] mb-4 sm:mb-5 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="capitalize font-bold text-gray-900 mb-2 sm:mb-3 text-xl sm:text-2xl lg:text-3xl tracking-tight">
                        {service.title}
                      </h3>
                      <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-gradient-to-r from-[#50ad77] to-emerald-300 rounded-full mb-4 sm:mb-5" />
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
      <FloatingButtons />
      <Footer />
    </div>
  );
};

export default Services;