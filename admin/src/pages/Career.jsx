import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const COLOR_PRESETS = [
    { label: 'Blue → Cyan', from: 'from-blue-500', to: 'to-cyan-400' },
    { label: 'Green → Teal', from: 'from-emerald-500', to: 'to-teal-400' },
    { label: 'Purple → Indigo', from: 'from-purple-500', to: 'to-indigo-400' },
    { label: 'Orange → Amber', from: 'from-orange-500', to: 'to-amber-400' },
    { label: 'Slate → Gray', from: 'from-slate-600', to: 'to-slate-400' },
    { label: 'Rose → Pink', from: 'from-rose-500', to: 'to-pink-400' },
    { label: 'Violet → Purple', from: 'from-violet-500', to: 'to-purple-400' },
    { label: 'Sky → Blue', from: 'from-sky-500', to: 'to-blue-400' },
];

const EMPTY_FORM = {
    title: '',
    description: '',
    color_from: 'from-blue-500',
    color_to: 'to-cyan-400',
    display_order: 0,
    is_active: 1,
};

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    const colors = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white shadow-2xl text-sm font-medium ${colors[type] || colors.info} animate-slideUp`}>
            {type === 'success' && (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            )}
            {type === 'error' && (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )}
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

function ConfirmModal({ title, message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-5">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm mb-7">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function OpportunityModal({ item, onClose, onSaved }) {
    const isEdit = Boolean(item?.id);
    const [form, setForm] = useState(item ? { ...item } : { ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Title is required';
        if (!form.description.trim()) e.description = 'Description is required';
        return e;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleColorPreset = (preset) => {
        setForm((prev) => ({ ...prev, color_from: preset.from, color_to: preset.to }));
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setSaving(true);
        try {
            const url = isEdit ? `${API_BASE}/api/career/${item.id}` : `${API_BASE}/api/career`;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message);
            onSaved(json.data, isEdit ? 'updated' : 'created');
        } catch (err) {
            setErrors({ submit: err.message });
        } finally {
            setSaving(false);
        }
    };

    const selectedPreset = COLOR_PRESETS.find(
        (p) => p.from === form.color_from && p.to === form.color_to
    );

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
                <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Opportunity' : 'Add New Opportunity'}</h2>
                        <p className="text-sm text-slate-500 mt-0.5">{isEdit ? `Editing: ${item.title}` : 'Fill in the details below'}</p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-8 py-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Nursing, Clinicians..."
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/40 transition ${errors.title ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                        />
                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Brief description of this career category..."
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/40 transition resize-none ${errors.description ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Accent Color</label>
                        <div className="flex flex-wrap gap-2">
                            {COLOR_PRESETS.map((preset) => (
                                <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => handleColorPreset(preset)}
                                    title={preset.label}
                                    className={`h-7 w-16 rounded-lg bg-gradient-to-r ${preset.from} ${preset.to} transition-all ${selectedPreset?.label === preset.label
                                        ? 'ring-2 ring-offset-2 ring-slate-400 scale-105'
                                        : 'opacity-70 hover:opacity-100'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5">Selected: {selectedPreset?.label || 'Custom'}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Display Order</label>
                            <input
                                type="number"
                                name="display_order"
                                value={form.display_order}
                                onChange={handleChange}
                                min={0}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/40"
                            />
                            <p className="text-xs text-slate-400 mt-1">Lower numbers appear first</p>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Visibility</label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={form.is_active === 1}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-[#50ad77]' : 'bg-slate-200'}`} />
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
                                </div>
                                <span className="text-sm text-slate-600 group-hover:text-slate-800">
                                    {form.is_active ? 'Active (visible on site)' : 'Inactive (hidden)'}
                                </span>
                            </label>
                        </div>
                    </div>

                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                            {errors.submit}
                        </div>
                    )}
                </div>

                <div className="px-8 pb-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-1 sm:flex-none px-8 py-2.5 text-sm font-semibold text-white bg-[#50ad77] rounded-xl hover:bg-[#3d9661] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {saving && (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        )}
                        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Opportunity'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function OpportunityRow({ item, index, onEdit, onDelete, onToggle }) {
    return (
        <tr className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {index + 1}.
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-bold text-slate-900">{item.title}</div>
                <div className="text-sm text-slate-500 mt-1 line-clamp-2 max-w-md">{item.description}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {item.display_order}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onToggle(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${item.is_active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                    >
                        {item.is_active ? 'Inactivate' : 'Activate'}
                    </button>
                    <button
                        onClick={() => onEdit(item)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function Career() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalItem, setModalItem] = useState(undefined);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchOpportunities = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/career`);
            const json = await res.json();
            if (json.success) {
                setOpportunities(json.data || []);
            }
        } catch (error) {
            setToast({ message: 'Failed to load opportunities', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOpportunities();
    }, [fetchOpportunities]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const handleSaved = (savedItem, action) => {
        setModalItem(undefined);
        fetchOpportunities();
        setToast({ message: `Opportunity ${action} successfully!`, type: 'success' });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            const res = await fetch(`${API_BASE}/api/career/${deleteTarget.id}`, { method: 'DELETE' });
            const json = await res.json();
            if (!json.success) throw new Error(json.message);
            setToast({ message: 'Opportunity deleted successfully!', type: 'success' });
            fetchOpportunities();
        } catch (err) {
            setToast({ message: err.message || 'Failed to delete', type: 'error' });
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleToggleActive = async (item) => {
        try {
            const res = await fetch(`${API_BASE}/api/career/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...item, is_active: item.is_active ? 0 : 1 })
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message);
            fetchOpportunities();
            setToast({ message: `Opportunity ${item.is_active ? 'deactivated' : 'activated'}`, type: 'success' });
        } catch (err) {
            setToast({ message: err.message || 'Failed to toggle status', type: 'error' });
        }
    };

    const filtered = opportunities.filter(o => 
        o.title.toLowerCase().includes(search.toLowerCase()) || 
        o.description.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = opportunities.filter(o => o.is_active === 1).length;
    const inactiveCount = opportunities.length - activeCount;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-[#50ad77] rounded-xl flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-base font-bold text-slate-900 truncate">Career Management</h1>
                            <p className="text-xs text-slate-400 hidden sm:block">Manage job category cards shown on the website</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setModalItem(null)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#50ad77] rounded-xl hover:bg-[#3d9661] transition-colors shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Add Career</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {[
                        { label: 'Total', value: opportunities.length, color: 'text-slate-700', bg: 'bg-slate-100' },
                        { label: 'Active', value: activeCount, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                        { label: 'Inactive', value: inactiveCount, color: 'text-slate-500', bg: 'bg-slate-50' },
                    ].map((s) => (
                        <div key={s.label} className={`${s.bg} rounded-2xl p-4 sm:p-5`}>
                            <p className={`text-2xl sm:text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
                <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by title or description…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/30 focus:border-[#50ad77]"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-slate-100" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="font-semibold text-slate-700">
                            {search ? 'No results found' : 'No opportunities yet'}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            {search ? 'Try a different keyword' : 'Click "Add Career" to create one'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">S.No</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title & Description</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {currentItems.map((item, index) => (
                                        <OpportunityRow
                                            key={item.id}
                                            item={item}
                                            index={indexOfFirstItem + index}
                                            onEdit={setModalItem}
                                            onDelete={setDeleteTarget}
                                            onToggle={handleToggleActive}
                                        />
                                    ))}
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

            {modalItem !== undefined && (
                <OpportunityModal
                    item={modalItem}
                    onClose={() => setModalItem(undefined)}
                    onSaved={handleSaved}
                />
            )}

            {deleteTarget && (
                <ConfirmModal
                    title="Delete Opportunity"
                    message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}

            <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.25s ease-out; }
      `}</style>
        </div>
    );
}
