import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import FloatingButtons from '../components/FloatingButtons';
import breadcrumbImg from '../../src/assets/breadcrumb-img.jpg';
import { Helmet } from 'react-helmet-async';

const handleImageError = (e, fallback) => {
  e.target.onerror = null;
  e.target.src = fallback;
};

export default function Blogssinglepage() {
  const { blogId } = useParams();
  const location = useLocation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchBlog();
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/blogs`);
      const data = await res.json();
      const foundBlog = data.find((item) => item.id === Number(blogId));
      setBlog(foundBlog);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const backLink =
    location.state?.from === "home"
      ? { to: "/", label: "Back to Home" }
      : { to: "/blogsandarticles", label: "Back to Blogs" };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-[#50ad77] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <Topbar />
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Blog Not Found</h1>
          <Link to={backLink.to} className="text-[#50ad77] font-semibold hover:text-slate-900">
            {backLink.label}
          </Link>
        </main>
        <FloatingButtons />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#50ad77]/20 selection:text-[#50ad77] overflow-x-hidden">
      {blog && (
        <Helmet>
          {blog.meta_title ? <title>{blog.meta_title}</title> : null}
          {blog.meta_description ? <meta name="description" content={blog.meta_description} /> : null}
          {blog.meta_keywords ? <meta name="keywords" content={blog.meta_keywords} /> : null}
        </Helmet>
      )}
      <Topbar />
      <Header />
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10 mix-blend-multiply" />
        <img
          src={breadcrumbImg}
          alt="Medical Consultation Banner"
          className="w-full h-full object-cover object-center opacity-80 filter blur-[1px]"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="bg-white/10 text-white text-[10px] sm:text-xs uppercase font-bold tracking-widest px-3 py-1 rounded backdrop-blur-xs mb-2">
            Healthcare insights for a better tomorrow
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Blog Details
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light">
            <Link to="/" className="hover:text-white transition-colors duration-300">Home</Link>{" "}
            / <Link to="/blogsandarticles" className="hover:text-white transition-colors duration-300">Blogs</Link>{" "}
            / Details
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="text-[11px] font-extrabold text-[#50ad77] uppercase tracking-widest mb-4">
          {blog.read_time?.toUpperCase()}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 font-sans">
          {blog.title}
        </h1>
        <div className="relative aspect-[1.7/1] w-full bg-slate-100 overflow-hidden rounded-2xl mb-8">
          <img
            src={`${baseUrl}${blog.image_url}`}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => handleImageError(e, 'https://placehold.co/1200x800?text=No+Image')}
          />
          {blog.blog_date && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md flex flex-col items-center justify-center min-w-[4rem]">
              <span className="text-2xl font-black text-[#50ad77] leading-none">
                {new Date(blog.blog_date).getDate()}
              </span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">
                {new Date(blog.blog_date).toLocaleString('default', { month: 'short' })} {new Date(blog.blog_date).getFullYear()}
              </span>
            </div>
          )}
        </div>
        <article className="prose prose-slate max-w-none">
          <p className="text-lg leading-8 text-slate-600 text-justify [hyphens:auto]">{blog.description}</p>
        </article>
        <Link
          to={backLink.to}
          className="mt-10 flex justify-center w-fit mx-auto items-center text-[#50ad77] font-semibold hover:text-slate-900 transition-colors"
        >
          {backLink.label}
        </Link>
      </main>
      <FloatingButtons />
      <Footer />
    </div>
  );
}
