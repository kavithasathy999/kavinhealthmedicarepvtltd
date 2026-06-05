import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  ChevronDown
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Header = ({ services: propServices }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownLocked, setIsDropdownLocked] = useState(false);
  const [fetchedServices, setFetchedServices] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const headerRef = React.useRef(null);
  const desktopDropdownRef = React.useRef(null);
  const tabletDropdownRef = React.useRef(null);

  React.useEffect(() => {
    const setHeaderHeight = () => {
      if (!headerRef.current) return;
      document.documentElement.style.setProperty(
        '--header-height',
        `${headerRef.current.offsetHeight}px`
      );
    };
    setHeaderHeight();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', setHeaderHeight);
      return () => {
        window.removeEventListener('resize', setHeaderHeight);
        document.documentElement.style.removeProperty('--header-height');
      };
    }
    const observer = new ResizeObserver(setHeaderHeight);
    observer.observe(headerRef.current);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--header-height');
    };
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target) &&
        tabletDropdownRef.current && !tabletDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownLocked(false);
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/services`);
        const data = await response.json();
        if (data.success && data.services && data.services.length > 0) {
          setFetchedServices(data.services.map(s => s.title));
        }
      } catch (error) {
        console.error('Error fetching services for header:', error);
      }
    };
    fetchServices();
  }, []);

  const serviceItems = propServices?.length > 0 ? propServices : fetchedServices;

  const isActive = (path) => {
    const currentPath =
      location.pathname.length > 1
        ? location.pathname.replace(/\/+$/, "")
        : location.pathname;

    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const normalizePath = (path) =>
    path.length > 1 ? path.replace(/\/+$/, "") : path;

  const isServiceActive = (path) =>
    normalizePath(location.pathname) === normalizePath(path);

  const createSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      ref={headerRef}
      className="site-header fixed left-0 right-0 z-50 border-b border-slate-100 bg-white shadow-sm"
      style={{ top: 'var(--topbar-height, 0px)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 md:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2" onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <img
            src="/KHMCPL_LOGO.png"
            className="h-9 w-9 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-lg object-cover flex-shrink-0"
            alt="Kavin Health Logo"
          />
          <div className="leading-tight">
            <h1 className="text-base sm:text-xl lg:text-2xl font-black text-red-600 tracking-tight leading-none">
              KAVIN
            </h1>
            <p className="text-[7.5px] sm:text-[9px] lg:text-[10px] text-[#000000] font-black tracking-tight uppercase leading-none mt-0.5 whitespace-normal sm:whitespace-nowrap max-w-[120px] sm:max-w-none [word-spacing:0.1em] sm:[word-spacing:0.22em]">
              Health & Medicare Pvt Ltd
            </p>
          </div>
        </Link>

        {/* ========================================================================= */}
        {/* 2. LAPTOP / DESKTOP NAVIGATION (xl screen size >= 1280px)                  */}
        {/* ========================================================================= */}
        <nav className="hidden xl:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link to="/" onClick={handleNavClick} className={isActive("/") ? "text-[#50ad77]" : "text-slate-600 hover:text-[#50ad77] transition-colors"}>Home</Link>
          <Link to="/aboutus" onClick={handleNavClick} className={isActive("/aboutus") ? "text-[#50ad77]" : "text-slate-600 hover:text-[#50ad77] transition-colors"}>About Us</Link>
          <Link to="/career" onClick={handleNavClick} className={isActive("/career") ? "text-[#50ad77]" : "text-slate-600 hover:text-[#50ad77] transition-colors"}>Careers</Link>
          <div
            ref={desktopDropdownRef}
            className="relative py-2"
            onMouseEnter={() => !isDropdownLocked && setIsDropdownOpen(true)}
            onMouseLeave={() => !isDropdownLocked && setIsDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsDropdownLocked(!isDropdownLocked);
                setIsDropdownOpen(!isDropdownLocked);
              }}
              className={isActive("/services") ? "flex items-center gap-1 text-[#50ad77] transition-colors outline-none" : "flex items-center gap-1 text-slate-600 hover:text-[#50ad77] transition-colors outline-none"}
            >
              <span>Services</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${(isDropdownOpen || isDropdownLocked) ? "rotate-180" : ""} ${isActive("/services") ? "text-[#50ad77]" : "text-slate-400"}`} />
            </button>

            {(isDropdownOpen || isDropdownLocked) && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-[600px] rounded-xl border border-slate-100 bg-white p-4 shadow-xl z-50">
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {serviceItems.map((item, i) => {
                    const path =
                      item === "Our Services"
                        ? "/services/ourservices"
                        : `/services/${createSlug(item)}`;
                    return (
                      <Link
                        to={path}
                        key={i}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsDropdownLocked(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`text-xs p-2.5 rounded-lg cursor-pointer transition-colors duration-150 flex items-center gap-2 ${isServiceActive(path)
                          ? "bg-[#50ad77]/10 text-[#50ad77]"
                          : "text-slate-700 hover:bg-[#50ad77]/10 hover:text-[#50ad77]"
                          }`}
                      >
                        <span className="w-1 h-1 rounded-full bg-[#50ad77]/50 shrink-0"></span>
                        <span className="truncate">{item}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <Link to="/resourcerepository" onClick={handleNavClick} className={isActive("/resourcerepository") ? "text-[#50ad77]" : "text-slate-600 hover:text-[#50ad77] transition-colors"}>Resource Repository</Link>
          <Link to="/blogsandarticles" onClick={handleNavClick} className={isActive("/blogsandarticles") ? "text-[#50ad77]" : "text-slate-600 hover:text-[#50ad77] transition-colors"}>Blogs</Link>
          <Link to="/contact" onClick={handleNavClick} className={isActive("/contact") ? "text-[#50ad77]" : "text-slate-600 hover:text-[#50ad77] transition-colors"}>Contact</Link>
        </nav>


        {/* Tablet nav removed to prevent overlap, Hamburger used instead */}

        {/* ========================================================================= */}
        {/* 4. DESKTOP CALL-TO-ACTION BUTTON (Hidden on Mobile & Tablet < 1280px)      */}
        {/* ========================================================================= */}
        <div className="hidden xl:flex items-center">
          <a
            href="tel:+919940851598"
            className="flex items-center gap-1.5 lg:gap-2 bg-[#50ad77] text-white px-2.5 py-1.5 lg:px-4 lg:py-2.5 rounded-lg text-[11px] lg:text-sm font-bold shadow-sm hover:bg-[#439665] transition-all"
          >
            <Phone size={14} className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden lg:inline">Call Us:</span> +91 9940851598
          </a>
        </div>
        <button
          className="xl:hidden p-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 6. MOBILE & TABLET NAVIGATION PANEL (Only visible on screens < 1280px)    */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3 shadow-inner max-h-[80vh] overflow-y-auto">
          <Link
            to="/"
            className={isActive("/") ? "block font-semibold text-[#50ad77] px-2 py-1" : "block font-semibold text-slate-700 px-2 py-1 hover:text-[#50ad77]"}
            onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Home
          </Link>

          <Link
            to="/aboutus"
            className={isActive("/aboutus") ? "block font-semibold text-[#50ad77] px-2 py-1" : "block font-semibold text-slate-700 px-2 py-1 hover:text-[#50ad77]"}
            onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            About Us
          </Link>

          <Link
            to="/career"
            className={isActive("/career") ? "block font-semibold text-[#50ad77] px-2 py-1" : "block font-semibold text-slate-700 px-2 py-1 hover:text-[#50ad77]"}
            onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Careers
          </Link>

          <div className="border-b border-slate-50 pb-2">
            <button
              onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
              className={`flex items-center justify-between w-full font-semibold px-2 py-1 outline-none ${isActive("/services")
                ? "text-[#50ad77]"
                : "text-slate-700"
                }`}
            >
              <span>Services</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isMobileServicesOpen ? "rotate-180" : ""} ${isActive("/services")
                ? "text-[#50ad77]"
                : "text-slate-400"
                }`} />
            </button>

            {isMobileServicesOpen && (
              <div className="mt-2 ml-2 pl-2 border-l-2 border-slate-100 space-y-1 bg-slate-50/50 rounded-r-lg py-1">
                {serviceItems.map((item, i) => {
                  const path =
                    item === "Our Services"
                      ? "/services/ourservices"
                      : `/services/${createSlug(item)}`;
                  return (
                    <Link
                      to={path}
                      key={i}
                      className={`text-xs py-2.5 px-2 rounded-md flex items-center gap-2 transition-all ${isServiceActive(path)
                        ? "bg-[#50ad77]/10 text-[#50ad77]"
                        : "text-slate-600 hover:text-[#50ad77] hover:bg-[#50ad77]/5"
                        }`}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMobileServicesOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <span className="text-[#50ad77] font-bold text-[10px]">➢</span>
                      <span className={`font-medium ${isServiceActive(path) ? "text-[#50ad77]" : "text-slate-700"}`}>{item}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            to="/resourcerepository"
            className={isActive("/resourcerepository") ? "block font-semibold text-[#50ad77] px-2 py-1" : "block font-semibold text-slate-700 px-2 py-1 hover:text-[#50ad77]"}
            onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Resource Repository
          </Link>

          <Link
            to="/blogsandarticles"
            className={isActive("/blogsandarticles") ? "block font-semibold text-[#50ad77] px-2 py-1" : "block font-semibold text-slate-700 px-2 py-1 hover:text-[#50ad77]"}
            onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Blogs
          </Link>

          <Link
            to="/contact"
            className={isActive("/contact") ? "block font-semibold text-[#50ad77] px-2 py-1" : "block font-semibold text-slate-700 px-2 py-1 hover:text-[#50ad77]"}
            onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Contact
          </Link>
          <div className="pt-2">
            <a
              href="tel:+919940851598"
              className="flex items-center justify-center gap-2 bg-[#50ad77] text-white py-3 rounded-lg font-bold text-sm shadow-sm active:bg-[#439665]"
            >
              <Phone size={16} />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
