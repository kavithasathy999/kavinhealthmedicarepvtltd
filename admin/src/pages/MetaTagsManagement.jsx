import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Search, Plus, Edit2, Trash2, Globe, Eye } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const PAGE_ROUTES = [
  { value: '/', label: 'Home' },
  { value: '/aboutus', label: 'About Us' },
  { value: '/career', label: 'Career' },
  { value: '/services', label: 'Services' },
  { value: '/resourcerepository', label: 'Resource Repository' },
  { value: '/blogsandarticles', label: 'Blogs and Articles' },
  { value: '/contact', label: 'Contact' }
];

export default function MetaTagsManagement() {
  const [metaTags, setMetaTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [services, setServices] = useState([]);
  
  const [formData, setFormData] = useState({
    page_route: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState('');

  const createSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

  useEffect(() => {
    fetchMetaTags();
    fetchServices();
  }, []);

  const fetchMetaTags = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/meta-tags`);
      const json = await res.json();
      if (json.success) {
        setMetaTags(json.data);
      } else {
        toast.error(json.message || "Failed to fetch meta tags");
      }
    } catch (err) {
      toast.error("Error fetching meta tags");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/services`);
      const json = await res.json();
      if (json.success) {
        setServices(json.services || []);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  // Sync form inputs when page_route changes inside the modal
  useEffect(() => {
    if (!isModalOpen) return;
    if (!formData.page_route) {
      setSelectedTag(null);
      setFormData(prev => ({
        ...prev,
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
      }));
      return;
    }

    const existing = metaTags.find(tag => tag.page_route === formData.page_route);
    if (existing) {
      setSelectedTag(existing);
      setFormData(prev => ({
        ...prev,
        meta_title: existing.meta_title || '',
        meta_description: existing.meta_description || '',
        meta_keywords: existing.meta_keywords || ''
      }));
    } else {
      setSelectedTag(null);
      setFormData(prev => ({
        ...prev,
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
      }));
    }
  }, [formData.page_route, isModalOpen, metaTags]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setSelectedTag(null);
    setFormData({ page_route: '', meta_title: '', meta_description: '', meta_keywords: '' });
    setIsModalOpen(true);
  };

  const openViewModal = (tag) => {
    setSelectedTag(tag);
    setIsViewModalOpen(true);
  };

  const openEditModal = (tag) => {
    setSelectedTag(tag);
    setFormData({
      page_route: tag.page_route,
      meta_title: tag.meta_title,
      meta_description: tag.meta_description,
      meta_keywords: tag.meta_keywords
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (tag) => {
    setSelectedTag(tag);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.page_route.startsWith('/')) {
      toast.error("Page route must start with '/' (e.g., '/about')");
      return;
    }

    try {
      const url = selectedTag 
        ? `${API_BASE}/api/meta-tags/${selectedTag.id}` 
        : `${API_BASE}/api/meta-tags`;
      const method = selectedTag ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        setIsModalOpen(false);
        fetchMetaTags();
      } else {
        toast.error(json.message || "Error saving meta tags");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/meta-tags/${selectedTag.id}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        setIsDeleteModalOpen(false);
        fetchMetaTags();
      } else {
        toast.error(json.message || "Error deleting meta tag");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    }
  };

  const getPageRouteName = (route) => {
    const matchedRoute = PAGE_ROUTES.find(r => r.value === route);
    if (matchedRoute) return matchedRoute.label;

    if (route.startsWith('/services/')) {
      const slug = route.split('/').pop();
      const matchedService = services.find(s => createSlug(s.title) === slug);
      if (matchedService) return matchedService.title;
    }

    return route;
  };

  const mainRoute = formData.page_route.startsWith('/services') ? '/services' : formData.page_route;
  const serviceRoute = formData.page_route.startsWith('/services') ? formData.page_route : '';

  const filteredTags = metaTags.filter(tag => {
    const route = tag?.page_route || '';
    const title = tag?.meta_title || '';
    const description = tag?.meta_description || '';
    const keywords = tag?.meta_keywords || '';
    const query = searchQuery || '';
    return route.toLowerCase().includes(query.toLowerCase()) ||
           title.toLowerCase().includes(query.toLowerCase()) ||
           description.toLowerCase().includes(query.toLowerCase()) ||
           keywords.toLowerCase().includes(query.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTags = filteredTags.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in relative bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            SEO Meta Tags
          </h1>
          <p className="text-sm text-[#50ad77] mt-1">
            Manage meta titles, descriptions, and keywords for dynamic SEO across all pages.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#50ad77] hover:bg-[#419263] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#50ad77]/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Meta Tag
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by route, title, description or keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/20 focus:border-[#50ad77]"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#50ad77]"></div>
          </div>
        ) : currentTags.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">No meta tags found</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by creating a new meta tag for a route.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-100">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">S.No</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Page Route</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Meta Title</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Meta Description</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Meta Keywords</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentTags.map((tag, index) => (
                  <tr key={tag.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-500 font-medium">
                      {indexOfFirstItem + index + 1}.
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800">
                          {getPageRouteName(tag.page_route)}
                        </span>                       
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-slate-800 truncate max-w-[200px]" title={tag.meta_title}>
                      {tag.meta_title}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500 truncate max-w-[300px]" title={tag.meta_description}>
                      {tag.meta_description}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500 truncate max-w-[200px]" title={tag.meta_keywords}>
                      {tag.meta_keywords || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openViewModal(tag)}
                          className="p-1.5 text-[#50ad77] bg-[#50ad77]/10 hover:bg-[#50ad77]/20 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(tag)}
                          className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(tag)}
                          className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
            <span className="text-sm text-slate-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTags.length)} of {filteredTags.length} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                {selectedTag ? 'Edit Meta Tag' : 'Add New Meta Tag'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-4xl text-slate-400 hover:text-slate-400">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Page Route *</label>
                <select
                  name="page_route"
                  required
                  value={mainRoute}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '/services') {
                      setFormData(prev => ({ ...prev, page_route: '/services' }));
                    } else {
                      setFormData(prev => ({ ...prev, page_route: val }));
                    }
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#50ad77] bg-white"
                >
                  <option value="" disabled>Select a page route</option>
                  {PAGE_ROUTES.map((route) => (
                    <option key={route.value} value={route.value}>
                      {route.label}
                    </option>
                  ))}
                </select>
              </div>
              {mainRoute === '/services' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Select Service *</label>
                  <select
                    value={serviceRoute || '/services'}
                    required
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({ ...prev, page_route: val }));
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#50ad77] bg-white"
                  >
                    <option value="/services">All Services Page</option>
                    {services.map((service) => {
                      const slug = createSlug(service.title);
                      const routeVal = `/services/${slug}`;
                      return (
                        <option key={service.id} value={routeVal}>
                          {service.title}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Meta Title *</label>
                <input
                  type="text"
                  name="meta_title"
                  required
                  placeholder="Max 60 characters recommended"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#50ad77]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Meta Description *</label>
                <textarea
                  name="meta_description"
                  required
                  rows="3"
                  placeholder="Max 160 characters recommended"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#50ad77]"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Meta Keywords</label>
                <input
                  type="text"
                  name="meta_keywords"
                  placeholder="e.g., healthcare, clinic, doctors (comma separated)"
                  value={formData.meta_keywords}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#50ad77]"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#50ad77] hover:bg-[#419263] rounded-xl transition-colors"
                >
                  Save Meta Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Meta Tag?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete meta tags for <span className="font-bold text-slate-700">{selectedTag?.page_route}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#50ad77]" /> View Meta Tag Details
              </h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-4xl text-slate-400 hover:text-slate-600 transition-colors">
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Page Route</label>
                <div className="flex flex-col bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                  <span className="text-sm font-semibold text-slate-800">
                    {getPageRouteName(selectedTag.page_route)}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Meta Title</label>
                <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm text-slate-800 font-medium">
                  {selectedTag.meta_title}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Meta Description</label>
                <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {selectedTag.meta_description}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Meta Keywords</label>
                <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-sm text-slate-600">
                  {selectedTag.meta_keywords || '—'}
                </div>
              </div>
              <div className="pt-4 flex justify-end border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
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
}
