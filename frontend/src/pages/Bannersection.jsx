import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

const Bannersection = () => {
  const defaultSlides = [
    {
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000",
      tag: "OHC MANAGED SETUPS",
      title: "World-Class Onsite Health Centers",
      description: "Safeguarding your workforce with fully standard-compliant medical setups, qualified staff, and round-the-clock clinical care interventions.",
      ctaText: "Explore OHC Setup",
      link: "/services/completeohcsetup"
    },
    {
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=2000",
      tag: "EMERGENCY CARE 24/7",
      title: "Immediate Medical Emergency Support",
      description: "Instantly deployed emergency Response Systems equipped with advanced lifesaving kits to handle any workplace healthcare crisis.",
      ctaText: "Emergency Support",
      link: "/contact"
    },
    {
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000",
      tag: "CORPORATE CARE PROGRAMS",
      title: "Preventive Corporate Wellness Programs",
      description: "Comprehensive health screenings, expert occupational audiometry, and tailored wellness workshops designed to boost workforce health.",
      ctaText: "View Programs",
      link: "/services"
    }
  ];

  const [slides, setSlides] = useState(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timeoutRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/banner/hero-content`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setSlides(data);
        }
      })
      .catch(err => console.error("Failed to fetch banners:", err));
  }, []);

  useEffect(() => {
    if (isPlaying && slides.length > 0) {
      resetTimeout();
      timeoutRef.current = setTimeout(nextSlide, 6000);
    }
    return () => resetTimeout();
  }, [currentIndex, isPlaying, slides.length]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="relative w-full h-[550px] sm:h-[600px] lg:h-[700px] xl:h-[780px] bg-slate-950 overflow-hidden group select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-slide-progress {
          animation: progress 6000ms linear infinite;
        }
      `}</style>
      <div
        className="flex w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full h-full shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src={slide.image && slide.image.startsWith('http') ? slide.image : `${import.meta.env.VITE_API_BASE_URL || ''}${slide.image}`}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-[6000ms] ease-out"
                style={{ transform: currentIndex === index ? 'scale(1)' : 'scale(1.08)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent sm:hidden" />
            </div>
            <div className="absolute inset-0 z-10 flex items-center">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl space-y-4 sm:space-y-6 text-left">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all duration-700 delay-300 ${currentIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#50ad77] animate-pulse" />
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[2px]">{slide.tag}</p>
                  </div>
                  <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.1] transition-all duration-700 delay-500 ${currentIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
                    {slide.title}
                  </h1>
                  <p className={`text-sm sm:text-lg text-slate-300 font-medium leading-relaxed max-w-xl transition-all duration-700 delay-700 ${currentIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    {slide.description}
                  </p>
                  <div className={`flex flex-wrap items-center gap-4 pt-4 transition-all duration-700 delay-1000 ${currentIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <a
                      href="/contact"
                      className="px-6 py-3 rounded-xl bg-[#50ad77] backdrop-blur-md text-white font-bold text-sm border border-white/20 hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-2"
                    >
                      Quick Consultation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center h-12 w-12 rounded-full border border-white/10 bg-slate-900/30 backdrop-blur-md text-white hover:bg-[#50ad77] hover:border-[#50ad77] transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center h-12 w-12 rounded-full border border-white/10 bg-slate-900/30 backdrop-blur-md text-white hover:bg-[#50ad77] hover:border-[#50ad77] transition-all duration-300 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
      >
        <ChevronRight size={20} />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group relative flex h-3 items-center"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`h-1.5 rounded-full transition-all duration-500 ease-out ${currentIndex === index ? 'w-10 bg-[#50ad77]' : 'w-2 bg-white/40 group-hover:bg-white/70'
              }`}>
              {currentIndex === index && isPlaying && (
                <div className="h-full bg-white rounded-full animate-slide-progress" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Bannersection;