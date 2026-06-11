import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { LuUpload, LuTrash2, LuImage, LuPen, LuX, LuChevronLeft, LuChevronRight, LuSearch } from 'react-icons/lu';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [selectedType, setSelectedType] = useState('Our Esteemed PMc');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editType, setEditType] = useState('Our Esteemed PMc');

  const imagesPerPage = 10;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/brands?type=${selectedType}`);
      const data = await res.json();
      setBrands(data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [selectedType]);

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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning('Please select an image first.');
      return;
    }
    const formData = new FormData();
    formData.append('type', selectedType);
    formData.append('image', file);
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/brands`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        toast.success('Image uploaded successfully!');
        setFile(null);
        setPreview(null);
        setIsAddModalOpen(false);
        document.getElementById('brand-image-upload').value = null;
        fetchBrands();
      } else {
        toast.error('Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (brand) => {
    setBrandToDelete(brand);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;
    try {
      const res = await fetch(`${baseUrl}/api/brands/${brandToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Image deleted successfully!');
        setIsDeleteModalOpen(false);
        setBrandToDelete(null);
        fetchBrands();
      } else {
        toast.error('Failed to delete image.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error.');
    }
  };

  const openEditModal = (brand) => {
    setBrandToEdit(brand);
    setEditType(brand.type);
    setEditFile(null);
    setEditPreview(`${baseUrl}${brand.image_url}`);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('type', editType);
    if (editFile) {
      formData.append('image', editFile);
    }

    try {
      const res = await fetch(`${baseUrl}/api/brands/${brandToEdit.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        toast.success('Image updated successfully!');
        setIsEditModalOpen(false);
        setBrandToEdit(null);
        fetchBrands();
      } else {
        toast.error('Failed to update image.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter(brand => {
    const type = brand?.type || "";
    const imageUrl = brand?.image_url || "";
    const query = searchQuery.toLowerCase();
    return type.toLowerCase().includes(query) || imageUrl.toLowerCase().includes(query);
  });

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredBrands.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(filteredBrands.length / imagesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in relative">
      <ToastContainer position='top-right' autoClose={1500} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Brands Management
          </h1>
          <p className="text-sm text-[#50ad77] mt-1">
            Upload and manage slider images.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#50ad77] hover:bg-[#419263] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#50ad77]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 w-full md:w-auto shrink-0"
        >
          <LuUpload className="w-4 h-4" /> Add Brands
        </button>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3 mb-2">
        <button
          onClick={() => setSelectedType('Our Esteemed PMc')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer ${
            selectedType === 'Our Esteemed PMc'
              ? 'bg-[#50ad77] text-white shadow-lg shadow-[#50ad77]/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Our Esteemed PMCs
        </button>
        <button
          onClick={() => setSelectedType('Our Esteemed Clients')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer ${
            selectedType === 'Our Esteemed Clients'
              ? 'bg-[#50ad77] text-white shadow-lg shadow-[#50ad77]/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Our Esteemed Clients
        </button>
      </div>

      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px] flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span>{selectedType} Images</span>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#50ad77]/20 focus:border-[#50ad77] font-medium"
                />
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full whitespace-nowrap">{filteredBrands.length} items</span>
            </div>
          </h2>

          {brands.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
              <LuImage className="w-10 h-10 opacity-20" />
              <p className="text-sm font-medium">No images uploaded for this category.</p>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
              <LuSearch className="w-10 h-10 opacity-20" />
              <p className="text-sm font-medium">No matching images found.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-sm text-slate-600 bg-slate-50">
                      <th className="p-3 font-semibold rounded-tl-xl whitespace-nowrap">S.No</th>
                      <th className="p-3 font-semibold whitespace-nowrap">Category</th>
                      <th className="p-3 font-semibold whitespace-nowrap">Image</th>
                      <th className="p-3 font-semibold text-center rounded-tr-xl whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentImages.map((brand, index) => (
                      <tr key={brand.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 text-sm text-slate-600">
                          {indexOfFirstImage + index + 1}.
                        </td>
                        <td className="p-3 text-sm font-medium text-slate-800 whitespace-nowrap">
                          {brand.type}
                        </td>
                        <td className="p-3">
                          <div className="h-12 w-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1">
                            <img
                              src={`${baseUrl}${brand.image_url}`}
                              alt="Brand"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(brand)}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg font-bold text-xs transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => confirmDelete(brand)}
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
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LuChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-medium text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LuChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Image</h3>
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
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Edit Image</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <LuX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm text-slate-700 bg-slate-50"
                >
                  <option value="Our Esteemed PMc">Our Esteemed PMCs</option>
                  <option value="Our Esteemed Clients">Our Esteemed Clients</option>
                </select>
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
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <LuUpload className="text-[#50ad77]" /> Upload New Image
              </h3>
              <button onClick={() => {
                setIsAddModalOpen(false);
                setFile(null);
                setPreview(null);
              }} className="text-slate-400 hover:text-slate-600">
                <LuX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Category</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#50ad77] focus:ring-2 focus:ring-[#50ad77]/20 outline-none transition-all text-sm text-slate-700 bg-slate-50"
                >
                  <option value="Our Esteemed PMc">Our Esteemed PMCs</option>
                  <option value="Our Esteemed Clients">Our Esteemed Clients</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Image (Max 3MB)</label>
                <div className="relative group">
                  <input
                    type="file"
                    id="brand-image-upload"
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
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFile(null);
                    setPreview(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#50ad77] hover:bg-[#419263] text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-[#50ad77]/20 disabled:opacity-70 flex items-center gap-2"
                >
                  {loading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
