import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Bannersection from './Bannersection';
import Aboutsection from "../components/Aboutsection";
import InsuranceAdvisor from '../components/InsuranceAdvisor';
import HealthcareBanner from '../components/HealthcareBanner';
import Esteemedpmcslider from '../components/Esteemedpmcslider';
import Testimonialssection from '../components/Testimonialssection';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blogs, setBlogs] = useState([]);
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/blogs`);
      const data = await res.json();
      setBlogs(data.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  };

  const testimonials = [
    {
      id: 1,
      name: "Dr. Anjali Sharma",
      role: "Chief Medical Officer",
      quote: "Working with Kavin healthcare has significantly improved our hospital's operational efficiency. Their team provides excellent guidance and quick support whenever needed. We highly recommend them.",
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Hospital Administrator",
      quote: "Kavin healthcare consistently provides high-performance solutions that stand up to tough challenges. Their professionalism and commitment to patient-centered care set them apart.",
    },
    {
      id: 3,
      name: "Priya Varma",
      role: "Clinical Lead",
      quote: "Our experience with Kavin healthcare has been outstanding. Their approach is versatile and well-planned, perfect for both large-scale hospital projects. Their support is invaluable.",
    },
    {
      id: 4,
      name: "Dr. Vikram Singh",
      role: "Director of Operations",
      quote: "The team at Kavin healthcare understands the complexities of healthcare management perfectly. Their strategic insights helped us streamline our patient care processes effectively.",
    },
    {
      id: 5,
      name: "Sunitha Reddy",
      role: "Healthcare Consultant",
      quote: "Exceptional service and deep domain expertise. Kavin healthcare turned our vision into reality with their meticulous planning and implementation skills.",
    },
    {
      id: 6,
      name: "Amit Patel",
      role: "Hospital Promoter",
      quote: "A reliable partner for hospital commissioning. Their end-to-end support throughout the project lifecycle was truly commendable and professional.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#50ad77]/20 selection:text-[#50ad77] overflow-x-hidden">
      <Topbar />
      <Header />
      <Bannersection />
      <Aboutsection />
      <InsuranceAdvisor />
      <Esteemedpmcslider />
      <HealthcareBanner />
      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="mx-auto max-w-7xl space-y-16">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 border-l-4 border-[#50ad77] pl-3 mb-3">
              <span className="text-xs font-bold text-[#50ad77] uppercase tracking-wider">LATEST ARTICLES</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  Blogs & Articles
                </h2>
                <p className="mt-4 text-slate-500 max-w-lg">
                  Actionable guidance, industry insights, and practical tips to help you work better and live healthier.
                </p>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <Link
                  to="/blogsandarticles"
                  className="inline-flex items-center gap-2 text-[#50ad77] font-semibold hover:text-slate-900 transition-colors border-b border-[#50ad77] pb-1 group"
                >
                  <span>Browse All Articles</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <Link
                to={`/blogsandarticles/${post.id}`}
                state={{ from: "home" }}
                key={post.id}
                className="block group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-[1.4/1] w-full bg-slate-100 overflow-hidden">
                  <img
                    src={`${baseUrl}${post.image_url}`}
                    alt={post.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x400?text=No+Image';
                    }}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.blog_date && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm flex flex-col items-center justify-center min-w-[3.5rem]">
                      <span className="text-xl font-black text-[#50ad77] leading-none">
                        {new Date(post.blog_date).getDate()}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                        {new Date(post.blog_date).toLocaleString('default', { month: 'short' })} {new Date(post.blog_date).getFullYear()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow space-y-3">
                  <div className="text-[11px] font-extrabold text-[#50ad77] uppercase tracking-widest">
                    {post.read_time?.toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#50ad77] transition-colors font-serif min-h-[56px] line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 pb-4">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Testimonialssection />
      <FloatingButtons />
      <Footer />
    </div>
  );
};

export default Home;
