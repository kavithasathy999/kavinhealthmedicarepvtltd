import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/testimonials`;

const Testimonialssection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(API_URL)
            .then((res) => setTestimonials(res.data))
            .catch((err) => console.error("Failed to fetch testimonials:", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (testimonials.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const prevSlide = () =>
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

    const nextSlide = () =>
        setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

    if (loading) {
        return (
            <div className="bg-gray-50 py-16 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-teal-700 font-semibold tracking-wide uppercase mb-2">
                            Client Testimonials
                        </h2>
                        <p className="text-3xl md:text-4xl font-bold text-gray-900">
                            Trusted By Healthcare Leaders
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-5 h-5 bg-gray-200 rounded-sm" />
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
                </div>
            </div>
        );
    }

    if (testimonials.length === 0) return null;

    return (
        <div className="bg-gray-50 py-16 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-teal-700 font-semibold tracking-wide uppercase mb-2">
                        Client Testimonials
                    </h2>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900">
                        Trusted By Healthcare Leaders
                    </p>
                </div>

                <div className="relative flex items-center justify-center">
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-teal-50 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-teal-700" />
                    </button>
                    <div className="w-full max-w-3xl overflow-hidden px-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100"
                            >
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < testimonials[currentIndex].star_rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-200 fill-gray-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-lg md:text-xl italic mb-8 leading-relaxed">
                                    "{testimonials[currentIndex].description}"
                                </p>
                                <div>
                                    <h4 className="font-bold text-gray-900">
                                        {testimonials[currentIndex].name}
                                    </h4>
                                    <p className="text-teal-600 font-medium">
                                        {testimonials[currentIndex].designation}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-teal-50 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6 text-teal-700" />
                    </button>
                </div>
                <div className="flex justify-center mt-8 gap-2">
                    {testimonials.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-3 rounded-full transition-all ${currentIndex === idx ? "bg-teal-700 w-8" : "bg-gray-300 w-3"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonialssection;