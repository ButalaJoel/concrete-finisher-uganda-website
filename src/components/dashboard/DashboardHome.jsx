// ======================================================
// FILE: DashboardHome.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Dashboard Home Page.
//
// RESPONSIBILITIES:
// • Receive shared dashboard quotation data
// • Display statistics
// • Display recent quotations
// • Display recent activity
//
// DATA SOURCE:
// DashboardLayout.jsx through Outlet context
//
// AUTHOR:
// Joel Butala
// ======================================================


import { useOutletContext } from "react-router-dom";

import StatsCards from "./StatsCards";
import RecentQuotations from "./RecentQuotations";
import Activity from "./Activity";


// ======================================================
// DASHBOARD HOME COMPONENT
// ======================================================

function DashboardHome() {


    // ==================================================
    // RECEIVE SHARED DASHBOARD DATA
    //
    // DashboardLayout fetches quotation data once.
    //
    // <Outlet context={...} />
    //
    // makes that data available here.
    // ==================================================

    const {

        quotations = [],
        loading,
        error

    } = useOutletContext();


    // ==================================================
    // DASHBOARD HOME
    // ==================================================

    return (

        <section className="dashboard-home">


            {/* =========================================
                STATISTICS
            ========================================= */}

            <StatsCards
                quotations={quotations}
                loading={loading}
            />


            {/* =========================================
                RECENT QUOTATIONS
            ========================================= */}

            <RecentQuotations
                quotations={quotations}
                loading={loading}
                error={error}
            />


            {/* =========================================
                RECENT ACTIVITY
            ========================================= */}

            <Activity
                quotations={quotations}
                loading={loading}
            />


        </section>

    );

}


export default DashboardHome;