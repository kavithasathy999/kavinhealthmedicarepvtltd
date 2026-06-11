import { NavLink, Link } from "react-router-dom";
import { 
  LuLayoutDashboard, 
  LuImage, 
  LuTags, 
  LuNewspaper, 
  LuStar, 
  LuMessageSquare,
  LuSettings,
  LuBriefcase,
  LuClipboardList,
  LuSearch,
  LuFolderOpen
} from "react-icons/lu";
import { BarChart2 } from "lucide-react";

function Sidebar() {
  const NavItem = ({ to, icon, children }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
          isActive 
            ? "bg-[#50ad77] text-white shadow-lg shadow-[#50ad77]/30" 
            : "text-slate-500 hover:bg-[#50ad77]/10 hover:text-[#50ad77]"
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm tracking-wide">{children}</span>
    </NavLink>
  );

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col hidden md:flex sticky top-0">
      <Link to="/" className="flex items-center gap-3 px-6 py-6 border-b border-slate-100 group">
        <img 
          src="/KHMCPL_LOGO.png" 
          alt="Logo" 
          className="h-10 w-10 rounded-lg object-cover shadow-sm transition-transform" 
        />
        <div className="flex flex-col">
          <span className="text-lg font-black text-[#1958a8] leading-tight">KAVIN</span>
          <span className="text-[10px] font-bold text-[#50ad77] uppercase tracking-wider">Admin Panel</span>
        </div>
      </Link>
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
        <NavItem to="/" icon={<LuLayoutDashboard />}>Dashboard</NavItem>
        <NavItem to="/banner" icon={<LuImage />}>Banners</NavItem>
        <NavItem to="/brands" icon={<LuTags />}>Brands</NavItem>
        <NavItem to="/about-page-counts" icon={<BarChart2 className="w-5 h-5" />}>Stats</NavItem>
        <NavItem to="/services" icon={<LuSettings />}>Services</NavItem>
        <NavItem to="/career" icon={<LuBriefcase />}>Career</NavItem>
        <NavItem to="/applications" icon={<LuClipboardList />}>Applications</NavItem>
        <NavItem to="/resourcerepository" icon={<LuFolderOpen />}>Resource Repository</NavItem>
        <NavItem to="/blogs" icon={<LuNewspaper />}>Blogs & Articles</NavItem>
        <NavItem to="/testimonials" icon={<LuStar />}>Testimonials</NavItem>
        <NavItem to="/contact-enquiries" icon={<LuMessageSquare />}>Contact Enquiries</NavItem>
        <NavItem to="/meta-tags" icon={<LuSearch />}>SEO Meta Tags</NavItem>
      </div>
    </aside>
  );
}

export default Sidebar;
