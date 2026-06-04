import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

const MAX_BANNER_IMAGE_SIZE = 3 * 1024 * 1024;
const BANNER_WORD_LIMITS = {
  tag: 3,
  title: 6,
  description: 20
};

const getWordCount = (value = "") =>
  value.trim() ? value.trim().split(/\s+/).length : 0;

const getWordLimitError = (label, value, limit) =>
  getWordCount(value) > limit ? `${label} must be ${limit} words or below.` : "";

export default function Banner() {
  const [slides, setSlides] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);
  const [draftSlides, setDraftSlides] = useState(slides);
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    const fetchCurrentBannerData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/banner/hero-content`
        );
        if (!response.ok) {
          toast.error("Failed to fetch banner data");
          return;
        }
        const data = await response.json();
        const structuredData = (data || []).map((slide, index) => ({
          ...slide,
          id: index + 1,
          uploadType: "file",
          isSaved: true, 
        }));
        const fixedSlides =
          structuredData.length > 0
            ? structuredData
            : [
              {
                id: Date.now(),
                tag: "",
                title: "",
                description: "",
                image: "",
                uploadType: "file",
                isSaved: false,
              },
            ];
        setSlides(fixedSlides);
        setDraftSlides(fixedSlides); 
        setFailedImages({});
      } catch (error) {
        console.log(error);
        toast.warning("Using local storage fallback");
      }
    };
    fetchCurrentBannerData();
  }, []);

  const handleInputChange = (field, value) => {
    setDraftSlides((prev) => {
      const updated = prev.map((slide, index) =>
        index === activeTab ? { ...slide, [field]: value } : slide
      );
      return updated;
    });
  };

  const openForm = () => {
    setDraftSlides(slides);
    setActiveTab((prev) => Math.min(prev, Math.max(slides.length - 1, 0)));
    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setDraftSlides(slides);
    setErrors({});
    setShowForm(false);
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: Date.now(),
      tag: "",
      title: "",
      description: "",
      image: "",
      uploadType: "file",
      isSaved: false
    };
    const updated = [...draftSlides, newSlide];
    setDraftSlides(updated);
    setActiveTab(updated.length - 1);
  };

  const handleRemoveSlide = async (slideIndex = activeTab) => {
    const slideToRemove = draftSlides[slideIndex];

    if (draftSlides.length <= 1) {
      toast.error("You must have at least one slide.");
      return;
    }

    const updatedSlides = draftSlides.filter((_, idx) => idx !== slideIndex);
    setDraftSlides(updatedSlides);
    setActiveTab((prev) => {
      if (prev === slideIndex) return 0;
      if (prev > slideIndex) return prev - 1;
      return prev;
    });

    if (!slideToRemove?.isSaved) {
      toast.success("Draft slide removed");
      return;
    }

    setSlides(updatedSlides);
    const wasSynced = await syncWithBackend(updatedSlides);
    if (wasSynced) {
      toast.success("Slide deleted successfully");
    } else {
      toast.warning("Slide deleted locally");
    }
  };

  const validateSlide = (slide) => {
    let newErrors = {};
    if (!slide?.tag?.trim()) newErrors.tag = "Tag is required.";
    else {
      const tagLimitError = getWordLimitError("Tag", slide.tag, BANNER_WORD_LIMITS.tag);
      if (tagLimitError) newErrors.tag = tagLimitError;
    }
    if (!slide?.title?.trim()) newErrors.title = "Title is required.";
    else {
      const titleLimitError = getWordLimitError("Title", slide.title, BANNER_WORD_LIMITS.title);
      if (titleLimitError) newErrors.title = titleLimitError;
    }
    if (!slide?.description?.trim()) newErrors.description = "Description is required.";
    else {
      const descLimitError = getWordLimitError("Description", slide.description, BANNER_WORD_LIMITS.description);
      if (descLimitError) newErrors.description = descLimitError;
    }
    if (!slide?.image) {
      newErrors.image = "Please upload an image file.";
    }
    return newErrors;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Only image files allowed" }));
      toast.error("Only image files are allowed");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BANNER_IMAGE_SIZE) {
      setErrors((prev) => ({ ...prev, image: "Max 3MB image allowed" }));
      toast.error("Image size must be 3MB or below");
      e.target.value = "";
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/banner/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        handleInputChange("image", data.imageUrl);
        handleInputChange("uploadType", "file");
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Image upload failed");
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, image: "Server error during upload" }));
    }
  };

  const syncWithBackend = async (updatedSlides) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/banner/hero-content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSlides),
      });
      return response.ok;
    } catch (error) {
      console.error("Backend synchronization error:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    for (let i = 0; i < draftSlides.length; i++) {
      const err = validateSlide(draftSlides[i]);
      if (Object.keys(err).length > 0) {
        setActiveTab(i);
        setErrors(err);
        toast.warning(`Fix Slide ${i + 1}`);
        setIsSubmitting(false);
        return;
      }
    }
    const updatedSlides = draftSlides.map(s => ({
      ...s,
      isSaved: true
    }));
    const wasSynced = await syncWithBackend(updatedSlides);
    if (wasSynced) {
      setSlides(updatedSlides);
      setDraftSlides(updatedSlides);
      setShowForm(false);
      toast.success("Banner updated successfully");
    } else {
      toast.error("Banner save failed");
    }
    setIsSubmitting(false);
  };

  const handleEditTrigger = (index) => {
    setDraftSlides(slides);
    setActiveTab(index);
    setErrors({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const slide = draftSlides[activeTab] || { tag: "", title: "", description: "", image: "", uploadType: "file" };
  const previewImage = slide.image || slide.image_path;

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    const cleanPath = img.startsWith("/") ? img : `/${img}`;
    return `${import.meta.env.VITE_API_BASE_URL}${cleanPath}`;
  };

  const markImageFailed = (key) => {
    setFailedImages((prev) => ({ ...prev, [key]: true }));
  };

  const indexOfLastSlide = currentPage * itemsPerPage;
  const indexOfFirstSlide = indexOfLastSlide - itemsPerPage;
  const currentSlides = slides.slice(indexOfFirstSlide, indexOfLastSlide);
  const totalPages = Math.ceil(slides.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 font-sans w-full min-h-screen bg-slate-50/50">
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Banner Management</h2>
          <p className="text-[#50ad77] font-medium mt-1">Manage hero section slides</p>
        </div>
        <button
          type="button"
          className="px-6 py-2.5 bg-[#50ad77] text-white font-bold rounded-xl hover:bg-[#439665] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-lg shadow-[#50ad77]/20"
          onClick={() => (showForm ? closeForm() : openForm())}
        >
          {showForm ? "Close Form" : "+ Add Banners"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-700">Current Active Live Banners Workspace</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold w-16">S.No.</th>
                <th className="px-6 py-4 font-bold w-48">Image</th>
                <th className="px-6 py-4 font-bold w-48">Tag</th>
                <th className="px-6 py-4 font-bold w-64">Title</th>
                <th className="px-6 py-4 font-bold">Description</th>
                <th className="px-6 py-4 font-bold w-32 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentSlides.map((item, index) => {
                const absoluteIndex = indexOfFirstSlide + index;
                const imageKey = `slide-${item.id || absoluteIndex}`;
                return (
                <tr key={item.id || absoluteIndex} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-slate-500">{absoluteIndex + 1}.</td>
                  <td className="px-6 py-4">
                    <div className="w-32 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      {item.image && !failedImages[imageKey] ? (
                        <img
                          src={getImageUrl(item.image || item.image_path)}
                          alt={item.tag || item.title}
                          className="w-full h-full object-cover"
                          onError={() => markImageFailed(imageKey)}
                        />
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          <ImageIcon size={18} />
                          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">No Image</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#50ad77] text-sm font-bold tracking-wide">{item.tag || "Untitled Slide Asset"}</td>
                  <td className="px-6 py-4">
                    <strong className="text-slate-800 text-sm whitespace-normal line-clamp-2">{item.title}</strong>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-500 text-sm whitespace-normal line-clamp-2">{item.description || "No description loaded."}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button type="button" className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg font-bold text-xs transition-colors" onClick={() => handleEditTrigger(absoluteIndex)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg font-bold text-xs transition-colors"
                        onClick={() =>
                          setPendingDelete(() => () => handleRemoveSlide(absoluteIndex))
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
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

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto" onClick={closeForm}>
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 font-bold transition-colors z-10" onClick={closeForm}>&times;</button>
            
            <div className="p-8 pb-6 border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Banner Slides</h2>
              <p className="text-slate-500 text-sm mt-1 font-medium">Add, edit, or remove hero section banners</p>
            </div>
            
            <div className="px-8 pt-6 flex flex-wrap gap-2 items-end">
              {draftSlides.map((s, idx) => (
                <div key={s.id || idx} className="flex items-center gap-1 group/tab relative">
                  <button
                    type="button"
                    className={`px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all ${activeTab === idx ? "bg-white border-t-2 border-x-2 border-slate-100 border-b-white text-[#50ad77] z-10 translate-y-[2px]" : "bg-slate-50 border-t-2 border-x-2 border-transparent text-slate-500 hover:bg-slate-100"}`}
                    onClick={() => setActiveTab(idx)}
                  >
                    Slide {idx + 1}
                  </button>
                  {!s.isSaved && (
                    <button
                      type="button"
                      onClick={() => setPendingDelete(() => () => handleRemoveSlide(idx))}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold hover:bg-red-600 hover:scale-110 transition-all shadow-md opacity-0 group-hover/tab:opacity-100 z-20"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-[#50ad77] hover:text-white transition-colors ml-2 mb-[2px]"
                onClick={handleAddSlide}
              >
                + Add Slide
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 border-t-2 border-slate-100 bg-white rounded-b-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide uppercase">Tag</label>
                  <input
                    type="text"
                    value={slide.tag}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.tag ? "border-red-300 focus:border-red-500 bg-red-50" : "border-slate-100 focus:border-[#50ad77] bg-slate-50 focus:bg-white"} focus:ring-0 outline-none transition-all font-medium text-slate-700`}
                    onChange={(e) => handleInputChange("tag", e.target.value)}
                    placeholder="Enter tag (e.g. SPECIAL OFFER)"
                  />
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-slate-400 font-medium">{getWordCount(slide.tag)}/{BANNER_WORD_LIMITS.tag} words</span>
                    {errors.tag && <span className="text-red-500 font-bold">{errors.tag}</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide uppercase">Title</label>
                  <input
                    type="text"
                    value={slide.title}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.title ? "border-red-300 focus:border-red-500 bg-red-50" : "border-slate-100 focus:border-[#50ad77] bg-slate-50 focus:bg-white"} focus:ring-0 outline-none transition-all font-medium text-slate-700`}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter main title"
                  />
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-slate-400 font-medium">{getWordCount(slide.title)}/{BANNER_WORD_LIMITS.title} words</span>
                    {errors.title && <span className="text-red-500 font-bold">{errors.title}</span>}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide uppercase">Description</label>
                  <textarea
                    value={slide.description}
                    rows="3"
                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.description ? "border-red-300 focus:border-red-500 bg-red-50" : "border-slate-100 focus:border-[#50ad77] bg-slate-50 focus:bg-white"} focus:ring-0 outline-none transition-all resize-y font-medium text-slate-700`}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter a brief description..."
                  />
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-slate-400 font-medium">{getWordCount(slide.description)}/{BANNER_WORD_LIMITS.description} words</span>
                    {errors.description && <span className="text-red-500 font-bold">{errors.description}</span>}
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 tracking-wide uppercase">Upload Image</label>
                  <div className={`flex items-center gap-4 p-4 rounded-xl border-2 border-dashed ${errors.image ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50"} transition-colors`}>
                    <input
                      type="file"
                      accept="image/*"
                      className={`block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#50ad77]/10 file:text-[#50ad77] hover:file:bg-[#50ad77]/20 file:transition-colors file:cursor-pointer cursor-pointer ${errors.image ? "text-red-500" : ""}`}
                      onChange={handleFileChange}
                    />
                    <span className="text-xs text-slate-400 font-bold tracking-wider uppercase whitespace-nowrap bg-white px-2 py-1 rounded-md shadow-sm">Max 3MB</span>
                  </div>
                  {errors.image && <span className="text-xs text-red-500 font-bold block">{errors.image}</span>}
                  
                  {previewImage && (
                    <div className="mt-6">
                      <label className="block text-xs font-bold text-slate-400 tracking-wide uppercase mb-3">Image Preview</label>
                      <div className="w-full h-[300px] rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-50 relative group">
                        {failedImages[`preview-${activeTab}-${previewImage}`] ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                            <ImageIcon size={32} />
                            <span className="text-xs font-bold uppercase tracking-wider mt-2">No Image</span>
                          </div>
                        ) : (
                          <img
                            src={getImageUrl(previewImage)}
                            alt={slide.tag || "Banner preview"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={() => markImageFailed(`preview-${activeTab}-${previewImage}`)}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit" 
                  className="px-8 py-3.5 bg-[#50ad77] text-white font-black rounded-xl hover:bg-[#439665] hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-xl shadow-[#50ad77]/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm tracking-wide uppercase flex items-center gap-2" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : "Save Banners"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DeleteConfirmModal
        isOpen={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          const deleteAction = pendingDelete;
          setPendingDelete(null);
          deleteAction?.();
        }}
      />
    </div>
  );
}
