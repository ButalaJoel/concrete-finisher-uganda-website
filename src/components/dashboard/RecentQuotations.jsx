// ======================================================
// FILE: RecentQuotations.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Displays the latest quotation requests on the
// dashboard home page.
//
// RESPONSIBILITIES:
// • Receive quotations from DashboardHome
// • Sort quotations by submission date
// • Display the latest three quotations
// • Display quotation status
// • Handle loading, error and empty states
//
// AUTHOR:
// Joel Butala
// ======================================================


import { Link } from "react-router-dom";

import "../../styles/dashboard/RecentQuotations.css";


// ======================================================
// RECENT QUOTATIONS COMPONENT
// ======================================================

function RecentQuotations({
    quotations,
    loading,
    error
}) {


    // ==================================================
    // SORT QUOTATIONS
    //
    // [...quotations] creates a COPY of the array.
    //
    // This is important because .sort() changes the
    // original array.
    //
    // We do not want to directly mutate React state.
    // ==================================================

    const sortedQuotations = [...quotations].sort(

        (a, b) =>

            new Date(b.createdAt) -
            new Date(a.createdAt)

    );


    // ==================================================
    // GET LATEST THREE
    //
    // slice(0, 3) means:
    //
    // Start at index 0
    // Stop before index 3
    //
    // Therefore:
    // index 0
    // index 1
    // index 2
    //
    // = three quotations
    // ==================================================

    const recentQuotations =
        sortedQuotations.slice(0, 3);


    return (

        <section className="dashboard-section recent-quotations">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="recent-quotations-header">

                <h2>
                    Recent Quotations
                </h2>


                <Link
                    to="/dashboard/quotations"
                    className="view-all-quotations"
                >
                    View All
                </Link>

            </div>


            {/* =========================================
                LOADING STATE
            ========================================= */}

            {loading && (

                <p className="recent-message">

                    Loading recent quotations...

                </p>

            )}


            {/* =========================================
                ERROR STATE
            ========================================= */}

            {!loading && error && (

                <p className="recent-message recent-error">

                    Unable to load recent quotations.

                </p>

            )}


            {/* =========================================
                EMPTY STATE
            ========================================= */}

            {!loading &&
                !error &&
                recentQuotations.length === 0 && (

                    <p className="recent-message">

                        No quotations have been submitted yet.

                    </p>

                )}


            {/* =========================================
                QUOTATION LIST
            ========================================= */}

            {!loading &&
                !error &&
                recentQuotations.length > 0 && (

                    <div className="recent-quotations-list">

                        {recentQuotations.map(
                            (quotation) => (

                                <div
                                    className="recent-quotation-item"
                                    key={quotation._id}
                                >


                                    {/* =================
                                        CLIENT
                                    ================= */}

                                    <div className="recent-client">

                                        <strong>

                                            {quotation.company ||
                                                quotation.fullName}

                                        </strong>

                                        <span>

                                            {quotation.fullName}

                                        </span>

                                    </div>


                                    {/* =================
                                        SERVICE
                                    ================= */}

                                    <div className="recent-service">

                                        <strong>
                                            {quotation.serviceRequired}
                                        </strong>

                                        <span>
                                            {quotation.projectLocation}
                                        </span>

                                    </div>


                                    {/* =================
                                        STATUS
                                    ================= */}

                                    <div className="recent-status">

                                        <span
                                            className={
                                                `quotation-status status-${quotation.status
                                                    .toLowerCase()
                                                    .replaceAll(" ", "-")}`
                                            }
                                        >

                                            {quotation.status}

                                        </span>

                                    </div>


                                </div>

                            )
                        )}

                    </div>

                )}


        </section>

    );

}


export default RecentQuotations;