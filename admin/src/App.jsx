import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Sidebar from './pages/Sidebar';
import Banner from './pages/Banner';
import Brands from './pages/Brands';
import Stats from './pages/Stats';
import Services from './pages/Services';
import Career from './pages/Career';
import Applications from './pages/Applications';
import ResourceRepository from './pages/ResourceRepository';
import Blogs from './pages/Blogs';
import Testimonials from './pages/Testimonials';
import Contactmanagement from './pages/Contactmanagement';
import MetaTagsManagement from './pages/MetaTagsManagement';
import { ToastContainer, toast } from "react-toastify";
import { LogOut, Upload, User } from 'lucide-react';
import "react-toastify/dist/ReactToastify.css";
import './App.css';

function Topbar() {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    fetch(`${baseUrl}/api/admin/profile-picture`)
      .then(res => res.json())
      .then(data => {
        if (data.imageUrl) {
          setProfileImage(`${baseUrl}${data.imageUrl}`);
        }
      })
      .catch(err => console.error("Error fetching profile picture:", err));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Profile picture must be 3MB or less.");
        e.target.value = null; 
        return;
      }
      const formData = new FormData();
      formData.append("profilePicture", file);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      try {
        const response = await fetch(`${baseUrl}/api/admin/profile-picture`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          setProfileImage(`${baseUrl}${data.imageUrl}`);
          toast.success("Profile picture updated successfully!");
        } else {
          toast.error("Failed to upload profile picture.");
        }
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Error connecting to server.");
      }
      e.target.value = null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTimestamp');
    navigate('/login');
  };

  return (
    <div className="bg-white border-b border-slate-200 px-8 py-3 flex justify-end items-center sticky top-0 z-20 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center justify-center">
          <div 
            className="relative w-11 h-11 rounded-full border-2 border-[#50ad77]/30 bg-slate-50 flex items-center justify-center cursor-pointer overflow-hidden group shadow-sm hover:border-[#50ad77] transition-colors duration-300"
            onClick={() => fileInputRef.current.click()}
            title="Upload Profile Picture"
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-slate-400 group-hover:text-[#50ad77] transition-colors" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest mt-1">Admin</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl text-sm font-bold transition-all duration-200 shadow-sm border border-red-100 hover:border-red-500 group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

function AdminLayout({ children }) {
  const checkSession = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    
    if (!isAuthenticated) return false;
    
    if (loginTimestamp) {
      const elapsed = Date.now() - parseInt(loginTimestamp, 10);
      if (elapsed > 2 * 60 * 60 * 1000) { // 2 hours session expiry
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('loginTimestamp');
        return false;
      }
    }
    
    localStorage.setItem('loginTimestamp', Date.now().toString());
    return true;
  };

  if (!checkSession()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/banner" element={<AdminLayout><Banner /></AdminLayout>} />
        <Route path="/brands" element={<AdminLayout><Brands /></AdminLayout>} />
        <Route path="/about-page-counts" element={<AdminLayout><Stats /></AdminLayout>} />
        <Route path="/services" element={<AdminLayout><Services /></AdminLayout>} />
        <Route path="/career" element={<AdminLayout><Career /></AdminLayout>} />
        <Route path="/applications" element={<AdminLayout><Applications /></AdminLayout>} />
        <Route path="/resourcerepository" element={<AdminLayout><ResourceRepository /></AdminLayout>} />
        <Route path="/investorsrelations" element={<Navigate to="/resourcerepository" replace />} />
        <Route path="/blogs" element={<AdminLayout><Blogs /></AdminLayout>} />
        <Route path="/testimonials" element={<AdminLayout><Testimonials /></AdminLayout>} />
        <Route path="/contact-enquiries" element={<AdminLayout><Contactmanagement /></AdminLayout>} />
        <Route path="/meta-tags" element={<AdminLayout><MetaTagsManagement /></AdminLayout>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
