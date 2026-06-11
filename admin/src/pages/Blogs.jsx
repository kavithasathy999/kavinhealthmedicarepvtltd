import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { LuUpload, LuTrash2, LuImage, LuPen, LuX, LuSearch, LuEye } from 'react-icons/lu';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [blogDate, setBlogDate] = useState('');
  const [readTime, setReadTime] = useState('1 Minute Read');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [blogToEdit, setBlogToEdit] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [blogToView, setBlogToView] = useState(null);
  const blogsPerPage = 8;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/blogs`);
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleFileChange = (e, isEdit = false) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 3 * 1024 * 1024) {
        toast.error('Image size must be 3MB or less.');
        e.target.value = null;
        return;
      }
      if (isEdit) {
        setEditFile(selectedFile);
        setEditPreview(URL.createObjectURL(selectedFile));
      } else {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      }
    }
  };

  const countWords = (str) => {
    return str.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning('Please select an image first.');
      return;
    }
    if (countWords(title) > 10) {
      toast.warning('Title cannot exceed 10 words.');
      return;
    }
    if (countWords(description) > 500) {
      toast.warning('Description cannot exceed 500 words.');
      return;
    }
    if (!blogDate) {
      toast.warning('Please select a date.');
      return;
    }

    const formData = new FormData();
    formData.append('blog_date', blogDate);
    formData.append('read_time', readTime);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('meta_title', metaTitle);
    formData.append('meta_description', metaDescription);
    formData.append('meta_keywords', metaKeywords);
    formData.append('image', file);

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/blogs`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast.success('Blog added successfully!');
        resetAddForm();
        fetchBlogs();
      } else {
        toast.error('Failed to add blog.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error.');
    } finally {
      setLoading(false);
    }
  };

  const resetAddForm = () => {
    setFile(null);
    setPreview(null);
    setBlogDate('');
    setReadTime('1 Minute Read');
    setTitle('');
    setDescription('');
    setMetaTitle('');
    setMetaDescription('');
    setMetaKeywords('');
    setIsAddModalOpen(false);
  };

  const confirmDelete = (blog) => {
    setBlogToDelete(blog);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;
    try {
      const res = await fetch(`${baseUrl}/api/blogs/${blogToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Blog deleted successfully!');
        setIsDeleteModalOpen(false);
        setBlogToDelete(null);
        fetchBlogs();
      } else {
        toast.error('Failed to delete blog.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error.');
    }
  };

  const openEditModal = (blog) => {
    setBlogToEdit(blog);
    setBlogDate(blog.blog_date ? blog.blog_date.split('T')[0] : '');
    setReadTime(blog.read_time || '1 Minute Read');
    setTitle(blog.title || '');
    setDescription(blog.description || '');
    setMetaTitle(blog.meta_title || '');
    setMetaDescription(blog.meta_description || '');
    setMetaKeywords(blog.meta_keywords || '');
    setEditFile(null);
    setEditPreview(`${baseUrl}${blog.image_url}`);
    setIsEditModalOpen(true);
  };

  const openViewModal = (blog) => {
    setBlogToView(blog);
    setIsViewModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (countWords(title) > 10) {
      toast.warning('Title cannot exceed 10 words.');
      return;
    }
    if (countWords(description) > 500) {
      toast.warning('Description cannot exceed 500 words.');
      return;
    }
    if (!blogDate) {
      toast.warning('Please select a date.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('blog_date', blogDate);
    formData.append('read_time', readTime);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('meta_title', metaTitle);
    formData.append('meta_description', metaDescription);
    formData.append('meta_keywords', metaKeywords);
    if (editFile) {
      formData.append('image', editFile);
    }

    try {
      const res = await fetch(`${baseUrl}/api/blogs/${blogToEdit.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        toast.success('Blog updated successfully!');
        setIsEditModalOpen(false);
        setBlogToEdit(null);
        fetchBlogs();
      } else {
        toast.error('Failed to update blog.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const titleText = blog.title || '';
    const descriptionText = blog.description || '';
    const readTimeText = blog.read_time || '';
    const query = searchQuery.toLowerCase();
    return (
      titleText.toLowerCase().includes(query) ||
      descriptionText.toLowerCase().includes(query) ||
      readTimeText.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);

  return (
    <>
      <div className="p-6 md:p-8 space-y-8 animate-fade-in relative">
        <ToastContainer position='top-right' autoClose={1500} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Blogs Management
            </h1>
            <p className="text-sm text-[#50ad77] mt-1">
              Create and manage premium articles.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#50ad77] hover:bg-[#419263] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#50ad77]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 w-full md:w-auto shrink-0"
          >
            <LuUpload className="w-4 h-4" /> Add Blogs
          </button>
        </div>

        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <h2 className="text-lg font-bold text-slate-800">Published Blogs</h2>
                <span className="bg-[#50ad77]/10 text-[#50ad77] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {filteredBlogs.length} items
                </span>
              </div>
              <div className="relative w-full sm:w-64">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/20 focus:border-[#50ad77] font-medium"
                />
              </div>
            </div>

            {blogs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
                <LuImage className="w-10 h-10 opacity-20" />
                <p className="text-sm font-medium">No blogs published yet.</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
                <LuSearch className="w-10 h-10 opacity-20 text-[#50ad77]" />
                <p className="text-sm font-medium">No matching blogs found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-14">S.No</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Image</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Date</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-28 whitespace-nowrap">Read Time</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-28 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedBlogs.map((blog, index) => (
                      <tr key={blog.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-slate-500 whitespace-nowrap">
                          {(currentPage - 1) * blogsPerPage + index + 1}.
                        </td>
                        <td className="py-3 px-4">
                          <div className="h-11 w-16 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                            <img src={`${baseUrl}${blog.image_url}`} alt={blog.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                          {blog.blog_date ? new Date(blog.blog_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-slate-800 max-w-xs">
                          <span className="line-clamp-1" title={blog.title}>{blog.title}</span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium whitespace-nowrap" style={{ color: '#50ad77' }}>
                          {blog.read_time}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openViewModal(blog)}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-[#50ad77] hover:text-white rounded-lg font-bold text-xs transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openEditModal(blog)}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg font-bold text-xs transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => confirmDelete(blog)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg font-bold text-xs transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-4 border-t border-slate-100 mt-2">
                    <p className="text-xs text-slate-500">
                      Showing {(currentPage - 1) * blogsPerPage + 1}–{Math.min(currentPage * blogsPerPage, filteredBlogs.length)} of {filteredBlogs.length} blogs
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 text-xs font-bold rounded-lg transition-colors ${currentPage === page
                            ? 'bg-[#50ad77] text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Blog</h3>
            <p className="text-slate-600 mb-6">Are you sure want to delete?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )
      }


      {
        isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <LuUpload className="text-[#50ad77]" /> Add New Blog
                </h3>
                <button onClick={resetAddForm} className="text-slate-400 hover:text-slate-600">
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={blogDate}
                      onChange={(e) => setBlogDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#50ad77] focus:ring-2 focus:ring-[#50ad77]/20 outline-none transition-all text-sm text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Read Time</label>
                    <select
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#50ad77] focus:ring-2 focus:ring-[#50ad77]/20 outline-none transition-all text-sm text-slate-700"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={`${i + 1} Minute${i > 0 ? 's' : ''} Read`}>
                          {i + 1} Minute{i > 0 ? 's' : ''} Read
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Title (Max 10 words) <span className="text-xs text-slate-400 ml-2">{countWords(title)}/10</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter blog title"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#50ad77] focus:ring-2 focus:ring-[#50ad77]/20 outline-none transition-all text-sm text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description (Max 500 words) <span className="text-xs text-slate-400 ml-2">{countWords(description)}/500</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write description..."
                    rows="4"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#50ad77] focus:ring-2 focus:ring-[#50ad77]/20 outline-none transition-all text-sm text-slate-700 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    maxLength={25}
                    placeholder="SEO Meta Title"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#50ad77] focus:ring-2 focus:ring-[#50ad77]/20 outline-none transition-all text-sm text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Description</label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="SEO Meta Description"
                    rows="2"
                    maxLength={50}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#50ad77] focus:ring-2 focus:ring-[#50ad77]/20 outline-none transition-all text-sm text-slate-700 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    maxLength={25}
                    placeholder="SEO Meta Keywords (comma separated)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#50ad77] focus:ring-2 focus:ring-[#50ad77]/20 outline-none transition-all text-sm text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Blog Image (Max 3MB)</label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, false)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-40 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2 group-hover:border-[#50ad77] group-hover:bg-[#50ad77]/5 transition-all">
                      {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-contain p-2 rounded-xl" />
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#50ad77] group-hover:scale-110 transition-all">
                            <LuImage className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-medium text-slate-500 group-hover:text-[#50ad77]">Click to browse</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={resetAddForm}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-[#50ad77] hover:bg-[#419263] text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-[#50ad77]/20 disabled:opacity-70 flex items-center gap-2"
                  >
                    {loading ? 'Adding...' : 'Add Blog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {
        isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <LuPen className="text-blue-500" /> Edit Blog
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={blogDate}
                      onChange={(e) => setBlogDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Read Time</label>
                    <select
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm text-slate-700"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={`${i + 1} Minute${i > 0 ? 's' : ''} Read`}>
                          {i + 1} Minute{i > 0 ? 's' : ''} Read
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Title (Max 10 words) <span className="text-xs text-slate-400 ml-2">{countWords(title)}/10</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description (Max 500 words) <span className="text-xs text-slate-400 ml-2">{countWords(description)}/500</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm text-slate-700 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    maxLength={25}
                    placeholder="SEO Meta Title"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Description</label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="SEO Meta Description"
                    rows="2"
                    maxLength={50}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm text-slate-700 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    maxLength={25}
                    placeholder="SEO Meta Keywords (comma separated)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Update Image (Optional, Max 3MB)</label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, true)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-40 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all">
                      {editPreview ? (
                        <img src={editPreview} alt="Preview" className="w-full h-full object-contain p-2 rounded-xl" />
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-all">
                            <LuImage className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-medium text-slate-500 group-hover:text-blue-500">Click to browse new image</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-70 flex items-center gap-2"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {isViewModalOpen && blogToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setIsViewModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <LuEye className="text-[#50ad77]" /> View Blog Details
              </h3>
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors text-xl font-bold animate-fade-in"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              {blogToView.image_url && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Blog Image</label>
                  <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative">
                    <img
                      src={`${baseUrl}${blogToView.image_url}`}
                      alt={blogToView.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                  <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm font-semibold text-slate-800">
                    {blogToView.blog_date ? new Date(blogToView.blog_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Read Time</label>
                  <div>
                    <span className="bg-[#50ad77]/10 text-[#50ad77] px-4 py-2.5 rounded-xl text-sm font-bold inline-block">
                      {blogToView.read_time}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Blog Title</label>
                <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm font-bold text-slate-800">
                  {blogToView.title}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {blogToView.description}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">SEO Meta Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Meta Title</label>
                    <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm text-slate-700 font-medium">
                      {blogToView.meta_title || '—'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Meta Keywords</label>
                    <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm text-slate-700 font-medium">
                      {blogToView.meta_keywords || '—'}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Meta Description</label>
                    <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {blogToView.meta_description || '—'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
