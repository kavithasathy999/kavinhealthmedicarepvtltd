import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/stats`;

const CounterItem = ({ targetValue, suffix, visible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1800;
    const stepTime = Math.max(10, Math.floor(duration / targetValue));
    const timer = setInterval(() => {
      start += Math.ceil(targetValue / (duration / stepTime));
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [visible, targetValue]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const Statssection = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch stats:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20 lg:mb-24">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-100 p-5 sm:p-6 rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[140px] sm:min-h-[160px] flex flex-col items-center justify-center animate-pulse"
          >
            <div className="h-8 bg-slate-200 rounded w-16 mb-3" />
            <div className="h-3 bg-slate-200 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (stats.length === 0) return null;

  return (
    <div
      ref={sectionRef}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20 lg:mb-24"
    >
      {stats.map((stat, idx) => (
        <div
          key={stat.id}
          className="bg-white border border-slate-100 p-5 sm:p-6 rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px]"
        >
          <div className="relative z-10 w-full px-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              <CounterItem
                targetValue={Number(stat.value)}
                suffix={stat.suffix}
                visible={isVisible}
              />
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mt-3 leading-relaxed">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Statssection;