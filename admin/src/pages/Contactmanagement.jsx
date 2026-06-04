import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { X, AlertCircle, CheckCircle, Inbox, Eye, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/contact`;
const BRAND_COLOR = "#50ad77";

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            className="fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium max-w-xs"
            style={{ backgroundColor: type === "success" ? BRAND_COLOR : "#ef4444" }}
        >
            {type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message}</span>
            <button onClick={onClose} className="ml-auto opacity-80 hover:opacity-100">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

const ConfirmModal = ({ name, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Enquiry</h3>
            <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to delete the enquiry from{" "}
                <span className="font-semibold text-gray-800">"{name}"</span>? This
                action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
);

const ContactModal = ({ data, mode, onClose, onSaved }) => {
    const isEdit = mode === "edit";

    const [form, setForm] = useState({
        name: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
        companyName: data?.companyName || "",
        companyEmail: data?.companyEmail || "",
        department: data?.department || "",
        message: data?.message || "",
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required.";
        if (!form.email.trim()) e.email = "Email is required.";
        if (!form.phone.trim()) e.phone = "Phone is required.";
        return e;
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async () => {
        if (!isEdit) {
            onClose();
            return;
        }
        const e = validate();
        if (Object.keys(e).length > 0) return setErrors(e);
        setLoading(true);
        try {
            await axios.put(`${API_URL}/${data.id}`, form);
            onSaved("Enquiry updated successfully!");
        } catch (err) {
            setErrors({ api: err.response?.data?.message || "Something went wrong." });
        } finally {
            setLoading(false);
        }
    };

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const inputClass = `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition disabled:bg-slate-50 disabled:text-slate-500 ${
        isEdit ? "border-gray-200 focus:ring-[#50ad77]/30 focus:border-[#50ad77]" : "border-slate-100"
    }`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
            onClick={handleBackdrop}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div
                    className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
                    style={{ backgroundColor: BRAND_COLOR }}
                >
                    <h2 className="text-white font-bold text-lg">
                        {isEdit ? "Edit Enquiry" : "View Enquiry"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition rounded-full p-1 hover:bg-white/20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    {errors.api && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {errors.api}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name {isEdit && <span className="text-red-500">*</span>}</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                disabled={!isEdit}
                                className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email {isEdit && <span className="text-red-500">*</span>}</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                disabled={!isEdit}
                                className={`${inputClass} ${errors.email ? 'border-red-400' : ''}`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone {isEdit && <span className="text-red-500">*</span>}</label>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                disabled={!isEdit}
                                className={`${inputClass} ${errors.phone ? 'border-red-400' : ''}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Segment</label>
                            <input
                                type="text"
                                value={form.department}
                                onChange={(e) => handleChange("department", e.target.value)}
                                disabled={!isEdit}
                                className={inputClass}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company Name</label>
                            <input
                                type="text"
                                value={form.companyName}
                                onChange={(e) => handleChange("companyName", e.target.value)}
                                disabled={!isEdit}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company Email</label>
                            <input
                                type="text"
                                value={form.companyEmail}
                                onChange={(e) => handleChange("companyEmail", e.target.value)}
                                disabled={!isEdit}
                                className={inputClass}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Message</label>
                        <textarea
                            value={form.message}
                            onChange={(e) => handleChange("message", e.target.value)}
                            disabled={!isEdit}
                            rows="4"
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                </div>
                <div className="px-6 pb-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                    >
                        {isEdit ? "Cancel" : "Close"}
                    </button>
                    {isEdit && (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
                            style={{ backgroundColor: BRAND_COLOR }}
                        >
                            {loading && (
                                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            )}
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Contactmanagement = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState(null);
    const [modalMode, setModalMode] = useState("view"); 
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const showToast = (message, type = "success") => setToast({ message, type });

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setMessages(res.data);
        } catch {
            showToast("Failed to load enquiries.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleSaved = (msg) => {
        setModalData(null);
        showToast(msg, "success");
        fetchMessages();
    };

    const openModal = (item, mode) => {
        setModalMode(mode);
        setModalData(item);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`${API_URL}/${deleteTarget.id}`);
            setDeleteTarget(null);
            showToast("Enquiry deleted successfully!", "success");
            fetchMessages();
        } catch {
            showToast("Failed to delete enquiry.", "error");
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const indexOfLastMessage = currentPage * itemsPerPage;
    const indexOfFirstMessage = indexOfLastMessage - itemsPerPage;
    const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);
    const totalPages = Math.ceil(messages.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-50">
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
            {modalData && (
                <ContactModal
                    data={modalData}
                    mode={modalMode}
                    onClose={() => setModalData(null)}
                    onSaved={handleSaved}
                />
            )}
            {deleteTarget && (
                <ConfirmModal
                    name={deleteTarget.name}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                            Contact Enquiries
                        </h1>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">S.No</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Company Info</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Segment</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-40">Date</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-48 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            {[...Array(6)].map((_, j) => (
                                                <td key={j} className="py-4 px-6">
                                                    <div className="h-4 bg-slate-200 rounded w-full" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : messages.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div
                                                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                                    style={{ backgroundColor: `${BRAND_COLOR}15` }}
                                                >
                                                    <Inbox className="w-8 h-8" style={{ color: BRAND_COLOR }} />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-1">No enquiries yet</h3>
                                                <p className="text-slate-500 text-sm mb-6">
                                                    When customers fill out the contact form, their details will appear here.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    currentMessages.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-6 text-sm font-medium text-slate-500">
                                                {indexOfFirstMessage + index + 1}.
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm font-bold text-slate-900">{item.name}</div>
                                                <a href={`mailto:${item.email}`} className="text-xs text-blue-500 hover:underline block mt-0.5">{item.email}</a>
                                                <div className="text-xs text-slate-500 mt-0.5">{item.phone}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm font-semibold text-slate-700">{item.companyName}</div>
                                                <a href={`mailto:${item.companyEmail}`} className="text-xs text-blue-500 hover:underline block mt-0.5">{item.companyEmail}</a>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                                                    {item.department}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                                                {formatDate(item.created_at)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openModal(item, "view")}
                                                        className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                                                    >
                                                        <Eye size={12} /> View
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(item, "edit")}
                                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                                                    >
                                                        <Edit size={12} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(item)}
                                                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
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
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 p-4 border-t border-slate-100 bg-slate-50/50">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-medium text-slate-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contactmanagement;
