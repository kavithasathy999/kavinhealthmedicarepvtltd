import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Plus, X, AlertCircle, CheckCircle, BarChart2, Hash, Type, ArrowUpDown } from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/stats`;
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

const ConfirmModal = ({ label, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Stat</h3>
            <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">"{label}"</span>? This
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

const StatModal = ({ editData, onClose, onSaved }) => {
    const isEdit = !!editData;

    const [form, setForm] = useState({
        value: editData?.value || "",
        label: editData?.label || "",
        suffix: editData?.suffix || "",
        display_order: editData?.display_order || "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e = {};
        if (form.value === "" || form.value === null) e.value = "Value is required.";
        else if (isNaN(Number(form.value)) || Number(form.value) < 0)
            e.value = "Value must be a positive number.";
        if (!form.label.trim()) {
            e.label = "Label is required.";
        } else if (form.label.trim().length < 2) {
            e.label = "Label must be at least 2 characters.";
        } else if (form.label.trim().split(/\s+/).length > 6) {
            e.label = "Label must not exceed 6 words.";
        }
        return e;
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) return setErrors(e);
        setLoading(true);
        try {
            await axios.put(`${API_URL}/${editData.id}`, form);
            onSaved("Stat updated successfully!");
        } catch (err) {
            setErrors({ api: err.response?.data?.message || "Something went wrong." });
        } finally {
            setLoading(false);
        }
    };

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
            onClick={handleBackdrop}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div
                    className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
                    style={{ backgroundColor: BRAND_COLOR }}
                >
                    <h2 className="text-white font-bold text-lg">
                        Edit Stat
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition rounded-full p-1 hover:bg-white/20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="px-6 py-5 space-y-5">
                    {errors.api && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {errors.api}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <Hash className="w-3.5 h-3.5" /> Value <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={form.value}
                            onChange={(e) => handleChange("value", e.target.value)}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
                            }}
                            placeholder="e.g. 100"
                            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${errors.value
                                ? "border-red-400 focus:ring-red-200"
                                : "border-gray-200 focus:ring-[#50ad77]/30 focus:border-[#50ad77]"
                                }`}
                        />
                        {errors.value && (
                            <p className="text-red-500 text-xs mt-1">{errors.value}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <Type className="w-3.5 h-3.5" /> Suffix
                                <span className="text-gray-400 font-normal">(optional — e.g. +, %, /7)</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            value={form.suffix}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (/^[^a-zA-Z]*$/.test(val)) handleChange("suffix", val);
                            }}
                            placeholder="e.g.  +  or  %  or  /7"
                            maxLength={10}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/30 focus:border-[#50ad77] transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <Type className="w-3.5 h-3.5" /> Label <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            value={form.label}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (/[0-9]/.test(val)) return;
                                const wordCount = val.trim() === '' ? 0 : val.trim().split(/\s+/).length;
                                if (wordCount <= 6 || val.length < form.label.length) {
                                    handleChange("label", val);
                                }
                            }}
                            placeholder="e.g. OHC Managed Setups"
                            maxLength={150}
                            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${errors.label
                                ? "border-red-400 focus:ring-red-200"
                                : "border-gray-200 focus:ring-[#50ad77]/30 focus:border-[#50ad77]"
                                }`}
                        />
                        {errors.label && (
                            <p className="text-red-500 text-xs mt-1">{errors.label}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <ArrowUpDown className="w-3.5 h-3.5" /> Display Order
                                <span className="text-gray-400 font-normal">(optional)</span>
                            </span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={form.display_order}
                            onChange={(e) => handleChange("display_order", e.target.value)}
                            placeholder="e.g. 1"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/30 focus:border-[#50ad77] transition"
                        />
                        <p className="text-gray-400 text-xs mt-1">Lower number = appears first on homepage.</p>
                    </div>
                </div>
                <div className="mx-6 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Preview</p>
                    <div className="text-center">
                        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {form.value || "0"}{form.suffix || ""}
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                            {form.label || "Label"}
                        </p>
                    </div>
                </div>
                <div className="px-6 pb-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{ backgroundColor: BRAND_COLOR }}
                    >
                        {loading && (
                            <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        )}
                        {loading ? "Saving..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Stats = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => setToast({ message, type });

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setStats(res.data);
        } catch {
            showToast("Failed to load stats.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleSaved = (msg) => {
        setShowModal(false);
        setEditData(null);
        showToast(msg, "success");
        fetchStats();
    };

    const handleEdit = (item) => {
        setEditData(item);
        setShowModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`${API_URL}/${deleteTarget.id}`);
            setDeleteTarget(null);
            showToast("Stat deleted successfully!", "success");
            fetchStats();
        } catch {
            showToast("Failed to delete stat.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
            {showModal && (
                <StatModal
                    editData={editData}
                    onClose={() => { setShowModal(false); setEditData(null); }}
                    onSaved={handleSaved}
                />
            )}
            {deleteTarget && (
                <ConfirmModal
                    label={deleteTarget.label}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                            Stats Management
                        </h1>
                        <p className="text-[#50ad77] text-sm mt-0.5">
                            {stats.length} stat{stats.length !== 1 ? "s" : ""} total
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">S.No</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-28">Value</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Suffix</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Label</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-28">Order</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-40">Preview</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-32 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [...Array(4)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            {[...Array(7)].map((_, j) => (
                                                <td key={j} className="py-4 px-6">
                                                    <div className="h-4 bg-slate-200 rounded w-full" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : stats.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div
                                                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                                    style={{ backgroundColor: `${BRAND_COLOR}15` }}
                                                >
                                                    <BarChart2 className="w-8 h-8" style={{ color: BRAND_COLOR }} />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-1">No stats yet</h3>
                                                <p className="text-slate-500 text-sm mb-6">
                                                    No stats available to display.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    stats.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-6 text-sm font-medium text-slate-500">
                                                {index + 1}.
                                            </td>
                                            <td className="py-4 px-6 text-sm font-extrabold text-slate-800">
                                                {item.value}
                                            </td>
                                            <td className="py-4 px-6 text-sm font-semibold text-slate-600">
                                                {item.suffix || <span className="text-slate-300 italic">none</span>}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-700 font-medium">
                                                {item.label}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-500">
                                                {item.display_order}
                                            </td>
                                            {/* Preview */}
                                            <td className="py-4 px-6">
                                                <div className="bg-slate-50 rounded-xl px-3 py-2 text-center border border-slate-100 min-w-[100px]">
                                                    <div className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                                                        {item.value}{item.suffix}
                                                    </div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight mt-0.5 line-clamp-2">
                                                        {item.label}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg font-bold text-xs transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(item)}
                                                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg font-bold text-xs transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;