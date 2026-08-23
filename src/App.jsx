// ======================================================
// FILE: App.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Controls all public, authentication and protected
// dashboard routes.
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// REACT ROUTER
// ======================================================

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";


// ======================================================
// COMPONENTS
// ======================================================

import ScrollToHash from "./components/ScrollToHash";
import ProtectedRoute from "./components/ProtectedRoute";


// ======================================================
// PUBLIC WEBSITE PAGES
// ======================================================

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import CompanyPage from "./pages/CompanyPage";


// ======================================================
// AUTHENTICATION
// ======================================================

import Login from "./pages/Login";


// ======================================================
// DASHBOARD
// ======================================================

import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./components/dashboard/DashboardHome";

import DashboardQuotations from "./pages/DashboardQuotations";
import DashboardProjects from "./pages/DashboardProjects";
import DashboardReports from "./pages/DashboardReports";
import DashboardSettings from "./pages/DashboardSettings";

import DashboardProfileSettings from "./pages/DashboardProfileSettings";
import DashboardCompanySettings from "./pages/DashboardCompanySettings";
import DashboardSystemPreferences from "./pages/DashboardSystemPreferences";
import DashboardSecuritySettings from "./pages/DashboardSecuritySettings";


// ======================================================
// APP COMPONENT
// ======================================================

function App() {


    return (

        <BrowserRouter>


            {/* =========================================
                SCROLL TO HASH
            ========================================= */}

            <ScrollToHash />


            <Routes>


                {/* =====================================
                    PUBLIC WEBSITE
                ===================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/services"
                    element={<Services />}
                />

                <Route
                    path="/services/:slug"
                    element={<ServiceDetail />}
                />

                <Route
                    path="/projects"
                    element={<Projects />}
                />

                <Route
                    path="/projects/:slug"
                    element={<ProjectDetail />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

                <Route
                    path="/company"
                    element={<CompanyPage />}
                />


                {/* =====================================
                    LOGIN
                ===================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =====================================
                    PROTECTED ADMIN DASHBOARD

                    ProtectedRoute checks whether the
                    administrator has an authentication
                    token before allowing access.
                ===================================== */}

                <Route
                    path="/dashboard"
                    element={

                        <ProtectedRoute>

                            <DashboardLayout />

                        </ProtectedRoute>

                    }
                >


                    {/* ===============================
                        DASHBOARD HOME
                    =============================== */}

                    <Route
                        index
                        element={<DashboardHome />}
                    />


                    {/* ===============================
                        QUOTATIONS
                    =============================== */}

                    <Route
                        path="quotations"
                        element={<DashboardQuotations />}
                    />


                    {/* ===============================
                        PROJECTS
                    =============================== */}

                    <Route
                        path="projects"
                        element={<DashboardProjects />}
                    />


                    {/* ===============================
                        REPORTS
                    =============================== */}

                    <Route
                        path="reports"
                        element={<DashboardReports />}
                    />


                    {/* ===============================
                        SETTINGS
                    =============================== */}

                    <Route
                        path="settings"
                        element={<DashboardSettings />}
                    />


                    {/* ===============================
                        PROFILE SETTINGS
                    =============================== */}

                    <Route
                        path="settings/profile"
                        element={<DashboardProfileSettings />}
                    />


                    {/* ===============================
                        COMPANY SETTINGS
                    =============================== */}

                    <Route
                        path="settings/company"
                        element={<DashboardCompanySettings />}
                    />


                    {/* ===============================
                        SYSTEM PREFERENCES
                    =============================== */}

                    <Route
                        path="settings/preferences"
                        element={<DashboardSystemPreferences />}
                    />


                    {/* ===============================
                        SECURITY SETTINGS
                    =============================== */}

                    <Route
                        path="settings/security"
                        element={<DashboardSecuritySettings />}
                    />


                </Route>


            </Routes>


        </BrowserRouter>

    );


}


// ======================================================
// EXPORT
// ======================================================

export default App;