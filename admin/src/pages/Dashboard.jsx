import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Image, 
  Building, 
  Star, 
  MessageSquare, 
  FileText,
  Settings,
  Briefcase,
  ClipboardList,
  Activity,
  TrendingUp
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    banners: 0,
    brands: 0,
    blogs: 0,
    testimonials: 0,
    contacts: 0,
    services: 0,
    careers: 0,
    applications: 0,
    stats: 0,
    resourcerepository: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        
        const [banners, brands, blogs, testimonials, contacts, services, careers, applications, stats, resourcerepository] = await Promise.all([
          axios.get(`${API_URL}/api/banner/hero-content`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/brands`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/blogs`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/testimonials`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/contact`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/services`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/career/admin/all`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/career/applications`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/stats`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/resource-repository`).catch(() => ({ data: [] }))
        ]);

        const getLength = (res) => {
          if (!res || !res.data) return 0;
          if (Array.isArray(res.data)) return res.data.length;
          const keys = ['services', 'opportunities', 'applications', 'stats', 'data', 'blogs', 'brands', 'testimonials'];
          for (let key of keys) {
            if (Array.isArray(res.data[key])) return res.data[key].length;
          }
          return 0;
        };
        setCounts({
          banners: getLength(banners),
          brands: getLength(brands),
          blogs: getLength(blogs),
          testimonials: getLength(testimonials),
          contacts: getLength(contacts),
          services: getLength(services),
          careers: getLength(careers),
          applications: getLength(applications),
          stats: getLength(stats),
          resourcerepository: getLength(resourcerepository)
        });
      } catch (error) {
        console.error("Failed to fetch counts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const statCards = [
    { title: "Banners", path: "/banner", icon: <Image size={28} className="text-[#FF6B6B]" />, bg: "bg-[#FF6B6B]/10", count: counts.banners },         
    { title: "Brands", path: "/brands", icon: <Building size={28} className="text-[#4ECDC4]" />, bg: "bg-[#4ECDC4]/10", count: counts.brands },       
    { title: "Stats", path: "/stats", icon: <Activity size={28} className="text-[#00BCD4]" />, bg: "bg-[#00BCD4]/10", count: counts.stats },
    { title: "Careers", path: "/career", icon: <Briefcase size={28} className="text-[#FF9800]" />, bg: "bg-[#FF9800]/10", count: counts.careers },
    { title: "Applications", path: "/applications", icon: <ClipboardList size={28} className="text-[#3F51B5]" />, bg: "bg-[#3F51B5]/10", count: counts.applications },
    { title: "Services", path: "/services", icon: <Settings size={28} className="text-[#9C27B0]" />, bg: "bg-[#9C27B0]/10", count: counts.services },
    { title: "Resource Repository", path: "/resourcerepository", icon: <TrendingUp size={28} className="text-[#8BC34A]" />, bg: "bg-[#8BC34A]/10", count: counts.resourcerepository },
    { title: "Blogs & Articles", path: "/blogs", icon: <FileText size={28} className="text-[#009688]" />, bg: "bg-[#009688]/10", count: counts.blogs },          
    { title: "Testimonials", path: "/testimonials", icon: <Star size={28} className="text-[#FFD700]" />, bg: "bg-[#FFD700]/10", count: counts.testimonials }, 
    { title: "Contact Enquiries", path: "/contact-enquiries", icon: <MessageSquare size={28} className="text-[#E91E63]" />, bg: "bg-[#E91E63]/10", count: counts.contacts },
  ];

  return (
    <div className="p-8 min-h-screen bg-slate-50/50 w-full font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-[#50ad77] font-medium mt-1">Manage your application content seamlessly</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            onClick={() => navigate(card.path)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg} group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <div>
                <h3 className="text-slate-600 font-bold text-[18px] tracking-wide uppercase">{card.title}</h3>
                <div className="mt-1">
                  {loading ? (
                    <div className="h-5 w-12 bg-slate-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-2xl font-black text-slate-800 leading-none">{card.count}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
