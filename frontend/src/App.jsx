import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import DynamicSEO from "./components/DynamicSEO";
import Home from "./pages/Home";
import WhoWeAre from "./pages/WhoWeAre";
import Career from "./pages/Career";
import Services from "./pages/Services";
import ResourceRepository from "./pages/ResourceRepository";
import Blogsandarticles from "./pages/Blogsandarticles";
import Blogssinglepage from "./pages/Blogssinglepage";
import Contact from "./pages/Contact";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <DynamicSEO />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<WhoWeAre />} />
        <Route path="/career" element={<Career />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<Services />} />
        <Route path="/resourcerepository" element={<ResourceRepository />} />
        <Route path="/investorsrelations" element={<Navigate to="/resourcerepository" replace />} />
        <Route path="/blogsandarticles" element={<Blogsandarticles />} />
        <Route path="/blogsandarticles/:blogId" element={<Blogssinglepage />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
