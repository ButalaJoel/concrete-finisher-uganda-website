// ======================================================
// FILE: DashboardQuotations.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Displays and manages quotation requests in the
// admin dashboard.
//
// RESPONSIBILITIES:
// • Display shared quotation data
// • Update quotation status
// • Paginate quotation cards
// • Open searched quotation directly
// • Automatically switch to the correct page
//
// DATA SOURCE:
// DashboardLayout → Outlet Context
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORTS
// ======================================================

import {
    useState
} from "react";


import {
    useLocation,
    useNavigate,
    useOutletContext
} from "react-router-dom";


import "../styles/dashboard/Quotations.css";
import { getAuthHeaders } from "../utils/auth";


// ======================================================
// DASHBOARD QUOTATIONS COMPONENT
// ======================================================

function DashboardQuotations() {


    // ==================================================
    // SHARED QUOTATION DATA
    //
    // DashboardLayout already fetches quotations.
    // We use that shared data instead of making another
    // GET request.
    // ==================================================

    const {

        quotations = [],
        setQuotations,
        loading,
        error,
        setError,
        refreshQuotations

    } = useOutletContext();


    // ==================================================
    // CURRENT URL LOCATION
    //
    // Allows us to read:
    //
    // ?quotation=QUOTATION_ID
    //
    // from the URL.
    // ==================================================

    const location =
        useLocation();
    const navigate = useNavigate();


    // ==================================================
    // GET SEARCHED QUOTATION ID
    //
    // Example URL:
    //
    // /dashboard/quotations?quotation=123456
    //
    // URLSearchParams reads "quotation" and gives us
    // the quotation ID.
    // ==================================================

    const searchParams =
        new URLSearchParams(
            location.search
        );


    const searchedQuotationId =
        searchParams.get(
            "quotation"
        );


    // ==================================================
    // PAGINATION
    // ==================================================

    const [

        currentPage,

        setCurrentPage

    ] = useState(1);


    const quotationsPerPage = 2;


    // ==================================================
    // CALCULATE TOTAL PAGES
    // ==================================================

    const searchedQuotationIndex = searchedQuotationId
        ? quotations.findIndex(
            (quotation) => quotation._id === searchedQuotationId
        )
        : -1;

    const searchedQuotationPage = searchedQuotationIndex >= 0
        ? Math.floor(searchedQuotationIndex / quotationsPerPage) + 1
        : null;

    const totalPages = Math.max(
        1,
        Math.ceil(quotations.length / quotationsPerPage)
    );

    const displayPage = searchedQuotationPage ||
        Math.min(currentPage, totalPages);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        if (searchedQuotationId) {
            navigate("/dashboard/quotations", { replace: true });
        }
    };


    // ==================================================
    // GET QUOTATIONS FOR CURRENT PAGE
    // ==================================================

    const startIndex =

        (displayPage - 1) *
        quotationsPerPage;


    const endIndex =

        startIndex +
        quotationsPerPage;


    const currentQuotations =

        quotations.slice(

            startIndex,
            endIndex

        );


    // ==================================================
    // UPDATE QUOTATION STATUS
    //
    // Sends PATCH request to backend.
    // ==================================================

    const updateQuotationStatus = async (

        quotationId,
        newStatus

    ) => {

        try {


            const response =
                await fetch(

                    `${import.meta.env.VITE_API_URL}/api/quotations/${quotationId}`,

                    {

                        method: "PATCH",

                        headers: {

                            "Content-Type":
                                "application/json",
                            ...getAuthHeaders(),

                        },

                        body:
                            JSON.stringify({

                                status:
                                    newStatus,

                            }),

                    }

                );


            // ==========================================
            // CHECK RESPONSE
            // ==========================================

            if (!response.ok) {

                throw new Error(

                    "Failed to update quotation status."

                );

            }


            const result =
                await response.json();


            // ==========================================
            // UPDATE SHARED QUOTATION STATE
            //
            // Only replace the quotation whose status
            // changed. All others remain unchanged.
            // ==========================================

            setQuotations(

                (currentQuotations) =>

                    currentQuotations.map(

                        (quotation) =>

                            quotation._id ===
                            quotationId

                                ? result.data

                                : quotation

                    )

            );


        } catch (error) {


            console.error(
                error
            );


            setError(

                "Unable to update quotation status."

            );

        }

    };


    // ==================================================
    // LOADING STATE
    // ==================================================

    if (loading) {

        return (

            <section className="quotations-page">

                <div className="quotations-page-header">

                    <div>
                        <h1>Quotations</h1>
                        <p>Manage customer quotation requests.</p>
                    </div>

                </div>

                <div className="quotations-grid dashboard-skeleton-cards" role="status" aria-label="Loading quotations" aria-busy="true">
                    {Array.from({ length: 2 }, (_, index) => (
                        <div className="dashboard-skeleton-card" key={index} aria-hidden="true">
                            <span className="dashboard-skeleton dashboard-skeleton-line" />
                            <span className="dashboard-skeleton dashboard-skeleton-line dashboard-skeleton-line-short" />
                            <span className="dashboard-skeleton dashboard-skeleton-block" />
                        </div>
                    ))}
                </div>

            </section>

        );

    }


    // ==================================================
    // ERROR STATE
    // ==================================================

    if (error) {

        return (

            <section className="quotations-page">

                <div className="quotations-page-header">

                    <h1>
                        Quotations
                    </h1>

                    <p role="alert">{error}</p>

                </div>

                <div className="dashboard-state-message dashboard-state-error">
                    <button type="button" onClick={refreshQuotations}>Try Again</button>
                </div>

            </section>

        );

    }


    // ==================================================
    // PAGE
    // ==================================================

    return (

        <section className="quotations-page">


            {/* =========================================
                PAGE HEADER
            ========================================= */}

            <div className="quotations-page-header">

                <div>

                    <h1>
                        Quotations
                    </h1>

                    <p>
                        Manage customer quotation requests.
                    </p>

                </div>

            </div>


            {/* =========================================
                EMPTY DATABASE
            ========================================= */}

            {quotations.length === 0 && (

                <div className="quotations-empty">

                    <p>
                        No quotations have been submitted yet.
                    </p>

                </div>

            )}


            {/* =========================================
                QUOTATION GRID
            ========================================= */}

            {quotations.length > 0 && (

                <>


                    <div className="quotations-grid">

                        {currentQuotations.map(

                            (quotation) => (

                                <article

                                    key={
                                        quotation._id
                                    }

                                    className={

                                        `quotation-card ${

                                            searchedQuotationId ===
                                            quotation._id

                                                ? "quotation-card-highlighted"

                                                : ""

                                        }`

                                    }

                                >


                                    {/* =============================
                                        CARD HEADER
                                    ============================= */}

                                    <div className="quotation-card-header">

                                        <div>

                                            <h2>
                                                {quotation.fullName}
                                            </h2>

                                            <p>

                                                {
                                                    quotation.company ||

                                                    "Individual Client"
                                                }

                                            </p>

                                        </div>


                                        {/* =========================
                                            STATUS CONTROL
                                        ========================= */}

                                        <select

                                            className={

                                                `quotation-status-select status-${quotation.status
                                                    .toLowerCase()
                                                    .replaceAll(
                                                        " ",
                                                        "-"
                                                    )}`

                                            }

                                            value={
                                                quotation.status
                                            }

                                            onChange={(
                                                event
                                            ) => {

                                                updateQuotationStatus(

                                                    quotation._id,

                                                    event.target.value

                                                );

                                            }}

                                        >

                                            <option value="New">
                                                New
                                            </option>

                                            <option value="Contacted">
                                                Contacted
                                            </option>

                                            <option value="Follow Up">
                                                Follow Up
                                            </option>

                                            <option value="Approved">
                                                Approved
                                            </option>

                                            <option value="Rejected">
                                                Rejected
                                            </option>

                                        </select>

                                    </div>


                                    {/* =============================
                                        PROJECT INFORMATION
                                    ============================= */}

                                    <div className="quotation-details-grid">


                                        <div className="quotation-detail">

                                            <span>
                                                Service
                                            </span>

                                            <strong>

                                                {
                                                    quotation.serviceRequired
                                                }

                                            </strong>

                                        </div>


                                        <div className="quotation-detail">

                                            <span>
                                                Property Type
                                            </span>

                                            <strong>

                                                {
                                                    quotation.propertyType
                                                }

                                            </strong>

                                        </div>


                                        <div className="quotation-detail">

                                            <span>
                                                Location
                                            </span>

                                            <strong>

                                                {
                                                    quotation.projectLocation
                                                }

                                            </strong>

                                        </div>


                                        <div className="quotation-detail">

                                            <span>
                                                Estimated Area
                                            </span>

                                            <strong>

                                                {
                                                    quotation.estimatedArea

                                                        ? `${quotation.estimatedArea} m²`

                                                        : "Not provided"

                                                }

                                            </strong>

                                        </div>


                                    </div>


                                    {/* =============================
                                        CONTACT INFORMATION
                                    ============================= */}

                                    <div className="quotation-contact">

                                        <p>

                                            <strong>
                                                Phone:
                                            </strong>{" "}

                                            {
                                                quotation.phoneNumber
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Email:
                                            </strong>{" "}

                                            {
                                                quotation.email ||

                                                "Not provided"
                                            }

                                        </p>

                                    </div>


                                    {/* =============================
                                        PROJECT DESCRIPTION
                                    ============================= */}

                                    <div className="quotation-description">

                                        <span>
                                            Project Description
                                        </span>

                                        <p>

                                            {
                                                quotation.projectDescription
                                            }

                                        </p>

                                    </div>


                                </article>

                            )

                        )}

                    </div>


                    {/* =========================================
                        PAGINATION
                    ========================================= */}

                    {totalPages > 1 && (

                        <div className="quotations-pagination">


                            {/* PREVIOUS */}

                            <button

                                type="button"

                                className="pagination-button pagination-prev"

                                disabled={
                                    displayPage === 1
                                }

                                onClick={() => handlePageChange(displayPage - 1)}

                            >

                                ← Previous

                            </button>


                            {/* PAGE NUMBERS */}

                            <div className="pagination-pages">

                                {Array.from(

                                    {

                                        length:
                                            totalPages

                                    },

                                    (_, index) => {


                                        const pageNumber =
                                            index + 1;


                                        return (

                                            <button

                                                type="button"

                                                key={
                                                    pageNumber
                                                }

                                                className={

                                                    `pagination-number ${

                                                        displayPage ===
                                                        pageNumber

                                                            ? "active"

                                                            : ""

                                                    }`

                                                }

                                                onClick={() => handlePageChange(pageNumber)}

                                            >

                                                {
                                                    pageNumber
                                                }

                                            </button>

                                        );

                                    }

                                )}

                            </div>


                            {/* NEXT */}

                            <button

                                type="button"

                                className="pagination-button pagination-next"

                                disabled={

                                    displayPage ===
                                    totalPages

                                }

                                onClick={() => handlePageChange(displayPage + 1)}

                            >

                                Next →

                            </button>


                        </div>

                    )}


                </>

            )}


        </section>

    );

}


export default DashboardQuotations;