import React, { useState, useEffect, useCallback } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function formatPhone(raw) {
    if (!raw) return '—';
    const digits = String(raw).replace(/\D/g, '');
    const local = digits.length === 12 && digits.startsWith('91')
        ? digits.slice(2)
        : digits.length === 11 && digits.startsWith('0')
            ? digits.slice(1)
            : digits;
    return `+91 ${local}`;
}

async function downloadFile(url, filename) {
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
    } catch {
        window.open(url, '_blank');
    }
}

function Toast({ message, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    const colors = { success: 'bg-emerald-500', error: 'bg-red-500', info: 'bg-blue-500' };
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white shadow-2xl text-sm font-medium ${colors[type] || colors.info} animate-slideUp`}>
            {type === 'success' && <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
            {type === 'error' && <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
    );
}

function ConfirmModal({ title, message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-5">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm mb-7">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">Delete</button>
                </div>
            </div>
        </div>
    );
}

function EditApplicationModal({ item, onClose, onSaved }) {
    const [form, setForm] = useState({ ...item });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };
    const handleSubmit = async () => {
        const e = {};
        if (!form.fullname.trim()) e.fullname = 'Fullname is required';
        if (!form.contact_number.trim()) e.contact_number = 'Contact number is required';
        if (!form.email.trim()) e.email = 'Email is required';
        if (!form.qualification.trim()) e.qualification = 'Qualification is required';
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/career/applications/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname: form.fullname, contact_number: form.contact_number, email: form.email, qualification: form.qualification }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message);
            onSaved(json.data);
        } catch (err) {
            setErrors({ submit: err.message });
        } finally {
            setSaving(false);
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto pt-20">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 animate-slideUp">
                <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Edit Application</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Role: {item.career_title}</p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="px-8 py-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                        <input name="fullname" value={form.fullname} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/40 transition ${errors.fullname ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                        {errors.fullname && <p className="text-xs text-red-500 mt-1">{errors.fullname}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Number</label>
                        <input
                            name="contact_number" value={form.contact_number}
                            onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setForm((prev) => ({ ...prev, contact_number: val })); setErrors((prev) => ({ ...prev, contact_number: undefined })); }}
                            inputMode="numeric" maxLength={10} placeholder="e.g. 9876543210"
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/40 transition ${errors.contact_number ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                        />
                        {errors.contact_number && <p className="text-xs text-red-500 mt-1">{errors.contact_number}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                        <input name="email" value={form.email} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/40 transition ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Qualification</label>
                        <input name="qualification" value={form.qualification} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/40 transition ${errors.qualification ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                        {errors.qualification && <p className="text-xs text-red-500 mt-1">{errors.qualification}</p>}
                    </div>
                    {errors.submit && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{errors.submit}</div>}
                </div>
                <div className="px-8 pb-8 flex gap-3">
                    <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                    <button onClick={handleSubmit} disabled={saving} className="flex-1 sm:flex-none px-8 py-2.5 text-sm font-semibold text-white bg-[#50ad77] rounded-xl hover:bg-[#3d9661] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewType, setPreviewType] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const showToast = (message, type = 'success') => setToast({ message, type });

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/career/applications`);
            const json = await res.json();
            if (json.success) {
                const securedData = json.data.map(item => ({
                    ...item,
                    photo_url: item.photo_url ? item.photo_url.replace(/^http:\/\//i, 'https://') : item.photo_url,
                    resume_url: item.resume_url ? item.resume_url.replace(/^http:\/\//i, 'https://') : item.resume_url
                }));
                setApplications(securedData);
            } else throw new Error(json.message);
        } catch (err) { showToast(err.message, 'error'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);

    const handleSaved = (updated) => {
        setEditItem(null);
        const securedUpdated = {
            ...updated,
            photo_url: updated.photo_url ? updated.photo_url.replace(/^http:\/\//i, 'https://') : updated.photo_url,
            resume_url: updated.resume_url ? updated.resume_url.replace(/^http:\/\//i, 'https://') : updated.resume_url
        };
        setApplications((prev) => prev.map((a) => (a.id === securedUpdated.id ? securedUpdated : a)));
        showToast('Application updated successfully!');
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            const res = await fetch(`${API_BASE}/api/career/applications/${deleteTarget.id}`, { method: 'DELETE' });
            const json = await res.json();
            if (!json.success) throw new Error(json.message);
            setApplications((prev) => prev.filter((a) => a.id !== deleteTarget.id));
            showToast('Application deleted');
        } catch (err) { showToast(err.message, 'error'); }
        finally { setDeleteTarget(null); }
    };

    const filtered = applications.filter(
        (a) =>
            a.fullname.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase()) ||
            a.career_title?.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#50ad77] rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-slate-900">Job Applications</h1>
                        <p className="text-xs text-slate-400 hidden sm:block">View and manage candidate applications</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" placeholder="Search by name, email, or role..." value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/30 focus:border-[#50ad77]" />
                </div>

                {loading ? (
                    <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-slate-100" />)}</div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <p className="font-semibold text-slate-700">{search ? 'No applications match your search' : 'No applications received yet'}</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">S.No</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mobile Number</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Qualification</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Attachments</th>
                                        <th className="px-5 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {currentItems.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-500">{indexOfFirstItem + index + 1}.</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {item.photo_url ? (
                                                        <img src={item.photo_url} alt={item.fullname}
                                                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 cursor-pointer"
                                                            onClick={() => { setPreviewType('photo'); setPreviewUrl(item.photo_url); }} />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-[#50ad77]/10 flex items-center justify-center shrink-0">
                                                            <span className="text-[#50ad77] text-sm font-bold">{item.fullname.charAt(0).toUpperCase()}</span>
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-semibold text-slate-900 truncate">{item.fullname}</div>
                                                        <div className="text-sm text-[#50ad77] font-medium truncate">{item.career_title || 'Unknown Role'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-700">{item.email}</td>
                                            <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-700">{formatPhone(item.contact_number)}</td>
                                            <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-700">{item.qualification}</td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1.5">
                                                    {item.resume_url ? (
                                                        <button onClick={() => { setPreviewType('resume'); setPreviewUrl(item.resume_url); }}
                                                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                            Resume
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-slate-300">No resume</span>
                                                    )}
                                                    {item.photo_url && (
                                                        <button onClick={() => { setPreviewType('photo'); setPreviewUrl(item.photo_url); }}
                                                            className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                            Photo
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => setEditItem(item)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">Edit</button>
                                                    <button onClick={() => setDeleteTarget(item)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 p-4 border-t border-slate-100 bg-slate-50">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <span className="text-sm font-medium text-slate-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {editItem && <EditApplicationModal item={editItem} onClose={() => setEditItem(null)} onSaved={handleSaved} />}
            {deleteTarget && (
                <ConfirmModal
                    title="Delete Application"
                    message={`Are you sure you want to delete the application from "${deleteTarget.fullname}"? This action cannot be undone.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {previewUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setPreviewUrl(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-800 text-sm">{previewType === 'photo' ? 'Candidate Photo' : 'Resume'}</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const ext = previewType === 'photo' ? 'jpg' : 'pdf';
                                        downloadFile(previewUrl, `${previewType}.${ext}`);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#50ad77] hover:bg-[#3d9661] text-white text-xs font-semibold rounded-lg transition-colors"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download
                                </button>
                                <button onClick={() => setPreviewUrl(null)} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-50">
                            {previewType === 'photo' ? (
                                <img src={previewUrl} alt="Candidate" className="max-w-full max-h-[70vh] object-contain rounded-xl" />
                            ) : (
                                <iframe src={`${previewUrl}#toolbar=0`} title="Resume" className="w-full rounded-xl border border-slate-200" style={{ height: '70vh' }} />
                            )}
                        </div>
                    </div>
                </div>
            )
            }

            <style>{`
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slideUp { animation: slideUp 0.25s ease-out; }
            `}</style>
        </div >
    );
}