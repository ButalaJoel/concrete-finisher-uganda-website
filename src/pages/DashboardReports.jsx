// ======================================================
// FILE: DashboardReports.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Displays real-time project and quotation analytics
// using data from the Reports API.
//
// ANALYTICS:
// • Total Projects
// • Total Revenue
// • Average Project Value
// • Project Status Breakdown
// • Projects by Service
// • Quotations Summary
// • Quotation Status Breakdown
// • Quotations by Service
//
// AUTHOR:
// Joel Butala
// ======================================================

import { useEffect, useState } from "react";

import {
    BarChart3,
    FolderKanban,
    CircleCheck,
    Clock,
    DollarSign,
    FileText,
    TrendingUp,
    RefreshCw,
} from "lucide-react";

import "../styles/dashboard/DashboardReports.css";


// ======================================================
// COMPONENT
// ======================================================

function DashboardReports() {

    // ==================================================
    // STATE
    //
    // Stores the analytics returned by the backend.
    // ==================================================

    const [reports, setReports] = useState(null);


    // ==================================================
    // LOADING STATE
    //
    // Prevents the page from trying to display report
    // data before the API request is complete.
    // ==================================================

    const [loading, setLoading] = useState(true);


    // ==================================================
    // ERROR STATE
    //
    // Stores an error message if the Reports API fails.
    // ==================================================

    const [error, setError] = useState("");


    // ==================================================
    // FETCH REPORTS
    // ==================================================

    const fetchReports = async () => {

        try {

            // Start loading.

            setLoading(true);

            setError("");


            // ==========================================
            // API REQUEST
            //
            // Fetches real analytics from the backend.
            // ==========================================

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/reports`
            );


            // ==========================================
            // HANDLE FAILED RESPONSE
            // ==========================================

            if (!response.ok) {

                throw new Error(
                    "Failed to load reports."
                );

            }


            // Convert JSON response.

            const data = await response.json();


            // ==========================================
            // SAVE REPORT DATA
            // ==========================================

            setReports(data);

        }

        catch (error) {

            console.error(
                "Reports fetch error:",
                error
            );

            setError(
                "Unable to load dashboard reports."
            );

        }

        finally {

            // Stop loading whether successful or failed.

            setLoading(false);

        }

    };


    // ==================================================
    // LOAD REPORTS
    //
    // Runs once when the Reports page opens.
    // ==================================================

    useEffect(() => {

        fetchReports();

    }, []);


    // ==================================================
    // FORMAT CURRENCY
    //
    // Displays database values as proper UGX amounts.
    //
    // Example:
    //
    // 253000000
    //
    // becomes:
    //
    // UGX 253,000,000
    // ==================================================

    const formatCurrency = (value = 0) => {

        return `UGX ${Number(value).toLocaleString()}`;

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className="dashboard-reports">

                <div className="reports-loading">

                    Loading reports...

                </div>

            </div>

        );

    }


    // ==================================================
    // ERROR
    // ==================================================

    if (error) {

        return (

            <div className="dashboard-reports">

                <div className="reports-error">

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchReports}
                    >

                        <RefreshCw size={18} />

                        Try Again

                    </button>

                </div>

            </div>

        );

    }


    // ==================================================
    // SAFETY CHECK
    // ==================================================

    if (!reports) {

        return null;

    }


    // ==================================================
    // EXTRACT API DATA
    // ==================================================

    const {

        projects,

        quotations,

    } = reports;


    // ==================================================
    // STATUS DATA
    //
    // Defaults protect the UI if a status has no records.
    // ==================================================

    const projectStatuses =
        projects?.statusBreakdown || {};

    const quotationStatuses =
        quotations?.statusBreakdown || {};


    // ==================================================
    // PROJECT STATUS VALUES
    // ==================================================

    const pendingProjects =
        projectStatuses.Pending?.count || 0;

    const activeProjects =
        projectStatuses.Active?.count || 0;

    const completedProjects =
        projectStatuses.Completed?.count || 0;


    // ==================================================
    // QUOTATION STATUS VALUES
    // ==================================================

    const newQuotations =
        quotationStatuses.New || 0;

    const contactedQuotations =
        quotationStatuses.Contacted || 0;

    const followUpQuotations =
        quotationStatuses["Follow Up"] || 0;


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div className="dashboard-reports">


            {/* ==========================================
                REPORTS HEADER
            =========================================== */}

            <div className="reports-header">

                <div>

                    <div className="reports-heading">

                        <BarChart3 size={30} />

                        <h1>
                            Reports & Analytics
                        </h1>

                    </div>

                    <p>
                        Track project performance, revenue,
                        and quotation activity.
                    </p>

                </div>


                {/* REFRESH REPORTS */}

                <button
                    type="button"
                    className="reports-refresh-btn"
                    onClick={fetchReports}
                >

                    <RefreshCw size={18} />

                    Refresh

                </button>

            </div>


            {/* ==========================================
                PROJECT OVERVIEW
            =========================================== */}

            <section className="reports-section">

                <div className="reports-section-heading">

                    <h2>
                        Project Overview
                    </h2>

                    <p>
                        A summary of all projects currently
                        stored in the system.
                    </p>

                </div>


                <div className="reports-stats-grid">


                    {/* TOTAL PROJECTS */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">

                            <FolderKanban size={22} />

                        </div>

                        <div>

                            <span>
                                Total Projects
                            </span>

                            <strong>
                                {projects?.totalProjects || 0}
                            </strong>

                        </div>

                    </div>


                    {/* COMPLETED PROJECTS */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">

                            <CircleCheck size={22} />

                        </div>

                        <div>

                            <span>
                                Completed Projects
                            </span>

                            <strong>
                                {completedProjects}
                            </strong>

                        </div>

                    </div>


                    {/* TOTAL REVENUE */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">

                            <DollarSign size={22} />

                        </div>

                        <div>

                            <span>
                                Total Project Value
                            </span>

                            <strong>
                                {formatCurrency(
                                    projects?.totalProjectValue
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* AVERAGE PROJECT VALUE */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">

                            <TrendingUp size={22} />

                        </div>

                        <div>

                            <span>
                                Average Project Value
                            </span>

                            <strong>
                                {formatCurrency(
                                    Math.round(
                                        projects?.averageProjectValue || 0
                                    )
                                )}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==========================================
                PROJECT STATUS BREAKDOWN
            =========================================== */}

            <section className="reports-section">

                <div className="reports-section-heading">

                    <h2>
                        Project Status
                    </h2>

                    <p>
                        Current distribution of projects by
                        workflow status.
                    </p>

                </div>


                <div className="status-breakdown-grid">


                    {/* PENDING */}

                    <div className="status-report-card">

                        <div className="status-report-top">

                            <Clock size={20} />

                            <span>
                                Pending
                            </span>

                        </div>

                        <strong>
                            {pendingProjects}
                        </strong>

                        <p>
                            {formatCurrency(
                                projectStatuses.Pending?.totalValue || 0
                            )}
                        </p>

                    </div>


                    {/* ACTIVE */}

                    <div className="status-report-card">

                        <div className="status-report-top">

                            <TrendingUp size={20} />

                            <span>
                                Active
                            </span>

                        </div>

                        <strong>
                            {activeProjects}
                        </strong>

                        <p>
                            {formatCurrency(
                                projectStatuses.Active?.totalValue || 0
                            )}
                        </p>

                    </div>


                    {/* COMPLETED */}

                    <div className="status-report-card">

                        <div className="status-report-top">

                            <CircleCheck size={20} />

                            <span>
                                Completed
                            </span>

                        </div>

                        <strong>
                            {completedProjects}
                        </strong>

                        <p>
                            {formatCurrency(
                                projectStatuses.Completed?.totalValue || 0
                            )}
                        </p>

                    </div>

                </div>

            </section>


            {/* ==========================================
                PROJECT SERVICE ANALYTICS
            =========================================== */}

            <section className="reports-section">

                <div className="reports-section-heading">

                    <h2>
                        Projects by Service
                    </h2>

                    <p>
                        Compare project volume and value
                        across services.
                    </p>

                </div>


                <div className="reports-table-card">

                    <div className="reports-table-wrapper">

                        <table className="reports-table">

                            <thead>

                                <tr>

                                    <th>
                                        Service
                                    </th>

                                    <th>
                                        Projects
                                    </th>

                                    <th>
                                        Total Value
                                    </th>

                                    <th>
                                        Average Value
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {projects?.byService?.length > 0 ? (

                                    projects.byService.map(
                                        (service) => (

                                            <tr
                                                key={service._id}
                                            >

                                                <td>
                                                    {service._id}
                                                </td>

                                                <td>
                                                    {service.projectCount}
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        service.totalValue
                                                    )}
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        Math.round(
                                                            service.averageValue
                                                        )
                                                    )}
                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="reports-empty-cell"
                                        >

                                            No project analytics available.

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </section>


            {/* ==========================================
                HIGHEST AND LOWEST VALUE PROJECTS
            =========================================== */}

            <section className="reports-section">

                <div className="reports-section-heading">

                    <h2>
                        Project Value Highlights
                    </h2>

                    <p>
                        Highest and lowest value projects
                        currently recorded.
                    </p>

                </div>


                <div className="project-highlights-grid">


                    {/* HIGHEST */}

                    <div className="project-highlight-card">

                        <span>
                            Highest Value Project
                        </span>

                        <h3>
                            {
                                projects?.highestValueProject?.title
                                || "No project available"
                            }
                        </h3>

                        <p>
                            {
                                projects?.highestValueProject?.client
                                || "-"
                            }
                        </p>

                        <strong>
                            {formatCurrency(
                                projects?.highestValueProject?.projectValue
                            )}
                        </strong>

                    </div>


                    {/* LOWEST */}

                    <div className="project-highlight-card">

                        <span>
                            Lowest Value Project
                        </span>

                        <h3>
                            {
                                projects?.lowestValueProject?.title
                                || "No project available"
                            }
                        </h3>

                        <p>
                            {
                                projects?.lowestValueProject?.client
                                || "-"
                            }
                        </p>

                        <strong>
                            {formatCurrency(
                                projects?.lowestValueProject?.projectValue
                            )}
                        </strong>

                    </div>

                </div>

            </section>


            {/* ==========================================
                QUOTATION OVERVIEW
            =========================================== */}

            <section className="reports-section">

                <div className="reports-section-heading">

                    <h2>
                        Quotation Analytics
                    </h2>

                    <p>
                        Track quotation requests and their
                        current follow-up status.
                    </p>

                </div>


                <div className="reports-stats-grid quotation-stats-grid">


                    {/* TOTAL */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">

                            <FileText size={22} />

                        </div>

                        <div>

                            <span>
                                Total Quotations
                            </span>

                            <strong>
                                {quotations?.totalQuotations || 0}
                            </strong>

                        </div>

                    </div>


                    {/* NEW */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">

                            <FileText size={22} />

                        </div>

                        <div>

                            <span>
                                New Quotations
                            </span>

                            <strong>
                                {newQuotations}
                            </strong>

                        </div>

                    </div>


                    {/* CONTACTED */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">

                            <TrendingUp size={22} />

                        </div>

                        <div>

                            <span>
                                Contacted
                            </span>

                            <strong>
                                {contactedQuotations}
                            </strong>

                        </div>

                    </div>


                    {/* FOLLOW UP */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">

                            <Clock size={22} />

                        </div>

                        <div>

                            <span>
                                Follow Up
                            </span>

                            <strong>
                                {followUpQuotations}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==========================================
                QUOTATIONS BY SERVICE
            =========================================== */}

            <section className="reports-section">

                <div className="reports-section-heading">

                    <h2>
                        Quotations by Service
                    </h2>

                    <p>
                        See which services are generating
                        the most quotation requests.
                    </p>

                </div>


                <div className="reports-table-card">

                    <div className="reports-table-wrapper">

                        <table className="reports-table">

                            <thead>

                                <tr>

                                    <th>
                                        Service
                                    </th>

                                    <th>
                                        Quotation Requests
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {quotations?.byService?.length > 0 ? (

                                    quotations.byService.map(
                                        (service) => (

                                            <tr
                                                key={service._id}
                                            >

                                                <td>
                                                    {service._id}
                                                </td>

                                                <td>
                                                    {service.quotationCount}
                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="2"
                                            className="reports-empty-cell"
                                        >

                                            No quotation analytics available.

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </section>


        </div>

    );

}


export default DashboardReports;