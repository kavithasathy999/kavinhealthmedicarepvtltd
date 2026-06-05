import React, { useState, useEffect, useCallback, useRef } from 'react';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import FloatingButtons from '../components/FloatingButtons';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import ReactPhoneInput from 'react-phone-input-2';
const PhoneInput = ReactPhoneInput.default ? ReactPhoneInput.default : ReactPhoneInput;
import 'react-phone-input-2/lib/style.css';
import breadcrumbImg from '../../src/assets/breadcrumb-img.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const CARDS_PER_PAGE = 10;

function SkeletonCard() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 py-7 border-t border-slate-200 animate-pulse">
      <div className="flex-1">
        <div className="h-6 bg-slate-200 rounded-lg w-2/5 mb-4" />
        <div className="h-4 bg-slate-100 rounded w-full max-w-2xl" />
      </div>
      <div className="h-10 bg-slate-100 rounded-xl w-44" />
    </div>
  );
}

function OpportunityCard({ role, index, onApply }) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 py-7 border-t border-slate-200">
      <div className="flex-1">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
          {index + 1}. {role.title}
        </h3>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {role.description}
        </p>
      </div>
      <button
        onClick={() => onApply(role)}
        className="w-full sm:w-auto sm:ml-6 shrink-0 inline-flex items-center justify-center px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-[#50ad77] hover:text-white transition-all duration-300 focus:ring-4 focus:ring-[#50ad77]/30 outline-none">
        Click here to apply
      </button>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (
      i === currentPage - delta - 1 ||
      i === currentPage + delta + 1
    ) {
      pages.push('...');
    }
  }

  const dedupedPages = pages.filter((p, idx) => !(p === '...' && pages[idx - 1] === '...'));

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-12 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 sm:px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-[#50ad77] hover:text-[#50ad77] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </button>
      {dedupedPages.map((page, idx) =>
        page === '...' ? (
          <span key={`dots-${idx}`} className="px-2 py-2 text-slate-400 text-sm select-none">
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 sm:w-10 sm:h-10 text-sm font-semibold rounded-xl transition-all duration-200 ${currentPage === page
              ? 'bg-[#50ad77] text-white shadow-md shadow-[#50ad77]/30 scale-105'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-[#50ad77] hover:text-[#50ad77]'
              }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 sm:px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-[#50ad77] hover:text-[#50ad77] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <span className="hidden sm:inline">Next</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default function Career() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [applyModalRole, setApplyModalRole] = useState(null);
  const [applyForm, setApplyForm] = useState({
    fullname: '',
    contact_number: '',
    email: '',
    qualification: '',
    resume: null,
    photo: null
  });
  const [isApplying, setIsApplying] = useState(false);
  const [applyErrors, setApplyErrors] = useState({});

  const resumeRef = useRef(null);
  const photoRef = useRef(null);

  const fetchOpportunities = useCallback(async (page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/career?page=${page}&limit=${CARDS_PER_PAGE}`
      );
      if (!res.ok) throw new Error('Failed to fetch opportunities');
      const json = await res.json();
      if (json.success) {
        setOpportunities(json.data);
        setTotalPages(json.pagination.totalPages);
        setTotal(json.pagination.total);
      } else {
        throw new Error(json.message || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities(currentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, fetchOpportunities]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleApplyChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fullname') {
      if (value !== '' && !/^[A-Za-z\s]+$/.test(value)) return;
    }
    setApplyForm(prev => ({ ...prev, [name]: value }));
    setApplyErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleApplyFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (name === 'resume') {
      if (file.size > 5 * 1024 * 1024) {
        setApplyErrors(prev => ({ ...prev, resume: 'Resume must be less than 5MB' }));
        return;
      }
    }
    if (name === 'photo') {
      if (file.size > 3 * 1024 * 1024) {
        setApplyErrors(prev => ({ ...prev, photo: 'Photo must be less than 3MB' }));
        return;
      }
    }
    setApplyForm(prev => ({ ...prev, [name]: file }));
    setApplyErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!applyForm.fullname.trim()) errors.fullname = 'Full name is required';
    if (!applyForm.contact_number || applyForm.contact_number.length < 10) errors.contact_number = 'Valid contact number is required';
    if (!applyForm.email.trim()) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(applyForm.email)) errors.email = 'Invalid email address';
    if (!applyForm.qualification.trim()) errors.qualification = 'Qualification is required';
    if (!applyForm.resume) errors.resume = 'Resume is required (Max 5MB)';
    if (!applyForm.photo) errors.photo = 'Photo is required (Max 3MB)';
    if (Object.keys(errors).length > 0) {
      setApplyErrors(errors);
      return;
    }
    setIsApplying(true);
    try {
      const formData = new FormData();
      formData.append('career_id', applyModalRole.id);
      formData.append('fullname', applyForm.fullname);
      formData.append('contact_number', applyForm.contact_number);
      formData.append('email', applyForm.email);
      formData.append('qualification', applyForm.qualification);
      formData.append('resume', applyForm.resume);
      formData.append('photo', applyForm.photo);
      const res = await fetch(`${API_BASE}/api/career/apply`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Application submitted successfully!');
        setApplyModalRole(null);
        setApplyForm({ fullname: '', contact_number: '', email: '', qualification: '', resume: null, photo: null });
      } else {
        toast.error(data.message || 'Failed to submit application');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <>
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
            Build Your Future With Us
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight animate-slide-in-right">
            Careers
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light animate-fade-in">
            <Link to="/" className="hover:text-white transition-colors duration-300">
              Home
            </Link>{" "}
            / Career
          </p>
        </div>
      </div>
      <div className="min-h-screen bg-slate-50 py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto mb-8 sm:mb-10 lg:mb-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3 sm:mb-4">
            <h1 className="text-4xl sm:text-4xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Explore <span className="text-[#50ad77] text-4xl">Opportunities</span>
            </h1>
            {!loading && !error && total > 0 && (
              <p className="text-sm text-slate-400 shrink-0">
                Showing{' '}
                <span className="font-semibold text-slate-600">
                  {(currentPage - 1) * CARDS_PER_PAGE + 1}–
                  {Math.min(currentPage * CARDS_PER_PAGE, total)}
                </span>{' '}
                of <span className="font-semibold text-slate-600">{total}</span> roles
              </p>
            )}
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed lg:whitespace-nowrap">
            Join our diverse team of professionals. Discover a career path that aligns with your passion, expertise, and desire to make a difference in healthcare.
          </p>
        </div>
        {error && (
          <div className="max-w-7xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-red-800">Failed to load opportunities</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <button
                  onClick={() => fetchOpportunities(currentPage)}
                  className="mt-3 text-sm font-semibold text-red-700 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto border-b border-slate-200">
          {loading
            ? Array.from({ length: CARDS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
            : opportunities.map((role, idx) => <OpportunityCard key={role.id} role={role} index={(currentPage - 1) * CARDS_PER_PAGE + idx} onApply={setApplyModalRole} />)}
        </div>
        {!loading && !error && opportunities.length === 0 && (
          <div className="max-w-7xl mx-auto text-center py-24">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No openings right now</h3>
            <p className="text-slate-500">Check back soon for new career opportunities.</p>
          </div>
        )}
        {!loading && !error && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <FloatingButtons />
      <Footer />

      {applyModalRole && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-2xl animate-slideUp overflow-hidden">
            <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Apply for Role</h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Applying for: <span className="font-semibold text-[#50ad77]">{applyModalRole.title}</span></p>
              </div>
              <button
                onClick={() => setApplyModalRole(null)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-8 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="fullname"
                      value={applyForm.fullname}
                      onChange={handleApplyChange}
                      className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border ${applyErrors.fullname ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-[#50ad77]/30 focus:border-[#50ad77] transition-all outline-none`}
                      placeholder="John Doe"
                    />
                    {applyErrors.fullname && <p className="text-red-500 text-xs mt-1">{applyErrors.fullname}</p>}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">Contact Number <span className="text-red-500">*</span></label>
                    <PhoneInput
                      country={'in'}
                      value={applyForm.contact_number}
                      countryCodeEditable={false}
                      onChange={(phone) => {
                        setApplyForm(prev => ({ ...prev, contact_number: phone }));
                        setApplyErrors(prev => ({ ...prev, contact_number: null }));
                      }}
                      inputStyle={{
                        width: '100%',
                        height: '46px',
                        borderRadius: '0.75rem',
                        border: applyErrors.contact_number ? '1px solid #f87171' : '1px solid #e2e8f0',
                        backgroundColor: applyErrors.contact_number ? '#fef2f2' : '#ffffff',
                        fontSize: '14px',
                      }}
                      buttonStyle={{
                        borderRadius: '0.75rem 0 0 0.75rem',
                        borderColor: applyErrors.contact_number ? '#f87171' : '#e2e8f0',
                      }}
                    />
                    {applyErrors.contact_number && <p className="text-red-500 text-xs mt-1">{applyErrors.contact_number}</p>}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={applyForm.email}
                      onChange={handleApplyChange}
                      className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border ${applyErrors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-[#50ad77]/30 focus:border-[#50ad77] transition-all outline-none`}
                      placeholder="john@example.com"
                    />
                    {applyErrors.email && <p className="text-red-500 text-xs mt-1">{applyErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">Qualification <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="qualification"
                      value={applyForm.qualification}
                      onChange={handleApplyChange}
                      className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl border ${applyErrors.qualification ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-[#50ad77]/30 focus:border-[#50ad77] transition-all outline-none`}
                      placeholder="B.Sc Nursing, MBBS, etc."
                    />
                    {applyErrors.qualification && <p className="text-red-500 text-xs mt-1">{applyErrors.qualification}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-4">
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">Resume / CV <span className="text-red-500">*</span></label>
                    <p className="text-[10px] sm:text-xs text-slate-500 mb-3 sm:mb-4">PDF, DOC, DOCX (Max 5MB)</p>
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      ref={resumeRef}
                      onChange={handleApplyFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => resumeRef.current.click()}
                      className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl border-2 border-dashed ${applyErrors.resume ? 'border-red-400 text-red-600 bg-red-50' : 'border-slate-300 text-slate-600 bg-white hover:border-[#50ad77]'} transition-colors font-medium text-xs sm:text-sm flex items-center justify-center gap-2`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      <span className="truncate">{applyForm.resume ? applyForm.resume.name : 'Upload Resume'}</span>
                    </button>
                    {applyErrors.resume && <p className="text-red-500 text-xs mt-2 text-center">{applyErrors.resume}</p>}
                  </div>
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">Passport Size Photo <span className="text-red-500">*</span></label>
                    <p className="text-[10px] sm:text-xs text-slate-500 mb-3 sm:mb-4">JPG, PNG, WEBP (Max 3MB)</p>
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      ref={photoRef}
                      onChange={handleApplyFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => photoRef.current.click()}
                      className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl border-2 border-dashed ${applyErrors.photo ? 'border-red-400 text-red-600 bg-red-50' : 'border-slate-300 text-slate-600 bg-white hover:border-[#50ad77]'} transition-colors font-medium text-xs sm:text-sm flex items-center justify-center gap-2`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="truncate">{applyForm.photo ? applyForm.photo.name : 'Upload Photo'}</span>
                    </button>
                    {applyErrors.photo && <p className="text-red-500 text-xs mt-2 text-center">{applyErrors.photo}</p>}
                  </div>
                </div>
              </div>
              <div className="px-5 sm:px-8 py-4 sm:py-5 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setApplyModalRole(null)}
                  className="w-full sm:flex-1 py-3 sm:py-3.5 px-6 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="w-full sm:flex-[2] py-3 sm:py-3.5 px-6 rounded-xl font-bold text-white bg-[#50ad77] hover:bg-[#3d9661] transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-[#50ad77]/30 text-sm sm:text-base"
                >
                  {isApplying ? (
                    <>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={1500} />
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
      `}</style>
    </>
  );
}
