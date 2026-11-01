// ======================================================
// FILE: DashboardLayout.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Creates the shared Admin Dashboard layout.
//
// RESPONSIBILITIES:
// • Display Sidebar
// • Display Header
// • Render Active Dashboard Page
// • Control Mobile Sidebar State
// • Fetch shared quotation data
// • Calculate new quotation notifications
//
// API:
// GET /api/quotations
//
// AUTHOR:
// Joel Butala
// ======================================================


import { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { getAuthHeaders } from "../../utils/auth";

import "../../styles/dashboard/Dashboard.css";
import "../../styles/dashboard/DashboardPolish.css";


function DashboardLayout() {


    // ==================================================
    // MOBILE SIDEBAR STATE
    // ==================================================

    const [sidebarOpen, setSidebarOpen] = useState(false);


    // ==================================================
    // SHARED QUOTATION STATE
    //
    // Quotation data is stored here because several
    // dashboard components need access to it.
    // ==================================================

    const [quotations, setQuotations] = useState([]);


    // ==================================================
    // LOADING STATE
    // ==================================================

    const [loading, setLoading] = useState(true);


    // ==================================================
    // ERROR STATE
    // ==================================================

    const [error, setError] = useState("");

    const [quotationRequest, setQuotationRequest] = useState(0);


    // ==================================================
    // OPEN SIDEBAR
    // ==================================================

    const openSidebar = () => {

        setSidebarOpen(true);

    };


    // ==================================================
    // CLOSE SIDEBAR
    // ==================================================

    const closeSidebar = () => {

        setSidebarOpen(false);

    };


    // ==================================================
    // FETCH QUOTATIONS
    //
    // Runs when DashboardLayout mounts.
    //
    // Because DashboardLayout is shared by dashboard
    // pages, quotation data can now be used by:
    //
    // • Header
    // • Dashboard Home
    // • Other dashboard components later
    // ==================================================

    useEffect(() => {
        const controller = new AbortController();

        const fetchQuotations = async () => {

            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/quotations`,
                    {
                        headers: getAuthHeaders(),
                        signal: controller.signal,
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch dashboard quotations."
                    );

                }


                const result = await response.json();

                if (!Array.isArray(result.data)) {
                    throw new Error("Quotation data is unavailable.");
                }

                setQuotations(result.data);


            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                console.error(
                    "Dashboard quotation error:",
                    error
                );


                setQuotations([]);
                setError(error.message || "Unable to load dashboard quotation data.");


            } finally {

                if (!controller.signal.aborted) {
                    setLoading(false);
                }

            }

        };


        fetchQuotations();


        return () => controller.abort();

    }, [quotationRequest]);


    // ==================================================
    // NEW QUOTATION COUNT
    //
    // Only quotations whose status is "New" should
    // appear in the notification count.
    // ==================================================

    const newQuotationCount = quotations.filter(

        (quotation) => quotation.status === "New"

    ).length;

    const refreshQuotations = () => {
        setLoading(true);
        setQuotationRequest((request) => request + 1);
    };


    return (

        <div className="dashboard">


            {/* =========================================
                SIDEBAR
            ========================================= */}

            <Sidebar
                isOpen={sidebarOpen}
                closeSidebar={closeSidebar}
                newQuotationCount={newQuotationCount}
            />


            {/* =========================================
                MAIN DASHBOARD CONTENT
            ========================================= */}

            <main className="dashboard-content">


                {/* =====================================
                    HEADER
                ===================================== */}

                <Header
                    openSidebar={openSidebar}
                    newQuotationCount={newQuotationCount}
                />


                {/* =====================================
                    ACTIVE DASHBOARD PAGE

                    Outlet context lets nested dashboard
                    pages access the shared quotation
                    data without fetching it again.
                ===================================== */}

                <Outlet
    context={{
        
        quotations,
        setQuotations,
        loading,
        error,
        setError,
        refreshQuotations
        
    }}
/>

            </main>

        </div>

    );

}


export default DashboardLayout;