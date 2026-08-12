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

import "../../styles/dashboard/Dashboard.css";


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

    const [error, setError] = useState(null);


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

        const fetchQuotations = async () => {

            try {

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/quotations`
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch dashboard quotations."
                    );

                }


                const result = await response.json();


                setQuotations(result.data);


            } catch (error) {

                console.error(
                    "Dashboard quotation error:",
                    error
                );


                setError(
                    "Unable to load dashboard quotation data."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchQuotations();


    }, []);


    // ==================================================
    // NEW QUOTATION COUNT
    //
    // Only quotations whose status is "New" should
    // appear in the notification count.
    // ==================================================

    const newQuotationCount = quotations.filter(

        (quotation) => quotation.status === "New"

    ).length;


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
        setError
        
    }}
/>

            </main>

        </div>

    );

}


export default DashboardLayout;