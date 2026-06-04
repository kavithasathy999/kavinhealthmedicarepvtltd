import React, { useState, useEffect } from 'react';

const Esteemedpmcslider = ({ title = "Our Esteemed PMCs", type = "Our Esteemed PMc", bgClass = "bg-white", fadeClass = "from-white" }) => {
  const [images, setImages] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/brands?type=${type}`);
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error('Error fetching esteemed pmc images:', err);
      }
    };
    fetchImages();
  }, [type, baseUrl]);

  if (images.length === 0) return null;

  const tripleImages = [...images, ...images, ...images];

  return (
    <div className={`w-full ${bgClass} py-12 md:py-16 lg:py-20 relative`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        <div className="mt-4 h-1 w-20 bg-[#50ad77] rounded-full mx-auto" />
      </div>

      <div className="w-full overflow-hidden relative">
        <div className={`absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r ${fadeClass} to-transparent z-10 pointer-events-none`}></div>
        <div className={`absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l ${fadeClass} to-transparent z-10 pointer-events-none`}></div>
        <div className="flex w-max items-center animate-infinite-scroll hover:[animation-play-state:paused]">
          {tripleImages.map((imgObj, index) => (
            <div 
              key={`${imgObj.id}-${index}`}
              className="
                flex-shrink-0 
                flex items-center justify-center
                px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
                w-[120px] h-[55px]
                sm:w-[140px] sm:h-[65px]
                md:w-[180px] md:h-[80px]
                lg:w-[220px] lg:h-[95px]
                xl:w-[260px] xl:h-[110px]
              "
            >
              <img 
                src={`${baseUrl}${imgObj.image_url}`} 
                alt={`${type} Logo`} 
                className="
                  w-full h-full 
                  object-contain 
                  transition-all duration-300 
                  opacity-75 hover:opacity-100 transform hover:scale-105
                "
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Esteemedpmcslider;