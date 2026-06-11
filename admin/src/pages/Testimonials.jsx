import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Star, Plus, X, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Search, Eye } from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/testimonials`;
const BRAND_COLOR = "#50ad77";

const countWords = (text) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
      />
    ))}
  </div>
);

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all duration-300 max-w-xs`}
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
      <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Testimonial</h3>
      <p className="text-gray-600 text-sm mb-6">
        Are you sure you want to delete{" "}
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

const TestimonialModal = ({ editData, onClose, onSaved }) => {
  const isEdit = !!editData;

  const [form, setForm] = useState({
    name: editData?.name || "",
    designation: editData?.designation || "",
    description: editData?.description || "",
    star_rating: editData?.star_rating || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const wordCount = countWords(form.description);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!form.designation.trim()) e.designation = "Designation is required.";
    else if (form.designation.trim().length < 2)
      e.designation = "Designation must be at least 2 characters.";
    if (!form.description.trim()) e.description = "Description is required.";
    else if (wordCount > 50) e.description = `Description exceeds 50 words (${wordCount} used).`;
    if (!form.star_rating) e.star_rating = "Please select a star rating.";
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
      if (isEdit) {
        await axios.put(`${API_URL}/${editData.id}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      onSaved(isEdit ? "Testimonial updated successfully!" : "Testimonial added successfully!");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6" onClick={handleBackdrop}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ backgroundColor: BRAND_COLOR }}
        >
          <h2 className="text-white font-bold text-lg">
            {isEdit ? "Edit Testimonial" : "Add Testimonial"}
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
              Star Rating <span className="text-red-500">*</span>
            </label>
            <select
              value={form.star_rating}
              onChange={(e) => handleChange("star_rating", e.target.value)}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${errors.star_rating
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-200 focus:ring-[#50ad77]/30 focus:border-[#50ad77]"
                }`}
            >
              <option value="">Select rating</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} {n} Star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            {errors.star_rating && (
              <p className="text-red-500 text-xs mt-1">{errors.star_rating}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Person Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Dr. Sarah Johnson"
              maxLength={100}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${errors.name
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-200 focus:ring-[#50ad77]/30 focus:border-[#50ad77]"
                }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              placeholder="e.g. Chief Medical Officer, Apollo Hospitals"
              maxLength={150}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${errors.designation
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-200 focus:ring-[#50ad77]/30 focus:border-[#50ad77]"
                }`}
            />
            {errors.designation && (
              <p className="text-red-500 text-xs mt-1">{errors.designation}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-1">(max 50 words)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Write the testimonial quote here..."
              rows={4}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition resize-none ${errors.description
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-200 focus:ring-[#50ad77]/30 focus:border-[#50ad77]"
                }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (
                <p className="text-red-500 text-xs">{errors.description}</p>
              ) : (
                <span />
              )}
              <span
                className={`text-xs font-medium ml-auto ${wordCount > 50
                  ? "text-red-500"
                  : wordCount >= 40
                    ? "text-yellow-500"
                    : "text-gray-400"
                  }`}
              >
                {wordCount}/50 words
              </span>
            </div>
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
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : null}
            {loading ? "Saving..." : isEdit ? "Update" : "Add Testimonial"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [testimonialToView, setTestimonialToView] = useState(null);
  const [toast, setToast] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const showToast = (message, type = "success") =>
    setToast({ message, type });

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTestimonials(res.data);
    } catch {
      showToast("Failed to load testimonials.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleSaved = (msg) => {
    setShowModal(false);
    setEditData(null);
    showToast(msg, "success");
    fetchTestimonials();
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowModal(true);
  };

  const handleView = (item) => {
    setTestimonialToView(item);
    setIsViewModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteTarget.id}`);
      setDeleteTarget(null);
      showToast("Testimonial deleted successfully!", "success");
      fetchTestimonials();
    } catch {
      showToast("Failed to delete testimonial.", "error");
    }
  };

  const filteredTestimonials = testimonials.filter((item) => {
    const nameText = item.name || '';
    const designationText = item.designation || '';
    const descriptionText = item.description || '';
    const query = searchQuery.toLowerCase();
    return (
      nameText.toLowerCase().includes(query) ||
      designationText.toLowerCase().includes(query) ||
      descriptionText.toLowerCase().includes(query)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTestimonials.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {showModal && (
        <TestimonialModal
          editData={editData}
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
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


      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Testimonials Management
            </h1>
          </div>
          <button
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200"
            style={{ backgroundColor: BRAND_COLOR }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Testimonial</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <h2 className="text-lg font-bold text-slate-800">Uploaded Testimonials</h2>
              <span className="bg-[#50ad77]/10 text-[#50ad77] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {filteredTestimonials.length} Total
              </span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search testimonials..."
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
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">
                    S.No
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">
                    Rating
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-48">
                    Person Name
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-48">
                    Designation
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[300px]">
                    Description
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-32 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-6"></div></td>
                      <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                      <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                      <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                      <td className="py-4 px-6"><div className=" bg-slate-200 rounded w-full"></div></td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                          <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : testimonials.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_COLOR}15` }}>
                          <Star className="w-8 h-8" style={{ color: BRAND_COLOR }} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No testimonials yet</h3>
                        <p className="text-slate-500 text-sm mb-6">Add your first testimonial to display on the homepage.</p>
                        <button
                          onClick={() => setShowModal(true)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:opacity-90"
                          style={{ backgroundColor: BRAND_COLOR }}
                        >
                          <Plus className="w-4 h-4" />
                          Add First Testimonial
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filteredTestimonials.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="w-8 h-8 opacity-20 text-[#50ad77]" />
                        <span className="text-sm font-medium text-slate-500">No matching testimonials found.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6 text-sm font-medium text-slate-500">
                        {indexOfFirstItem + index + 1}.
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < item.star_rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-200"
                                }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-slate-800">
                        {item.name}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium" style={{ color: BRAND_COLOR }}>
                        {item.designation}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 max-w-md whitespace-normal break-words align-top">
                        "{item.description}"
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(item)}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-[#50ad77] hover:text-white rounded-lg font-bold text-xs transition-colors"
                          >
                            View
                          </button>
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

      {isViewModalOpen && testimonialToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6" onClick={() => setIsViewModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Eye className="text-[#50ad77]" /> View Testimonial
              </h3>
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Star Rating</label>
                  <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm font-semibold text-slate-800 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonialToView.star_rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Person Name</label>
                  <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm font-bold text-slate-800">
                    {testimonialToView.name}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Designation</label>
                <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm font-semibold text-[#50ad77]">
                  {testimonialToView.designation}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  "{testimonialToView.description}"
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;