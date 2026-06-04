import React from 'react';

const HealthcareBanner = () => {
  const phoneNumber = "919940851598"; 
  const message = encodeURIComponent("Hi, I am looking for a healthcare consultant.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="w-full">
      <div 
        className="relative w-full overflow-hidden p-6 sm:p-10 md:p-12 lg:p-16 min-h-[220px] md:min-h-[260px] transition-all duration-300 select-none" 
        style={{ backgroundColor: '#50ad77', color: '#ffffff' }}
      >
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="react-triangles" width="90" height="90" patternUnits="userSpaceOnUse">
                <path d="M 0 90 L 45 0 L 90 90 Z" fill="none" stroke="white" strokeWidth="1.5" />
                <path d="M 45 0 L 90 90 L 0 90 Z" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3,3" />
                <path d="M 10 10 L 30 30 M 15 5 L 35 25" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#react-triangles)" />
            <circle cx="85%" cy="30%" r="200" fill="white" opacity="0.2" filter="blur(50px)" />
            <circle cx="15%" cy="80%" r="130" fill="white" opacity="0.12" filter="blur(40px)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="flex-1 w-full md:max-w-2xl lg:max-w-3xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3 md:mb-4">
              <div className="w-8 md:w-12 h-[3px] bg-white rounded-full hidden sm:block"></div>
              <span className="text-xs md:text-sm font-bold tracking-wider uppercase text-white/95 font-sans">
                GET SOLUTIONS FAST
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4.5xl font-extrabold leading-tight tracking-tight text-white font-sans">
              Searching for a First-Class Healthcare Consultant?
            </h2>
          </div>
          <div className="relative z-10 shrink-0 w-full md:w-auto flex justify-center md:justify-end mt-2 md:mt-0">
            <a 
              href={whatsappUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:scale-98 text-[#50ad77] font-bold px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 text-sm md:text-base w-full sm:w-auto border border-white/20"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.004 2c-5.517 0-9.996 4.48-9.996 9.997 0 2.01.597 3.886 1.624 5.462l-1.63 4.87 5.01-1.317a9.92 9.92 0 0 0 4.992 1.34c5.517 0 9.996-4.48 9.996-9.997S17.52 2 12.004 2zm5.548 14.11c-.218.614-1.253 1.12-1.734 1.194-.438.067-1.002.123-2.91-.667-2.44-.997-4.012-3.468-4.133-3.63-.122-.161-.989-1.317-.989-2.51 0-1.19.626-1.776.849-2.015.223-.239.49-.297.653-.297.163 0 .326.002.468.008.147.008.343-.03.537.438.2.482.684 1.667.744 1.79.06.122.1.264.017.43-.084.167-.124.262-.248.406-.124.143-.26.318-.372.427-.123.12-.253.25-.109.495.144.242.64 1.06 1.373 1.713.945.843 1.74 1.103 1.986.915.247-.188.487-.453.73-.733.242-.28.41-.35.632-.266.223.085 1.41.663 1.65.782.24.118.4.177.458.277.058.1.058.553-.16 1.168z"/>
              </svg>
              <span className="tracking-wide">Whatsapp Now</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareBanner;