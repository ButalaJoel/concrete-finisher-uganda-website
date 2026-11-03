// ======================================================
// FILE: StatsCards.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Displays live dashboard statistics.
//
// RESPONSIBILITIES:
// • Count new quotations
// • Display active projects
// • Display pending projects
// • Display revenue
//
// DATA:
// • Quotations received from DashboardHome through props
// • Project statistics fetched from Project API
//
// API:
// GET /api/projects/stats
//
// AUTHOR:
// Joel Butala
// ======================================================

import { useEffect, useState } from "react";

import {
    ClipboardList,
    FolderOpen,
    Clock3,
    CircleDollarSign
} from "lucide-react";
import { getAuthHeaders } from "../../utils/auth";

import "../../styles/dashboard/StatsCards.css";


// ======================================================
// STATS CARDS COMPONENT
//
// quotations:
// Array of quotation objects received from
// DashboardHome.jsx.
//
// loading:
// Tells us whether quotation data is still loading.
// ======================================================

function StatsCards({ quotations, loading, error }) {


    // ==================================================
    // PROJECT STATISTICS STATE
    //
    // These values come from:
    //
    // GET /api/projects/stats
    //
    // ==================================================

    const [projectStats, setProjectStats] = useState({

        activeProjects: 0,

        pendingProjects: 0,

        completedProjects: 0,

        totalProjects: 0,

        revenue: 0,

    });


    // ==================================================
    // PROJECT STATISTICS LOADING STATE
    // ==================================================

    const [projectStatsLoading, setProjectStatsLoading] =
        useState(true);

    const [projectStatsError, setProjectStatsError] =
        useState(false);

    const [projectStatsRequest, setProjectStatsRequest] =
        useState(0);


    // ==================================================
    // FETCH PROJECT STATISTICS
    //
    // Runs when StatsCards loads.
    //
    // This replaces the temporary hardcoded:
    //
    // Active Projects → 8
    // Pending         → 4
    // Revenue         → UGX 12.5M
    //
    // ==================================================

    useEffect(() => {
        const controller = new AbortController();

        const fetchProjectStats = async () => {

            try {
                setProjectStatsLoading(true);
                setProjectStatsError(false);


                // ==========================================
                // REQUEST PROJECT STATISTICS
                // ==========================================

                const response = await fetch(

                    `${import.meta.env.VITE_API_URL}/api/projects/stats`,
                    {
                        headers: getAuthHeaders(),
                        signal: controller.signal,
                    }
                );


                // ==========================================
                // CHECK RESPONSE
                // ==========================================

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch project statistics."
                    );

                }


                // ==========================================
                // READ RESPONSE
                // ==========================================

                const result =
                    await response.json();

                if (!result?.data || typeof result.data !== "object") {
                    throw new Error("Project statistics are unavailable.");
                }

                if (controller.signal.aborted) {
                    return;
                }

                // ==========================================
                // SAVE STATISTICS
                // ==========================================

                setProjectStats(

                    result.data

                );


            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                console.error(
                    "Project statistics error:",
                    error
                );

                setProjectStatsError(true);

            } finally {
                if (!controller.signal.aborted) {
                    setProjectStatsLoading(false);
                }

            }

        };


        fetchProjectStats();


        return () => controller.abort();

    }, [projectStatsRequest]);


    // ==================================================
    // COUNT NEW QUOTATIONS
    //
    // This part remains exactly as before.
    //
    // Only quotations whose status is "New"
    // are counted.
    // ==================================================

    const newQuotations = quotations.filter(

        (quotation) =>
            quotation.status === "New"

    );


    const newQuotationCount =
        newQuotations.length;


    // ==================================================
    // FORMAT REVENUE
    //
    // MongoDB stores revenue as a number.
    //
    // Example:
    //
    // 12500000
    //
    // becomes:
    //
    // UGX 12.5M
    //
    // ==================================================

    const formatRevenue = (amount) => {


        if (!amount) {

            return "UGX 0";

        }


        // Show the full amount, e.g. UGX 275,000,000
        return `UGX ${amount.toLocaleString()}`;

    };


    // ==================================================
    // DASHBOARD CARDS
    //
    // All four cards are now live.
    // ==================================================

    const cards = [

        // ==========================================
        // NEW QUOTATIONS
        // ==========================================

        {

            title: "New Quotations",

            value: loading
                ? null
                : error
                ? "Unavailable"
                : newQuotationCount,

            icon: ClipboardList,
            isLoading: loading,

        },


        // ==========================================
        // ACTIVE PROJECTS
        // ==========================================

        {

            title: "Active Projects",

            value: projectStatsLoading
                ? null
                : projectStatsError
                ? "Unavailable"
                : projectStats.activeProjects,

            icon: FolderOpen,
            isLoading: projectStatsLoading,

        },


        // ==========================================
        // PENDING PROJECTS
        // ==========================================

        {

            title: "Pending",

            value: projectStatsLoading
                ? null
                : projectStatsError
                ? "Unavailable"
                : projectStats.pendingProjects,

            icon: Clock3,
            isLoading: projectStatsLoading,

        },


        // ==========================================
        // REVENUE
        // ==========================================

        {

            title: "Revenue",

            value: projectStatsLoading
                ? null
                : projectStatsError
                ? "Unavailable"
                : formatRevenue(
                    projectStats.revenue
                ),

            icon: CircleDollarSign,
            isLoading: projectStatsLoading,

        }

    ];


    // ==================================================
    // COMPONENT OUTPUT
    // ==================================================

    return (

        <section className="stats-grid" aria-busy={loading || projectStatsLoading}>


            {cards.map((card) => {


                // ======================================
                // ICON COMPONENT
                // ======================================

                const Icon = card.icon;


                return (

                    <div
                        className="stat-card"
                        key={card.title}
                        aria-busy={card.isLoading}
                    >


                        {/* =================================
                            ICON
                        ================================= */}

                        <div className="stat-icon">

                            <Icon size={26} />

                        </div>


                        {/* =================================
                            CARD CONTENT
                        ================================= */}

                        <div className="stat-content">

                            <h2>
                                {card.isLoading ? (
                                    <span className="dashboard-skeleton dashboard-skeleton-stat" aria-label="Loading" />
                                ) : card.value}
                            </h2>


                            <p>

                                {card.title}

                            </p>

                        </div>


                    </div>

                );

            })}


            {projectStatsError && (
                <p className="dashboard-stats-error" role="alert">
                    Project statistics could not be loaded.
                    <button
                        type="button"
                        onClick={() => setProjectStatsRequest((request) => request + 1)}
                    >
                        Try Again
                    </button>
                </p>
            )}
        </section>

    );

}


export default StatsCards;