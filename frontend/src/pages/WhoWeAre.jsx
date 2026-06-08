import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Statssection from '../components/Statssection';
import breadcrumbImg from '../../src/assets/breadcrumb-img.jpg';
import FloatingButtons from '../components/FloatingButtons';
import {
  ShieldCheck,
  Target,
  FileText,
  Award,
  Users,
  Building,
  CheckCircle2,
  HeartHandshake,
  Scale,
  Lightbulb,
  TrendingUp,
  HandHeart
} from 'lucide-react';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Esteemedpmcslider from '../components/Esteemedpmcslider';
import img4 from '../assets/img4.jpeg';

const CounterItem = ({ targetValue, duration = 2000, suffix = "", visible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return undefined;
    let start = 0;
    const increment = targetValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, targetValue, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const WhoWeAre = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const phoneNumber = "919940851598";
  const message = encodeURIComponent("Hi, I am looking for a healthcare consultant.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;


  useEffect(() => {
    const section = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (section) observer.observe(section);
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const values = [
    { icon: Scale, title: "Client-centric", desc: "We prioritise the needs and well-being of patients above all else." },
    { icon: HandHeart, title: "Patient-centered", desc: "We focus on high-quality care, improving patient outcomes, and safety." },
    { icon: Users, title: "Collaboration", desc: "We value collaboration, working closely with all healthcare stakeholders." },
    { icon: Target, title: "Strategy", desc: "Seamlessly visualize long-term plans to guide decisions and actions." },
    { icon: Lightbulb, title: "Innovation", desc: "Striving to develop and implement new technologies and processes." },
    { icon: TrendingUp, title: "Continuous improvement", desc: "Constantly seeking to learn and grow to provide the best services." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#50ad77]/20 selection:text-[#50ad77] overflow-x-hidden">
      <Topbar />
      <Header />
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full bg-slate-900 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-black/60 z-10 mix-blend-multiply" />
        <img
          src={breadcrumbImg}
          alt="Medical Consultation Banner"
          className="w-full h-full object-cover object-center opacity-80 filter blur-[1px]"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="bg-white/10 text-white text-[10px] sm:text-xs uppercase font-bold tracking-widest px-3 py-1 rounded backdrop-blur-xs mb-2 animate-slide-in-left">
            Fast, reliable medical assistance anytime
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight animate-slide-in-right">
            About Us
          </h2>
          <p className="text-slate-300 text-base mt-2 max-w-xl font-light animate-fade-in">
            <Link to="/" className="hover:text-white transition-colors duration-300">
              Home
            </Link>{" "}
            / About Us
          </p>
        </div>
      </div>

      <section
        ref={sectionRef}
        className="relative bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden py-12 md:py-16 lg:py-16"
      >
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#50ad77]/10 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
          <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl mix-blend-multiply" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className={`text-center mx-auto mb-10 sm:mb-12 lg:mb-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
            <div className="inline-flex flex-col items-start text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#50ad77]/10 px-4 py-1.5 text-base font-bold uppercase tracking-wider text-[#50ad77] border border-[#50ad77]/20 mb-4 -ml-4">
                <ShieldCheck size={14} /> Introduction
              </span>
              <h2 className="font-black tracking-tight text-slate-900 sm:text-4xl lg:text-4xl leading-tight inline-flex flex-col items-start">
                <span className="block text-[#e31e25] text-3xl sm:text-4xl lg:text-5xl">KAVIN</span>
                <span className="block text-[#1958a8] text-2xl sm:text-2xl lg:text-2xl">HEALTH & MEDICARE</span>
                <span className="block text-[#50ad77] text-2xl sm:text-2xl lg:text-2xl">PVT LTD</span>
              </h2>
              <div className="mt-5 h-1.5 w-24 bg-gradient-to-r from-[#50ad77] to-blue-600 rounded-full" />
            </div>
            <p className="mt-6 text-base leading-relaxed text-slate-600 font-medium">
              At Kavin Health and Medicare Pvt Ltd, we understand that a healthy workforce is the foundation of a productive and thriving workplace. Our Occupational Health Centre (OHC) is a dedicated wing that offers comprehensive on-site healthcare services to safeguard the well-being of employees and support industries in meeting statutory health compliance.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
            <div className={`relative ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} transition-all duration-1000 delay-200 h-full`}>
              <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-slate-900/10 border-[6px] border-white bg-white group flex items-center justify-center h-full w-full">
                <img
                  src={img4}
                  alt="Occupational Health Centre Ward Setup"
                  className="w-full h-full object-fill transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
            <div className={`space-y-6 pt-4 sm:pt-0 flex flex-col justify-center ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} transition-all duration-1000 delay-200`}>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl lg:text-4xl leading-snug">
                Proactive Clinical Care & Preventive Interventions
              </h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                With a clear focus on prevention, early detection, and effective intervention, our OHC services are designed to reduce workplace-related health risks, improve employee wellness, and help organizations adhere to national safety standards such as the <strong>Factories Act</strong>, <strong>BOCW Act</strong>, and relevant industrial health regulations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { title: 'Statutory Health Compliance', desc: 'Factories & BOCW legal alignment.' },
                  { title: 'Workplace Risk Mitigation', desc: 'Targeted preventive evaluations.' },
                  { title: 'Enhanced Productivity', desc: 'Healthy teams drive business performance.' },
                  { title: 'Expert On-Site Staffing', desc: 'Qualified medical personnel deployed.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/60 transition-all duration-300 transform hover:-translate-y-0.5">
                    <CheckCircle2 size={18} className="text-[#50ad77] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{item.title}</h5>
                      <p className="text-base text-slate-500 font-medium mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden py-2 md:py-16 lg:py-4">
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <Statssection />
        </div>
      </section>

      <section className="relative bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden py-6 md:py-16 lg:py-2">
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <Esteemedpmcslider type="Our Esteemed Clients" title="Our Esteemed Clients" bgClass="bg-transparent" fadeClass="from-slate-50" />
        </div>
      </section>

      <section className="relative bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden py-6 md:py-16 lg:py-8">
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="relative w-full overflow-hidden bg-[#50ad77] rounded-3xl shadow-2xl py-10 md:py-14 px-6 sm:px-10 lg:px-14 text-white select-none transition-all duration-500 hover:shadow-[#50ad77]/20">
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="react-triangles-cta" width="90" height="90" patternUnits="userSpaceOnUse">
                    <path d="M 0 90 L 45 0 L 90 90 Z" fill="none" stroke="white" strokeWidth="1.5" />
                    <path d="M 45 0 L 90 90 L 0 90 Z" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3,3" />
                    <path d="M 10 10 L 30 30 M 15 5 L 35 25" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#react-triangles-cta)" />
                <circle cx="85%" cy="30%" r="200" fill="white" opacity="0.2" filter="blur(50px)" />
                <circle cx="15%" cy="80%" r="130" fill="white" opacity="0.12" filter="blur(40px)" />
              </svg>
            </div>
            <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
              <div className="flex-1 w-full text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <div className="w-12 h-[3px] bg-white rounded-full hidden sm:block"></div>
                  <span className="text-base font-bold tracking-wider uppercase text-white/95 font-sans drop-shadow-sm">
                    Get Solutions Fast
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black leading-tight tracking-tight text-white font-sans drop-shadow-md">
                  Looking for Expert Healthcare Consulting Support?
                </h2>
                <p className="text-white/90 text-base mt-4 max-w-xl mx-auto md:mx-0 leading-relaxed font-medium">
                  Connect with our experienced consultants to discuss your hospital project, operational challenges, or expansion plans. We provide practical guidance and structured solutions to help healthcare organizations succeed.
                </p>
              </div>
              <div className="relative z-10 shrink-0 w-full md:w-auto flex justify-center md:justify-end mt-2 md:mt-0">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:scale-98 text-[#50ad77] font-bold px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 text-sm md:text-base w-full sm:w-auto border border-white/20"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.004 2c-5.517 0-9.996 4.48-9.996 9.997 0 2.01.597 3.886 1.624 5.462l-1.63 4.87 5.01-1.317a9.92 9.92 0 0 0 4.992 1.34c5.517 0 9.996-4.48 9.996-9.997S17.52 2 12.004 2zm5.548 14.11c-.218.614-1.253 1.12-1.734 1.194-.438.067-1.002.123-2.91-.667-2.44-.997-4.012-3.468-4.133-3.63-.122-.161-.989-1.317-.989-2.51 0-1.19.626-1.776.849-2.015.223-.239.49-.297.653-.297.163 0 .326.002.468.008.147.008.343-.03.537.438.2.482.684 1.667.744 1.79.06.122.1.264.017.43-.084.167-.124.262-.248.406-.124.143-.26.318-.372.427-.123.12-.253.25-.109.495.144.242.64 1.06 1.373 1.713.945.843 1.74 1.103 1.986.915.247-.188.487-.453.73-.733.242-.28.41-.35.632-.266.223.085 1.41.663 1.65.782.24.118.4.177.458.277.058.1.058.553-.16 1.168z" />
                  </svg>
                  <span className="text-base tracking-wide">Whatsapp Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden py-12 md:py-8 lg:py-8">
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-10 max-w-3xl mx-auto text-center"
          >
            <h3 className="text-[#50ad77] font-semibold uppercase tracking-widest text-xs sm:text-sm mb-2">More than just business</h3>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-slate-900">What do we <span className='text-[#50ad77]'>Stand for?</span></h2>
            <p className="text-slate-600 text-base leading-relaxed mx-auto">
              Our core values, beliefs, and principles that guide our actions and decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: idx * 0.08, duration: 0.45 }}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 sm:p-6 min-h-[150px]"
              >
                <div className="h-12 w-12 rounded-xl bg-[#50ad77]/10 text-[#50ad77] flex items-center justify-center shrink-0">
                  <val.icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg sm:text-xl font-bold mb-2 leading-snug text-slate-900">{val.title}</h4>
                  <p className="text-slate-600 text-base leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden py-6 md:py-16 lg:py-14">
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100/80 flex flex-col h-full hover:shadow-2xl hover:border-slate-200/50 transition-all duration-500 transform hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} transition-all duration-1000 delay-[400ms]`}>
              <div className="h-12 w-12 rounded-xl bg-[#50ad77]/10 text-[#50ad77] flex items-center justify-center mb-6 shadow-inner">
                <Target size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-3 mb-4">
                OHC - Goals
              </h4>
              <ul className="space-y-3.5 text-base font-medium text-slate-600 flex-1">
                {[
                  'To protect and promote the overall health and well-being of all workers.',
                  'To ensure full compliance with BOCW Act, Factories Act and related rules.',
                  'To provide prompt first aid and emergency care for all workplace injuries and illnesses.',
                  'To conduct regular medical examinations and health surveillance for workers.',
                  'To maintain accurate medical and statutory records for audits and inspections.',
                  'To support clients in identifying and reducing occupational health and safety risks.',
                  'To deliver health, safety and first-aid training to workers and supervisors.'
                ].map((goal, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#50ad77] mt-2 shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100/80 flex flex-col h-full hover:shadow-2xl hover:border-slate-200/50 transition-all duration-500 transform hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} transition-all duration-1000 delay-[550ms]`}>
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-6 shadow-inner">
                <FileText size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-3 mb-4">
                OHC - Policy
              </h4>
              <div className="text-base font-medium text-slate-600 leading-relaxed space-y-4 flex-1">
                <p className="text-base">
                  This Occupational Health Centre (OHC) Policy of Kavin Health and Medicare Private Limited affirms a strong commitment to comply with the BOCW Act, the Factories Act, and relevant State occupational safety and health rules for all construction and factory sites served.
                </p>
                <p className="text-base">
                  It ensures that each OHC is adequately designed, equipped, and staffed with qualified medical professionals to provide first aid, emergency care, statutory medical examinations, and health surveillance for workers.
                </p>
                <p className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-base text-slate-500 leading-relaxed shadow-inner">
                  The policy emphasizes maintenance of proper medical and statutory records, coordination with client management, tie-up hospitals, and delivery of regular training.
                </p>
              </div>
            </div>
            <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100/80 flex flex-col h-full hover:shadow-2xl hover:border-slate-200/50 transition-all duration-500 transform hover:-translate-y-1 md:col-span-2 lg:col-span-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} transition-all duration-1000 delay-[700ms]`}>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6 shadow-inner">
                <Award size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-3 mb-4">
                OHC - Objectives
              </h4>
              <div className="space-y-6 flex-1">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2.5 flex items-center gap-1.5">
                    <Users size={12} /> Core Targets
                  </h5>
                  <ul className="space-y-2.5 text-base font-medium text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 text-base mt-0.5 font-bold">1.</span>
                      <span className="text-base">Deliver immediate first aid, stabilization, and emergency referrals at factory setups.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 text-base mt-0.5 font-bold">2.</span>
                      <span className="text-base">Maintain full regulatory compliance under legal frameworks.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 text-base mt-0.5 font-bold">3.</span>
                      <span className="text-base">Conduct strategic health surveillance to prevent occupational illness hazards.</span>
                    </li>
                  </ul>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#50ad77] mb-2.5 flex items-center gap-1.5">
                    <HeartHandshake size={12} /> Operations
                  </h5>
                  <ul className="space-y-2.5 text-base font-medium text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#50ad77] text-base mt-0.5 font-bold">1.</span>
                      <span className="text-base">Equip and staff OHCs with qualified personnel and seamless medical supply pipelines.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#50ad77] text-base mt-0.5 font-bold">2.</span>
                      <span className="text-base">Coordinate efficiently with tie-up hospitals for quick, high-level injury responses.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#50ad77] text-base mt-0.5 font-bold">3.</span>
                      <span className="text-base">Provide proactive training to build safety awareness across operations.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FloatingButtons />
      <Footer />
    </div>
  );
};

export default WhoWeAre;
