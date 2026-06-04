import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; 
import { ArrowUp } from 'lucide-react'; 

const FloatingButtons = () => {
  return (
    <div className="fixed right-4 bottom-[2%] z-50 flex flex-col gap-4 sm:gap-6">
      <button
        title="WhatsApp Chat"
        onClick={() => window.open("https://wa.me/919940851598", "_blank")}
        className="group flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_12px_rgba(37,211,102,0.3)] transition-all duration-300"
      >
        <FaWhatsapp className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>
      <button
        title="Back To Top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="group flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg transition-all duration-300"
      >
        <ArrowUp className="h-5 w-5 sm:h-7 sm:w-7" />
      </button>
    </div>
  );
};

export default FloatingButtons;