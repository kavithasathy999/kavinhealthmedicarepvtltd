import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import breadcrumbImg from '../../src/assets/breadcrumb-img.jpg';
import FloatingButtons from '../components/FloatingButtons';

const handleImageError = (e, fallback) => {
  e.target.onerror = null;
  e.target.src = fallback;
};

export default function Blogsandarticles() {
  const [blogData, setBlogData] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const itemsPerPage = 9;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = blogData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(blogData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/blogs`);
      const data = await res.json();
      setBlogData(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#50ad77]/20 selection:text-[#50ad77] overflow-x-hidden">
      <Topbar />
      <Header />
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full bg-slate-900 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-black/60 z-10 mix-blend-multiply" />
        <img
          src={breadcrumbImg}
          alt="Medical Consultation Banner"
          className="w-full h-full object-cover object-center opacity-80 filter blur-[1px]"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="bg-white/10 text-white text-[10px] sm:text-xs uppercase font-bold tracking-widest px-3 py-1 rounded backdrop-blur-xs mb-2 animate-slide-in-left">
            Healthcare insights for a better tomorrow
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight animate-slide-in-right">
            Blogs & Articles
          </h2>
          <p className="text-slate-300 text-base mt-2 max-w-xl font-light animate-fade-in">
            <Link to="/" className="hover:text-white transition-colors duration-300">
              Home
            </Link>{" "}
            / Blogs
          </p>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans antialiased bg-white min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3 font-sans">
            Blogs &amp; <span className="text-[#50ad77] text-4xl">Articles</span>
          </h1>
          <p className="text-base text-slate-500 font-normal">
            Expertly curated insights on healthcare, Medicare, and personal wellbeing.
          </p>
        </div>
        <div className="border-t border-slate-900 w-full mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentBlogs.map((blog) => (
            <Link
              to={`/blogsandarticles/${blog.id}`}
              state={{ from: "blogs" }}
              key={blog.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="relative aspect-[1.4/1] w-full bg-slate-100 overflow-hidden">
                <img
                  src={`${baseUrl}${blog.image_url}`}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => handleImageError(e, 'https://placehold.co/600x400?text=No+Image')}
                />
                {blog.blog_date && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm flex flex-col items-center justify-center min-w-[3.5rem]">
                    <span className="text-xl font-black text-[#50ad77] leading-none">
                      {new Date(blog.blog_date).getDate()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                      {new Date(blog.blog_date).toLocaleString('default', { month: 'short' })} {new Date(blog.blog_date).getFullYear()}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-[12px] font-extrabold text-[#50ad77] uppercase tracking-widest mb-3">
                  {blog.read_time?.toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug mb-3 font-sans min-h-[56px] line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-base text-slate-500 leading-relaxed mb-6 line-clamp-3">
                  {blog.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => {
                  paginate(idx + 1);
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className={`w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-xl transition-all duration-200 ${
                  currentPage === idx + 1
                    ? 'bg-[#50ad77] text-white shadow-md shadow-[#50ad77]/30 scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#50ad77] hover:text-[#50ad77]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </main>
      <FloatingButtons />
      <Footer />
    </div>
  );
}
