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
//
// DATA SOURCE:
// DashboardLayout → Outlet Context
//
// AUTHOR:
// Joel Butala
// ======================================================

import { useEffect, useState } from "react";

import { useOutletContext } from "react-router-dom";

import "../styles/dashboard/Quotations.css";


function DashboardQuotations() {

    // ==================================================
    // SHARED QUOTATION DATA
    //
    // DashboardLayout already fetches quotations.
    // We consume that data here instead of making
    // another GET request.
    // ==================================================

    const {

        quotations = [],
        setQuotations,
        loading,
        error,
        setError

    } = useOutletContext();


    // ==================================================
    // PAGINATION
    // ==================================================

    const [currentPage, setCurrentPage] = useState(1);

    const quotationsPerPage = 2;


    // ==================================================
    // CALCULATE TOTAL PAGES
    // ==================================================

    const totalPages = Math.ceil(
        quotations.length / quotationsPerPage
    );


    // ==================================================
    // GET QUOTATIONS FOR CURRENT PAGE
    // ==================================================

    const startIndex =
        (currentPage - 1) * quotationsPerPage;

    const endIndex =
        startIndex + quotationsPerPage;

    const currentQuotations =
        quotations.slice(startIndex, endIndex);


    // ==================================================
    // KEEP PAGE VALID
    //
    // If a quotation is removed or the total number
    // of quotations changes, prevent the user from
    // staying on a page that no longer exists.
    // ==================================================

    useEffect(() => {

        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {

            setCurrentPage(totalPages);

        }

    }, [currentPage, totalPages]);


    // ==================================================
    // UPDATE QUOTATION STATUS
    //
    // Sends PATCH request to the backend.
    // ==================================================

    const updateQuotationStatus = async (
        quotationId,
        newStatus
    ) => {

        try {

            const response = await fetch(

                `${import.meta.env.VITE_API_URL}/api/quotations/${quotationId}`,

                {

                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        status: newStatus,
                    }),

                }

            );


            if (!response.ok) {

                throw new Error(
                    "Failed to update quotation status."
                );

            }


            const result =
                await response.json();


            // ==========================================
            // UPDATE SHARED QUOTATION STATE
            // ==========================================

            setQuotations(
                (currentQuotations) =>

                    currentQuotations.map(
                        (quotation) =>

                            quotation._id === quotationId

                                ? result.data

                                : quotation
                    )

            );


        } catch (error) {

            console.error(error);

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

                    <h1>
                        Quotations
                    </h1>

                    <p>
                        Loading quotations...
                    </p>

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

                    <p>
                        {error}
                    </p>

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

                Desktop: 2 cards
                Tablet: 2 cards
                Mobile: 1 card
            ========================================= */}

            {quotations.length > 0 && (

                <>

                    <div className="quotations-grid">

                        {currentQuotations.map(
                            (quotation) => (

                                <article
                                    className="quotation-card"
                                    key={quotation._id}
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
                                                {quotation.company ||
                                                    "Individual Client"}
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
                                    currentPage === 1
                                }

                                onClick={() =>
                                    setCurrentPage(
                                        (page) =>
                                            page - 1
                                    )
                                }

                            >

                                ← Previous

                            </button>


                            {/* PAGE NUMBERS */}

                            <div className="pagination-pages">

                                {Array.from(
                                    {
                                        length: totalPages
                                    },
                                    (_, index) => {

                                        const pageNumber =
                                            index + 1;

                                        return (

                                            <button

                                                type="button"

                                                key={pageNumber}

                                                className={
                                                    `pagination-number ${
                                                        currentPage ===
                                                        pageNumber
                                                            ? "active"
                                                            : ""
                                                    }`
                                                }

                                                onClick={() =>
                                                    setCurrentPage(
                                                        pageNumber
                                                    )
                                                }

                                            >

                                                {pageNumber}

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
                                    currentPage ===
                                    totalPages
                                }

                                onClick={() =>
                                    setCurrentPage(
                                        (page) =>
                                            page + 1
                                    )
                                }

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