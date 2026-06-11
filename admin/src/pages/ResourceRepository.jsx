import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Trash2, FileText, Loader2, Plus, Edit, Eye, X, Search } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ResourceRepository() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ headline: '', pdf: null, meta_title: '', meta_description: '', meta_keywords: '' });
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);
    const itemsPerPage = 10;
    const selectedPdfUrl = selectedReport
        ? `${API_BASE}/uploads/${selectedReport.pdf_url}#toolbar=0&navpanes=0&scrollbar=0`
        : '';

    const fileInputRef = useRef(null);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/api/resource-repository`);
            if (response.data.success) {
                setReports([...response.data.data].reverse());
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to load Resource Repository reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        document.body.style.overflow = selectedReport ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedReport]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                toast.error('Please upload a valid PDF file');
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('PDF file size must be less than or equal to 5MB');
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            setFormData(prev => ({ ...prev, pdf: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.headline.trim() || (!formData.pdf && !editingId)) {
            toast.error('Headline and PDF are required');
            return;
        }
        if (formData.headline.length > 50) {
            toast.error('Headline must be 50 characters or less');
            return;
        }

        try {
            setSubmitting(true);
            const data = new FormData();
            data.append('headline', formData.headline);
            data.append('meta_title', formData.meta_title);
            data.append('meta_description', formData.meta_description);
            data.append('meta_keywords', formData.meta_keywords);
            if (formData.pdf) {
                data.append('pdf', formData.pdf);
            }

            let response;
            if (editingId) {
                response = await axios.put(`${API_BASE}/api/resource-repository/${editingId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await axios.post(`${API_BASE}/api/resource-repository`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (response.data.success) {
                toast.success(editingId ? 'Report updated successfully' : 'Report added successfully');
                setFormData({ headline: '', pdf: null, meta_title: '', meta_description: '', meta_keywords: '' });
                setEditingId(null);
                setIsModalOpen(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
                fetchReports();
            }
        } catch (error) {
            console.error('Error saving report:', error);
            toast.error('Failed to save report');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (report) => {
        setEditingId(report.id);
        setFormData({ 
            headline: report.headline, 
            pdf: null, 
            meta_title: report.meta_title || '', 
            meta_description: report.meta_description || '', 
            meta_keywords: report.meta_keywords || '' 
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setReportToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!reportToDelete) return;
        try {
            const response = await axios.delete(`${API_BASE}/api/resource-repository/${reportToDelete}`);
            if (response.data.success) {
                toast.success('Report deleted successfully');
                setReports(reports.filter(r => r.id !== reportToDelete));
            }
        } catch (error) {
            console.error('Error deleting report:', error);
            toast.error('Failed to delete report');
        } finally {
            setIsDeleteModalOpen(false);
            setReportToDelete(null);
        }
    };

    const filteredReports = reports.filter(report => {
        const headline = report?.headline || "";
        const fileSize = report?.file_size || "";
        const query = searchQuery.toLowerCase();
        return headline.toLowerCase().includes(query) || fileSize.toLowerCase().includes(query);
    });

    return (
        <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
            <ToastContainer position="top-right" autoClose={1500} />
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Resource Repository</h1>
                        <p className="text-[#50ad77] mt-1">Manage valuation reports and disclosures</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ headline: '', pdf: null, meta_title: '', meta_description: '', meta_keywords: '' });
                            setIsModalOpen(true);
                        }}
                        className="bg-[#50ad77] hover:bg-[#3f9664] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <Plus size={20} /> Add Report
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin h-8 w-8 text-[#50ad77]" />
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                <h2 className="text-lg font-semibold text-slate-800">Uploaded Reports</h2>
                                <span className="bg-[#50ad77]/10 text-[#50ad77] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    {filteredReports.length} Total
                                </span>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search reports..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/20 focus:border-[#50ad77] font-medium"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-sm font-semibold border-b border-slate-200">
                                        <th className="py-4 px-6">ID</th>
                                        <th className="py-4 px-6">Headline</th>
                                        <th className="py-4 px-6">File Size</th>
                                        <th className="py-4 px-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reports.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-slate-500">No reports found</td>
                                        </tr>
                                    ) : filteredReports.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-slate-500">
                                                <div className="flex flex-col items-center gap-2 justify-center">
                                                    <Search className="w-8 h-8 opacity-20 text-slate-450" />
                                                    <span>No matching reports found.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(report => (
                                            <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 px-6 text-slate-500 font-medium">{report.id}.</td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-emerald-50 text-[#50ad77] rounded-lg">
                                                            <FileText size={20} />
                                                        </div>
                                                        <span className="font-semibold text-slate-800">{report.headline}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-slate-600 font-medium">{report.file_size}</td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedReport(report)}
                                                            className="px-3 py-1.5 bg-emerald-50 text-[#50ad77] hover:bg-[#50ad77] hover:text-white rounded-lg font-bold text-xs transition-colors"
                                                            title="View PDF"
                                                        >
                                                            <span className="inline-flex items-center gap-1">
                                                                <Eye size={12} /> View
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(report)}
                                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                                                            title="Edit"
                                                        >
                                                            <Edit size={12} /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(report.id)}
                                                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={12} /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {filteredReports.length > itemsPerPage && (
                            <div className="flex justify-between items-center p-4 border-t border-slate-200">
                                <span className="text-sm text-slate-500">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length} entries
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredReports.length / itemsPerPage)))}
                                        disabled={currentPage === Math.ceil(filteredReports.length / itemsPerPage)}
                                        className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Edit/Add Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all duration-300">
                        <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden shadow-2xl transform transition-all">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                                <h2 className="text-lg font-semibold text-slate-800">{editingId ? 'Edit Report' : 'Add New Report'}</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                                <div className="p-6 overflow-y-auto flex-1">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                                            <input
                                                type="text"
                                                name="headline"
                                                value={formData.headline}
                                                onChange={handleInputChange}
                                                maxLength="50"
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50ad77]/50 focus:border-[#50ad77] transition-colors text-slate-800"
                                                placeholder="e.g. Valuation Report - March 2026"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                                            <input
                                                type="text"
                                                name="meta_title"
                                                value={formData.meta_title}
                                                onChange={handleInputChange}
                                                maxLength={25}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50ad77]/50 focus:border-[#50ad77] transition-colors text-slate-800"
                                                placeholder="SEO Meta Title"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                                            <textarea
                                                name="meta_description"
                                                value={formData.meta_description}
                                                onChange={handleInputChange}
                                                rows="2"
                                                maxLength={50}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50ad77]/50 focus:border-[#50ad77] transition-colors text-slate-800 resize-none"
                                                placeholder="SEO Meta Description"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Keywords</label>
                                            <input
                                                type="text"
                                                name="meta_keywords"
                                                value={formData.meta_keywords}
                                                onChange={handleInputChange}
                                                maxLength={25}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50ad77]/50 focus:border-[#50ad77] transition-colors text-slate-800"
                                                placeholder="SEO Meta Keywords (comma separated)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">PDF File (Max: 5MB)</label>
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50ad77]/50 focus:border-[#50ad77] transition-colors text-slate-800"
                                                {...(!editingId && { required: true })}
                                            />
                                            {editingId && <p className="text-xs text-slate-500 mt-1">Leave blank to keep existing PDF.</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 font-medium rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-2.5 bg-[#50ad77] text-white font-medium rounded-lg hover:bg-[#3f9664] focus:outline-none focus:ring-4 focus:ring-[#50ad77]/30 transition-all flex items-center disabled:opacity-70"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                                {editingId ? 'Updating...' : 'Saving...'}
                                            </>
                                        ) : (
                                            editingId ? 'Update Report' : 'Save Report'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {selectedReport && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl w-full max-w-6xl h-[88vh] flex flex-col overflow-hidden shadow-2xl">
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50">
                                <div className="min-w-0">
                                    <h2 className="text-base font-semibold text-slate-800 truncate">{selectedReport.headline}</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">PDF Preview</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedReport(null)}
                                    className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-colors shrink-0"
                                    aria-label="Close PDF preview"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="flex-1 bg-slate-100">
                                <iframe
                                    src={selectedPdfUrl}
                                    title={selectedReport.headline}
                                    className="w-full h-full border-0"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <DeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    onCancel={() => {
                        setIsDeleteModalOpen(false);
                        setReportToDelete(null);
                    }}
                    onConfirm={confirmDelete}
                />
            </div>
        </div>
    );
}
