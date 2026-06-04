import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WhoWeAre from "./pages/WhoWeAre";
import Career from "./pages/Career";
import Services from "./pages/Services";
import InvestorsRelations from "./pages/InvestorsRelations";
import Blogsandarticles from "./pages/Blogsandarticles";
import Blogssinglepage from "./pages/Blogssinglepage";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<WhoWeAre />} />
        <Route path="/career" element={<Career />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<Services />} />
        <Route path="/investorsrelations" element={<InvestorsRelations />} />
        <Route path="/blogsandarticles" element={<Blogsandarticles />} />
        <Route path="/blogsandarticles/:blogId" element={<Blogssinglepage />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
