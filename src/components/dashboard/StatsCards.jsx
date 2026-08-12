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

function StatsCards({ quotations, loading }) {


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


        const fetchProjectStats = async () => {

            try {


                // ==========================================
                // REQUEST PROJECT STATISTICS
                // ==========================================

                const response = await fetch(

                    `${import.meta.env.VITE_API_URL}/api/projects/stats`

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


                // ==========================================
                // SAVE STATISTICS
                // ==========================================

                setProjectStats(

                    result.data

                );


            } catch (error) {


                console.error(

                    "Project statistics error:",

                    error

                );


            } finally {


                // ==========================================
                // FINISH LOADING
                // ==========================================

                setProjectStatsLoading(false);

            }

        };


        fetchProjectStats();


    }, []);


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


        // ==========================================
        // BILLIONS
        // ==========================================

        if (amount >= 1000000000) {

            return `UGX ${(amount / 1000000000).toFixed(1)}B`;

        }


        // ==========================================
        // MILLIONS
        // ==========================================

        if (amount >= 1000000) {

            return `UGX ${(amount / 1000000).toFixed(1)}M`;

        }


        // ==========================================
        // THOUSANDS
        // ==========================================

        if (amount >= 1000) {

            return `UGX ${(amount / 1000).toFixed(1)}K`;

        }


        // ==========================================
        // SMALL VALUES
        // ==========================================

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
                ? "..."
                : newQuotationCount,

            icon: ClipboardList,

        },


        // ==========================================
        // ACTIVE PROJECTS
        // ==========================================

        {

            title: "Active Projects",

            value: projectStatsLoading
                ? "..."
                : projectStats.activeProjects,

            icon: FolderOpen,

        },


        // ==========================================
        // PENDING PROJECTS
        // ==========================================

        {

            title: "Pending",

            value: projectStatsLoading
                ? "..."
                : projectStats.pendingProjects,

            icon: Clock3,

        },


        // ==========================================
        // REVENUE
        // ==========================================

        {

            title: "Revenue",

            value: projectStatsLoading
                ? "..."
                : formatRevenue(
                    projectStats.revenue
                ),

            icon: CircleDollarSign,

        }

    ];


    // ==================================================
    // COMPONENT OUTPUT
    // ==================================================

    return (

        <section className="stats-grid">


            {cards.map((card) => {


                // ======================================
                // ICON COMPONENT
                // ======================================

                const Icon = card.icon;


                return (

                    <div
                        className="stat-card"
                        key={card.title}
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

                                {card.value}

                            </h2>


                            <p>

                                {card.title}

                            </p>

                        </div>


                    </div>

                );

            })}


        </section>

    );

}


export default StatsCards;