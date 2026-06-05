import React, { useEffect, useRef } from 'react';
import { Clock3, MapPin } from 'lucide-react';
import { FaInstagram } from "react-icons/fa";

const Topbar = () => {
  const topbarRef = useRef(null);

  useEffect(() => {
    const setTopbarHeight = () => {
      if (!topbarRef.current) return;
      document.documentElement.style.setProperty(
        '--topbar-height',
        `${topbarRef.current.offsetHeight}px`
      );
    };

    setTopbarHeight();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', setTopbarHeight);
      return () => {
        window.removeEventListener('resize', setTopbarHeight);
        document.documentElement.style.removeProperty('--topbar-height');
      };
    }

    const observer = new ResizeObserver(setTopbarHeight);
    observer.observe(topbarRef.current);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--topbar-height');
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const updateChromeVisibility = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;
      if (currentScrollY <= 80) {
        document.documentElement.dataset.siteChrome = 'visible';
      } else if (scrollDifference > 6) {
        document.documentElement.dataset.siteChrome = 'hidden';
      } else if (scrollDifference < -6) {
        document.documentElement.dataset.siteChrome = 'visible';
      }
      lastScrollY = currentScrollY;
      ticking = false;
    };
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateChromeVisibility);
        ticking = true;
      }
    };
    document.documentElement.dataset.siteChrome = 'visible';
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      delete document.documentElement.dataset.siteChrome;
    };
  }, []);

  return (
    <div ref={topbarRef} className="site-topbar fixed left-0 right-0 top-0 z-[60] bg-slate-900 text-[10px] sm:text-[11px] md:text-xs font-medium text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 lg:flex-row lg:px-8">
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-4 gap-y-0.5 sm:gap-y-1 text-center lg:text-left">
          <span className="flex items-center gap-1 sm:gap-1.5">
            <Clock3 size={12} className="text-[#50ad77] shrink-0 sm:w-[13px] sm:h-[13px]" />
            <span>Monday - Saturday</span>
            <strong className="text-white ml-0.5 sm:ml-0">9AM - 9PM</strong>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="flex items-center gap-1 sm:gap-1.5 leading-tight text-center">
            <MapPin size={12} className="text-[#50ad77] shrink-0 sm:w-[13px] sm:h-[13px]" />
            <strong className="text-white hidden sm:inline">Location:</strong>
            <span className="truncate max-w-[280px] sm:max-w-none">Tiruvannamalai, Tamilnadu, India - 606 753</span>
          </span>
        </div>
        <div className="flex flex-row items-center justify-center lg:justify-end gap-3 sm:gap-4 mt-1 lg:mt-0 w-full lg:w-auto">
          <span className="hover:text-white cursor-pointer transition-colors duration-200 hidden sm:inline text-xs">
            Follow us on Instagram
          </span>

          <div className="flex items-center justify-center gap-2.5 sm:gap-3 text-white">
            <a
              href="https://www.instagram.com/kavin_health_groups?igsh=MWhseWw0OWw3dTdwaA=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#50ad77] transition-transform duration-200 flex items-center justify-center bg-slate-800/50 p-1.5 sm:p-2 rounded-md border border-slate-700/50 hover:border-[#50ad77]/50"
              aria-label="Instagram"
            >
              <FaInstagram size={14} className="sm:w-[15px] sm:h-[15px]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
