import ServiceDetail from "./pages/ServiceDetail";


import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import ScrollToHash from "./components/ScrollToHash";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import CompanyPage from "./pages/CompanyPage";


// ======================================================
// DASHBOARD
// ======================================================

import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./components/dashboard/DashboardHome";

import DashboardQuotations from "./pages/DashboardQuotations";
import DashboardProjects from "./pages/DashboardProjects";
import DashboardReports from "./pages/DashboardReports";
import DashboardSettings from "./pages/DashboardSettings";


function App() {

  return (

    <BrowserRouter>

      <ScrollToHash />

      <Routes>


        {/* =============================================
            PUBLIC WEBSITE
        ============================================= */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />

        <Route
          path="/services/:slug"
          element={<ServiceDetail />}
        />

        <Route path="/projects" element={<Projects />} />

        <Route
          path="/projects/:slug"
          element={<ProjectDetail />}
        />

        <Route path="/contact" element={<Contact />} />

        <Route path="/company" element={<CompanyPage />} />


        {/* =============================================
            ADMIN DASHBOARD
        ============================================= */}

        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >

          <Route
            index
            element={<DashboardHome />}
          />

          <Route
            path="quotations"
            element={<DashboardQuotations />}
          />

          <Route
            path="projects"
            element={<DashboardProjects />}
          />

          <Route
            path="reports"
            element={<DashboardReports />}
          />

          <Route
            path="settings"
            element={<DashboardSettings />}
          />

        </Route>


      </Routes>

    </BrowserRouter>

  );

}

export default App;