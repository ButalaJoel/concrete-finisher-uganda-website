// ======================================================
// FILE: Activity.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Displays recent dashboard activity.
//
// RESPONSIBILITIES:
// • Receive quotation data through props
// • Detect new and updated quotations
// • Sort activity by latest activity
// • Display latest quotation activity
//
// AUTHOR:
// Joel Butala
// ======================================================


import "../../styles/dashboard/Activity.css";


// ======================================================
// ACTIVITY COMPONENT
// ======================================================

function Activity({

    quotations = [],
    loading = false

}) {


    // ==================================================
    // LOADING STATE
    // ==================================================

    if (loading) {

        return (

            <section className="dashboard-section recent-activity">

                <h2>
                    Recent Activity
                </h2>

                <p className="activity-message">
                    Loading recent activity...
                </p>

            </section>

        );

    }


    // ==================================================
    // PROTECT AGAINST INVALID DATA
    //
    // quotations should always be an array.
    // This prevents the component from crashing if
    // unexpected data reaches it.
    // ==================================================

    const quotationList = Array.isArray(quotations)
        ? quotations
        : [];


    // ==================================================
    // RECENT ACTIVITY
    //
    // 1. Copy quotation array
    // 2. Sort newest activity first
    // 3. Keep only latest 5
    // ==================================================

    const recentActivity = [...quotationList]

        .sort((a, b) => {

            return (

                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()

            );

        })

        .slice(0, 5);


    // ==================================================
    // FORMAT DATE
    // ==================================================

    const formatActivityTime = (date) => {

        if (!date) {

            return "Unknown time";

        }


        return new Date(date).toLocaleString();

    };


    // ==================================================
    // ACTIVITY UI
    // ==================================================

    return (

        <section className="dashboard-section recent-activity">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="activity-header">

                <h2>
                    Recent Activity
                </h2>

            </div>


            {/* =========================================
                EMPTY STATE
            ========================================= */}

            {recentActivity.length === 0 ? (

                <p className="activity-message">
                    No recent activity yet.
                </p>

            ) : (

                <div className="activity-list">


                    {/* =================================
                        ACTIVITY ITEMS
                    ================================= */}

                    {recentActivity.map((quotation) => {


                        // ------------------------------
                        // CREATED TIME
                        // ------------------------------

                        const createdTime =
                            new Date(
                                quotation.createdAt
                            ).getTime();


                        // ------------------------------
                        // UPDATED TIME
                        // ------------------------------

                        const updatedTime =
                            new Date(
                                quotation.updatedAt
                            ).getTime();


                        // ------------------------------
                        // DETECT UPDATE
                        //
                        // If updatedAt is more than
                        // one second after createdAt,
                        // quotation has been modified.
                        // ------------------------------

                        const wasUpdated =

                            updatedTime - createdTime > 1000;


                        return (

                            <div
                                className="activity-item"
                                key={quotation._id}
                            >


                                {/* ACTIVITY DOT */}

                                <div
                                    className="activity-dot"
                                ></div>


                                {/* ACTIVITY INFORMATION */}

                                <div className="activity-content">


                                    <p className="activity-title">

                                        <strong>

                                            {quotation.fullName ||
                                                "Unknown Client"}

                                        </strong>

                                        {" "}

                                        {wasUpdated
                                            ? "quotation updated"
                                            : "submitted a new quotation"
                                        }

                                    </p>


                                    <div className="activity-meta">


                                        <span>

                                            {wasUpdated
                                                ? quotation.status
                                                : quotation.serviceRequired
                                            }

                                        </span>


                                        <span
                                            className="activity-separator"
                                        >
                                            •
                                        </span>


                                        <span>

                                            {formatActivityTime(
                                                quotation.updatedAt
                                            )}

                                        </span>


                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </section>

    );

}


export default Activity;