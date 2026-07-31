// ======================================================
// FILE: DashboardLayout.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Creates the overall dashboard layout.
//
// RESPONSIBILITIES:
// • Display Sidebar
// • Display Header
// • Display Dashboard Home
//
// AUTHOR:
// Joel Butala
// ======================================================

import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardHome from "./DashboardHome";

import "../../styles/Dashboard.css";

function DashboardLayout() {

    return (

        <div className="dashboard">

            <Sidebar />

            <main className="dashboard-content">

                <Header />

                <DashboardHome />

            </main>

        </div>

    );

}

export default DashboardLayout;