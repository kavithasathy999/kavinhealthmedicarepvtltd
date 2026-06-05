import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/testimonials`;

const Testimonialssection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [itemsPerView, setItemsPerView] = useState(3);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        axios
            .get(API_URL)
            .then((res) => setTestimonials(res.data))
            .catch((err) => console.error("Failed to fetch testimonials:", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerView(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2);
            } else {
                setItemsPerView(3);
            }
        };
        handleResize(); 
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (testimonials.length === 0) return;
        const maxIndex = Math.max(0, testimonials.length - itemsPerView);
        if (currentIndex > maxIndex) {
            setCurrentIndex(maxIndex);
        }
    }, [itemsPerView, testimonials.length, currentIndex]);

    useEffect(() => {
        if (testimonials.length <= itemsPerView || isPaused) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = Math.max(0, testimonials.length - itemsPerView);
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 4000);
        return () => clearInterval(timer);
    }, [testimonials.length, itemsPerView, isPaused]);

    const maxIndex = Math.max(0, testimonials.length - itemsPerView);

    const prevSlide = () =>
        setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));

    const nextSlide = () =>
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));

    if (loading) {
        return (
            <div className="bg-gray-50 py-12 md:py-16 lg:py-16 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-teal-700 font-semibold tracking-wide uppercase mb-2">
                            Client Testimonials
                        </h2>
                        <p className="text-3xl md:text-4xl font-bold text-gray-900">
                            Trusted By Healthcare Leaders
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={`bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 animate-pulse ${i > 0 ? 'hidden md:block' : ''} ${i > 1 ? 'hidden lg:block' : ''}`}>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="w-5 h-5 bg-gray-200 rounded-sm" />
                                    ))}
                                </div>
                                <div className="space-y-2 mb-8">
                                    <div className="h-4 bg-gray-200 rounded w-full" />
                                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/3" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (testimonials.length === 0) return null;

    return (
        <div className="bg-gray-50 py-8 md:py-16 lg:py-16 px-4 md:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto relative">
                <div className="text-center mb-12">
                    <h2 className="text-teal-700 font-semibold tracking-wide uppercase mb-2">
                        Client Testimonials
                    </h2>
                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                        Trusted By <span className="text-[#50ad77]">Healthcare Leaders</span>
                    </p>
                </div>

                <div 
                    className="relative flex items-center justify-center group"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <button
                        onClick={prevSlide}
                        className={`absolute left-0 md:-left-4 lg:-left-6 z-10 p-2 sm:p-3 bg-white rounded-full shadow-md hover:bg-teal-50 hover:shadow-lg transition-all ${testimonials.length <= itemsPerView ? 'hidden' : 'flex'}`}
                        aria-label="Previous testimonials"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-teal-700" />
                    </button>
                    
                    <div className="w-full overflow-hidden px-1 sm:px-2 py-4">
                        <motion.div
                            animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
                            transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                            className="flex w-full"
                        >
                            {testimonials.map((testimonial, idx) => (
                                <div 
                                    key={idx} 
                                    className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3 sm:px-4"
                                >
                                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col">
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                                        i < testimonial.star_rating
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-200 fill-gray-200"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed flex-grow">
                                            "{testimonial.description}"
                                        </p>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-teal-600 font-medium text-xs sm:text-sm mt-1">
                                                {testimonial.designation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <button
                        onClick={nextSlide}
                        className={`absolute right-0 md:-right-4 lg:-right-6 z-10 p-2 sm:p-3 bg-white rounded-full shadow-md hover:bg-teal-50 hover:shadow-lg transition-all ${testimonials.length <= itemsPerView ? 'hidden' : 'flex'}`}
                        aria-label="Next testimonials"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-teal-700" />
                    </button>
                </div>
                
                {testimonials.length > itemsPerView && (
                    <div className="flex justify-center mt-8 gap-2">
                        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2.5 rounded-full transition-all ${
                                    currentIndex === idx ? "bg-teal-700 w-8" : "bg-gray-300 w-2.5"
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Testimonialssection;