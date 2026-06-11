import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import breadcrumbImg from '../../src/assets/breadcrumb-img.jpg';
import { Helmet } from 'react-helmet-async';

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideInRow {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
  .animate-row-in {
    animation: slideInRow 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
`;
document.head.appendChild(styleSheet);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

export default function ResourceRepository() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const paginatedReports = reports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/resource-repository`);
                if (response.data.success) {
                    setReports([...response.data.data].reverse());
                }
            } catch (error) {
                console.error("Failed to fetch resource repository:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const triggerDownload = (report) => {
        if (downloadingId !== null) return;
        setDownloadingId(report.id);
        setDownloadProgress(0);
        const interval = setInterval(() => {
            setDownloadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setDownloadingId(null);
                        const link = document.createElement('a');
                        link.href = `${API_BASE}/api/resource-repository/download/${report.pdf_url}`;
                        link.setAttribute('download', report.pdf_url.split('/').pop() || 'report.pdf');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }, 300);
                    return 100;
                }
                return prev + 25;
            });
        }, 150);
    };

    const firstReport = reports[0];

    return (
        <div className="min-h-screen font-sans text-slate-800 flex flex-col bg-slate-50">
            {firstReport && (
                <Helmet>
                    {firstReport.meta_title ? <title>{firstReport.meta_title}</title> : null}
                    {firstReport.meta_description ? <meta name="description" content={firstReport.meta_description} /> : null}
                    {firstReport.meta_keywords ? <meta name="keywords" content={firstReport.meta_keywords} /> : null}
                </Helmet>
            )}
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
                        Access and download updated documents
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight animate-slide-in-right">
                        Resource Repository
                    </h2>
                    <p className="text-slate-300 text-base mt-2 max-w-xl font-light animate-fade-in">
                        <Link to="/" className="hover:text-white transition-colors duration-300">
                            Home
                        </Link>{" "}
                        / Resource Repository
                    </p>
                </div>
            </div>
            <main className="flex-grow flex items-center justify-center py-7 px-4 sm:py-10 sm:px-6 lg:py-12 lg:px-8 bg-slate-50/50">
                <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl animate-fade-in-up">
                    <div className="mb-6 md:mb-8 text-center transition-all duration-500 hover:scale-[1.01]">
                        <h1 className="text-4xl text-left font-bold text-slate-900 mb-2 tracking-tight">Resource <span className="text-[#50ad77] text-4xl">Repository</span></h1>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden transition-shadow duration-300 hover:shadow-md">
                        <div className="bg-slate-50/50 px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-xs md:text-sm font-bold text-slate-700 flex items-center space-x-2">
                                <span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#50ad77] inline-block animate-pulse"></span>
                                <span className="text-base">Available Documents ({reports.length})</span>
                            </h2>
                        </div>

                        {loading ? (
                            <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 animate-pulse">
                                <div className="w-8 h-8 rounded-full border-3 border-emerald-100 border-t-[#50ad77] animate-spin"></div>
                                <span className="text-base font-medium">Loading reports...</span>
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="py-16 text-center text-slate-500 animate-fade-in">No reports available.</div>
                        ) : (
                            <>
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                                                <th className="py-3 lg:py-4 px-4 lg:px-6 text-center w-16 lg:w-20">S.No.</th>
                                                <th className="py-3 lg:py-4 px-4 lg:px-6">Headline</th>
                                                <th className="py-3 lg:py-4 px-4 lg:px-6 text-right w-36 lg:w-44">PDF Link</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {paginatedReports.map((report, index) => {
                                                const isSimulating = downloadingId === report.id;
                                                return (
                                                    <tr
                                                        key={report.id}
                                                        className="hover:bg-slate-50/80 transition-all duration-300 group animate-row-in hover:translate-x-1"
                                                        style={{ animationDelay: `${index * 60}ms` }}
                                                    >
                                                        <td className="py-3 lg:py-4 px-4 lg:px-6 text-center font-bold text-slate-900 group-hover:text-[#50ad77] transition-colors duration-300 text-sm">
                                                            {report.id}.
                                                        </td>
                                                        <td className="py-3 lg:py-4 px-4 lg:px-6">
                                                            <div className="flex items-start space-x-3">
                                                                <div>
                                                                    <h4 className="text-base font-semibold text-slate-900 group-hover:text-slate-950 transition-colors duration-300 leading-tight">
                                                                        {report.headline}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 lg:py-4 px-4 lg:px-6 text-right">
                                                            {isSimulating ? (
                                                                <div className="inline-flex items-center justify-end space-x-2 animate-fade-in">
                                                                    <div className="w-3.5 lg:w-4 h-3.5 lg:h-4 rounded-full border-2 border-emerald-200 border-t-[#50ad77] animate-spin"></div>
                                                                    <span className="text-base font-bold text-[#50ad77]">{downloadProgress}%</span>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => triggerDownload(report)}
                                                                    className="inline-flex items-center space-x-1.5 text-[10px] lg:text-xs font-bold text-[#50ad77] hover:text-[#3f9664] bg-[#eef7f2] hover:bg-emerald-100 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl transition-all duration-300 transform active:scale-95 hover:shadow-sm"
                                                                >
                                                                    <DownloadIcon />
                                                                    <span className="text-base">Download</span>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="block md:hidden divide-y divide-slate-150">
                                    {paginatedReports.map((report, index) => {
                                        const isSimulating = downloadingId === report.id;
                                        return (
                                            <div
                                                key={report.id}
                                                className="p-4 bg-white hover:bg-slate-50 transition-all duration-300 animate-row-in"
                                                style={{ animationDelay: `${index * 60}ms` }}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-base font-bold text-slate-500">
                                                        #{report.id}
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-base font-bold text-slate-500">
                                                            {report.file_size}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3.5 mb-4">
                                                    <span className="p-2 rounded-lg bg-[#eef7f2] text-[#50ad77] text-base mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                                        <FileIcon />
                                                    </span>
                                                    <h4 className="text-base font-semibold text-slate-800 leading-snug">
                                                        {report.headline}
                                                    </h4>
                                                </div>
                                                <div>
                                                    {isSimulating ? (
                                                        <div className="w-full bg-[#eef7f2] border border-[#50ad77]/20 rounded-xl py-3 flex items-center justify-center space-x-3 animate-fade-in">
                                                            <div className="w-4.5 h-4.5 rounded-full border-2 border-emerald-200 border-t-[#50ad77] animate-spin"></div>
                                                            <span className="text-base font-bold text-[#50ad77]">Downloading ({downloadProgress}%)</span>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => triggerDownload(report)}
                                                            className="w-full bg-[#50ad77] hover:bg-[#3f9664] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all duration-300 transform active:scale-[0.98] hover:shadow"
                                                        >
                                                            <DownloadIcon />
                                                            <span className="text-base">Download PDF Report</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                        {reports.length > itemsPerPage && (
                            <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-4 border-t border-slate-200 bg-slate-50 transition-colors duration-300 gap-4 md:gap-0">
                                <span className="text-base text-slate-500 font-medium">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, reports.length)} of {reports.length} entries
                                </span>
                                <div className="flex gap-2 w-full md:w-auto justify-center">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="flex-1 md:flex-none px-4 py-2 border border-slate-300 rounded-lg text-xs md:text-sm font-medium hover:bg-slate-100 disabled:opacity-50 transition-all duration-200 transform active:scale-95 text-slate-700 disabled:pointer-events-none text-center"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(reports.length / itemsPerPage)))}
                                        disabled={currentPage === Math.ceil(reports.length / itemsPerPage)}
                                        className="flex-1 md:flex-none px-4 py-2 border border-slate-300 rounded-lg text-xs md:text-sm font-medium hover:bg-slate-100 disabled:opacity-50 transition-all duration-200 transform active:scale-95 text-slate-700 disabled:pointer-events-none text-center"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}