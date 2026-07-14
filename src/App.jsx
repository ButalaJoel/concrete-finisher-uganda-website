import ServiceDetail from "./pages/ServiceDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToHash from "./components/ScrollToHash";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import CompanyPage from "./pages/CompanyPage";

function App() {
  return (
    <BrowserRouter>

      <ScrollToHash />
      
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />

        <Route path="/services/:slug" element={<ServiceDetail />} />

        <Route path="/projects" element={<Projects />} />

        <Route path="/projects/:slug" element={<ProjectDetail />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/company" element={<CompanyPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;