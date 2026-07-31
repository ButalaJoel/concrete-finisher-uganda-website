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
// • Statistics
// • Recent Quotations
// • Activity
//
// AUTHOR:
// Joel Butala
// ======================================================

import StatsCards from "./StatsCards";
import RecentQuotations from "./RecentQuotations";
import Activity from "./Activity";

function DashboardHome() {

    return (

        <section className="dashboard-home">

            <StatsCards />

            <RecentQuotations />

            <Activity />

        </section>

    );

}

export default DashboardHome;