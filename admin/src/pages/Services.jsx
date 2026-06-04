import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Trash2, Image as ImageIcon, Loader2, Plus, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null
    });
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [failedImages, setFailedImages] = useState({});
    const itemsPerPage = 5;

    const fileInputRef = useRef(null);
    const editFileInputRef = useRef(null);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/api/services`);
            if (response.data.success) {
                setServices(response.data.services);
                setFailedImages({});
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleEditUploadClick = () => {
        editFileInputRef.current?.click();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim() || (!formData.image && !editingId)) {
            toast.error('Please fill all fields and select an image');
            return;
        }
        const titleWords = formData.title.trim().split(/\s+/).filter(word => word.length > 0);
        if (titleWords.length > 6) {
            toast.error('Service Title must be 6 words or less');
            return;
        }
        const descWords = formData.description.trim().split(/\s+/).filter(word => word.length > 0);
        if (descWords.length > 200) {
            toast.error('Description must be 200 words or less');
            return;
        }
        if (formData.image && formData.image.size > 3 * 1024 * 1024) {
            toast.error('Image size must be 3MB or less');
            return;
        }
        try {
            setSubmitting(true);
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('image', formData.image);

            let response;
            if (editingId) {
                response = await axios.put(`${API_BASE}/api/services/${editingId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await axios.post(`${API_BASE}/api/services`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (response.data.success) {
                toast.success(editingId ? 'Service updated successfully' : 'Service added successfully');
                setFormData({ title: '', description: '', image: null });
                setImagePreview(null);
                setEditingId(null);
                setIsModalOpen(false);
                const fileInput = document.getElementById('service-image-upload');
                if (fileInput) fileInput.value = '';
                const modalFileInput = document.getElementById('edit-service-image-upload');
                if (modalFileInput) modalFileInput.value = '';
                fetchServices();
            }
        } catch (error) {
            console.error('Error adding service:', error);
            toast.error('Failed to add service');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (service) => {
        setEditingId(service.id);
        setFormData({
            title: service.title,
            description: service.description,
            image: null
        });
        setImagePreview(`${API_BASE}/uploads/${service.image}`);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setServiceToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!serviceToDelete) return;
        try {
            const response = await axios.delete(`${API_BASE}/api/services/${serviceToDelete}`);
            if (response.data.success) {
                toast.success('Service deleted successfully');
                setServices(services.filter(s => s.id !== serviceToDelete));
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Failed to delete service');
        } finally {
            setIsDeleteModalOpen(false);
            setServiceToDelete(null);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = services.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(services.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
            <ToastContainer position="top-right" autoClose={1500} />
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Manage Services</h1>
                        <p className="text-slate-500 mt-1">Add and manage dynamic services for the frontend</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ title: '', description: '', image: null });
                            setImagePreview(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#50ad77] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Add Services</span>
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-slate-800">Uploaded Services</h2>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {services.length} Total
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                            </div>
                        ) : services.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                No services added yet.
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 w-16 text-center">S.No</th>
                                        <th scope="col" className="px-6 py-3 w-24">Image</th>

                                        <th scope="col" className="px-6 py-3 min-w-[200px]">Title</th>
                                        <th scope="col" className="px-6 py-3 min-w-[300px]">Description</th>
                                        <th scope="col" className="px-6 py-3 w-24 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((service, index) => (
                                        <tr key={service.id} className="bg-white border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 text-center font-medium">{indexOfFirstItem + index + 1}.</td>
                                            <td className="px-6 py-4">
                                                {service.image && !failedImages[service.id] ? (
                                                    <img
                                                        src={`${API_BASE}/uploads/${service.image}`}
                                                        alt={service.title}
                                                        className="w-16 h-12 object-cover rounded-lg shadow-sm border border-slate-100"
                                                        onError={() => {
                                                            setFailedImages(prev => ({ ...prev, [service.id]: true }));
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-16 h-12 rounded-lg shadow-sm border border-slate-100 bg-slate-50 text-slate-400 flex flex-col items-center justify-center">
                                                        <ImageIcon size={16} />
                                                        <span className="text-[9px] font-semibold leading-none mt-1">No Image</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-800">{service.title}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-600 line-clamp-2 max-w-md break-words" title={service.description}>
                                                    {service.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(service)}
                                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                                                        title="Edit Service"
                                                    >
                                                        <Edit size={12} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(service.id)}
                                                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                                                        title="Delete Service"
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    
                    {services.length > itemsPerPage && (
                        <div className="flex justify-center items-center gap-2 p-4 border-t border-slate-100 bg-slate-50/50">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-medium text-slate-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl transform transition-all">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <h2 className="text-lg font-semibold text-slate-800">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingId(null);
                                    setFormData({ title: '', description: '', image: null });
                                    setImagePreview(null);
                                }}
                                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md hover:bg-slate-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                            <div className="p-6 overflow-y-auto flex-1">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Service Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors text-slate-800"
                                                placeholder="e.g. Ambulance Provision (Max 6 words)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows="4"
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors text-slate-800 resize-none"
                                                placeholder="Enter service description... (Max 200 words)"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Service Image</label>
                                        <div 
                                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                                            onClick={handleEditUploadClick}
                                        >
                                            <div className="space-y-1 text-center w-full">
                                                {imagePreview ? (
                                                    <div className="flex flex-col items-center gap-3 w-full">
                                                        <img src={imagePreview} alt="Preview" className="h-40 w-auto object-cover rounded-lg border border-slate-200 shadow-sm" />
                                                        <div className="flex text-sm text-slate-600 justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={handleEditUploadClick}
                                                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 px-3 py-1.5 shadow-sm border border-slate-200"
                                                            >
                                                                Change Image
                                                            </button>
                                                            <input
                                                                ref={editFileInputRef}
                                                                type="file"
                                                                className="sr-only"
                                                                accept="image/*"
                                                                onChange={handleImageChange}
                                                            />
                                                        </div>
                                                        {editingId && <p className="text-xs text-slate-500">Leave unchanged to keep current image</p>}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                                                        <div className="flex text-sm text-slate-600 justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={handleEditUploadClick}
                                                            >
                                                                <span>Upload Image</span>
                                                            </button>
                                                            <input
                                                                ref={editFileInputRef}
                                                                id="service-image-upload-modal"
                                                                name="image"
                                                                type="file"
                                                                className="sr-only"
                                                                accept="image/*"
                                                                onChange={handleImageChange}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-2">PNG, JPG, WEBP up to 3MB</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingId(null);
                                        setFormData({ title: '', description: '', image: null });
                                        setImagePreview(null);
                                    }}
                                    className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 font-medium rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all flex items-center disabled:opacity-70"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                            {editingId ? 'Updating...' : 'Adding...'}
                                        </>
                                    ) : (
                                        editingId ? 'Update Service' : 'Add Service'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setServiceToDelete(null);
                }}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
