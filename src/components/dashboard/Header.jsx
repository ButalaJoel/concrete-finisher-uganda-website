// ======================================================
// FILE: Header.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Displays Dashboard Header.
//
// RESPONSIBILITIES:
// • Dynamic Welcome Message
// • Search
// • New Project Action
// • Notifications
// • Logged-In Administrator Profile
// • Open Mobile Sidebar
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORTS
// ======================================================

import {
    Search,
    Bell,
    UserCircle,
    Plus,
    Menu
} from "lucide-react";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "../../styles/dashboard/Header.css";


// ======================================================
// HEADER COMPONENT
// ======================================================

function Header({

    openSidebar,
    newQuotationCount

}) {


    // ==================================================
    // NAVIGATION
    // ==================================================

    const navigate = useNavigate();

    // ==================================================
    // GLOBAL DASHBOARD SEARCH
    //
    // Stores:
    // • Current search text
    // • Matching projects
    // • Matching quotations
    // • Search loading state
    // ==================================================

    const [searchTerm, setSearchTerm] =
        useState("");


    const [projectResults, setProjectResults] =
        useState([]);


    const [quotationResults, setQuotationResults] =
        useState([]);


    const [isSearching, setIsSearching] =
        useState(false);

    const [showSearchResults, setShowSearchResults] =
    useState(false);

    // ==================================================
    // SEARCH PROJECTS AND QUOTATIONS
    //
    // Uses the same search term to search both APIs.
    // ==================================================

    useEffect(() => {


        // Remove unnecessary spaces
        const trimmedSearch =
            searchTerm.trim();


        // If the search box is empty,
        // clear previous results.
        if (!trimmedSearch) {

            setProjectResults([]);

            setQuotationResults([]);

            setIsSearching(false);

            return;

        }


        // Prevent a request for every single keystroke.
        const searchTimer =
            setTimeout(async () => {

                try {


                    setIsSearching(true);


                    // Search Projects and Quotations
                    // at the same time.
                    const [

                        projectResponse,
                        quotationResponse

                    ] = await Promise.all([

                        fetch(
                            `${import.meta.env.VITE_API_URL}/api/projects?search=${encodeURIComponent(trimmedSearch)}`
                        ),

                        fetch(
                            `${import.meta.env.VITE_API_URL}/api/quotations?search=${encodeURIComponent(trimmedSearch)}`
                        ),

                    ]);


                    // Convert both responses into JSON
                    const [

                        projectData,
                        quotationData

                    ] = await Promise.all([

                        projectResponse.json(),

                        quotationResponse.json(),

                    ]);


                    // Save matching projects
                    setProjectResults(
                        projectData.data || []
                    );


                    // Save matching quotations
                    setQuotationResults(
                        quotationData.data || []
                    );


                } catch (error) {


                    console.error(
                        "Global search error:",
                        error
                    );


                    // Prevent old results from remaining
                    // on screen after a failed search.
                    setProjectResults([]);

                    setQuotationResults([]);


                } finally {


                    setIsSearching(false);

                }


            }, 400);


        // Cleanup:
        // If the user types again before 400ms,
        // cancel the previous timer.
        return () => {

            clearTimeout(searchTimer);

        };


    }, [searchTerm]);


    // ==================================================
    // GET LOGGED-IN ADMINISTRATOR
    //
    // Login.jsx stores the administrator in either:
    //
    // • localStorage
    // • sessionStorage
    //
    // We check both because Remember Me determines
    // which storage location is used.
    // ==================================================

    const storedAdmin =

        localStorage.getItem("cf_admin") ||

        sessionStorage.getItem("cf_admin");


    // ==================================================
    // PARSE ADMINISTRATOR DATA
    // ==================================================

    let admin = null;


    try {

        if (storedAdmin) {

            admin =
                JSON.parse(storedAdmin);

        }

    } catch (error) {

        console.error(
            "Unable to read administrator data:",
            error
        );

    }


    // ==================================================
    // ADMINISTRATOR NAME
    // ==================================================

    const adminName =

        admin?.fullName ||

        "Administrator";


    // ==================================================
    // PROFILE PHOTO URL
    //
    // The backend stores a relative path such as:
    //
    // /uploads/profiles/photo.jpg
    //
    // Therefore we combine it with VITE_API_URL.
    // ==================================================

    const profilePhotoUrl =

        admin?.profilePhoto

            ? `${import.meta.env.VITE_API_URL}${admin.profilePhoto}`

            : null;

            console.log("Admin data:", admin);

console.log(
    "VITE API URL:",
    import.meta.env.VITE_API_URL
);

console.log(
    "Profile photo URL:",
    profilePhotoUrl
);


    // ==================================================
    // NEW PROJECT
    // ==================================================

    const handleNewProject = () => {

        navigate("/dashboard/projects");

    };


    // ==================================================
    // OPEN PROJECT
    //
    // Uses the project slug instead of pagination.
    //
    // Example:
    //
    // /dashboard/projects?project=office-epoxy-floor
    //
    // DashboardProjects.jsx reads this slug and fetches
    // the exact project directly.
    // ==================================================

    const handleProjectClick = (projectSlug) => {

        // Clear the search input
        setSearchTerm("");


        // Hide the search dropdown
        setShowSearchResults(false);


        // Open the Projects dashboard and pass the
        // selected project's unique slug in the URL.
        navigate(

            `/dashboard/projects?project=${encodeURIComponent(
                projectSlug
            )}`

        );

    };


    // ==================================================
    // OPEN QUOTATION
    //
    // We use the quotation ID in the URL.
    //
    // DashboardQuotations.jsx will handle this next.
    // ==================================================

    const handleQuotationClick = (quotationId) => {

        // Clear the search input
        setSearchTerm("");


        // Hide the search dropdown
        setShowSearchResults(false);


        // Navigate to the quotations dashboard and pass
        // the selected quotation ID in the URL.
        navigate(

            `/dashboard/quotations?quotation=${encodeURIComponent(
                quotationId
            )}`

        );

    };

    return (

        <header className="dashboard-header">


            {/* =========================================
                LEFT SIDE
            ========================================= */}

            <div className="header-left">


                {/* MOBILE MENU BUTTON */}

                <button
                    className="mobile-menu-btn"
                    onClick={openSidebar}
                    aria-label="Open dashboard menu"
                    type="button"
                >

                    <Menu size={24} />

                </button>


                {/* HEADER TITLE */}

                <div className="header-title">


                    <h1>

                        Dashboard

                    </h1>


                    <p>

                        Welcome back, {adminName}.

                    </p>


                </div>


            </div>


            {/* =========================================
                RIGHT SIDE
            ========================================= */}

            <div className="header-right">


                {/* =====================================
                    SEARCH
                ===================================== */}

                <div className="search-box">


                    <Search size={18} />


                    <input
    type="text"
    placeholder="Search projects or quotations..."
    value={searchTerm}
    onChange={(event) => {

        setSearchTerm(event.target.value);

        setShowSearchResults(
            event.target.value.trim() !== ""
        );

    }}
    onFocus={() => {

        if (searchTerm.trim()) {

            setShowSearchResults(true);

        }

    }}
/>

{showSearchResults && (

    <div className="search-results-dropdown">


        {/* SEARCHING */}

        {isSearching && (

            <div className="search-results-message">

                Searching...

            </div>

        )}


        {/* PROJECT RESULTS */}

        {!isSearching &&
            projectResults.length > 0 && (

                <div className="search-result-section">


                    <p className="search-result-heading">

                        Projects

                    </p>


                    {projectResults.map((project) => (

    <button
        key={project._id}
        type="button"
        className="search-result-item"
        onClick={() =>
            handleProjectClick(project.slug)
        }
    >

        <strong>
            {project.title}
        </strong>

        <span>
            {project.service}
        </span>

    </button>

))}


                </div>

            )}


        {/* QUOTATION RESULTS */}

        {!isSearching &&
            quotationResults.length > 0 && (

                <div className="search-result-section">


                    <p className="search-result-heading">

                        Quotations

                    </p>


                    {quotationResults.map((quotation) => (

    <button
        key={quotation._id}
        type="button"
        className="search-result-item"
        onClick={() =>
            handleQuotationClick(quotation._id)
        }
    >

        <strong>
            {quotation.fullName}
        </strong>

        <span>
            {quotation.serviceRequired}
        </span>

    </button>

))}


                </div>

            )}


        {/* NO RESULTS */}

        {!isSearching &&

            projectResults.length === 0 &&

            quotationResults.length === 0 &&

            searchTerm.trim() !== "" && (

                <div className="search-results-message">

                    No matching projects or quotations found.

                </div>

            )}


    </div>

)}


                </div>


                {/* =====================================
                    NEW PROJECT
                ===================================== */}

                <button
                    className="new-project-btn"
                    onClick={handleNewProject}
                    type="button"
                    aria-label="Create new project"
                >


                    <Plus size={18} />


                    <span>

                        New Project

                    </span>


                </button>


                {/* =====================================
                    NOTIFICATIONS
                ===================================== */}

                <button
                    className="notification-wrapper"
                    type="button"
                    aria-label={

                        newQuotationCount > 0

                            ? `${newQuotationCount} new quotations`

                            : "Notifications"

                    }
                >


                    <Bell
                        size={22}
                        className="header-icon"
                    />


                    {newQuotationCount > 0 && (

                        <span className="notification-badge">

                            {newQuotationCount}

                        </span>

                    )}


                </button>


                {/* =====================================
                    USER PROFILE
                ===================================== */}

                <button
                    className="profile-button"
                    type="button"
                    aria-label={`${adminName} profile`}
                >


                    {profilePhotoUrl ? (

                        <img
                            src={profilePhotoUrl}
                            alt={adminName}
                            className="header-profile-image"
                        />

                    ) : (

                        <UserCircle
                            size={34}
                            className="header-profile"
                        />

                    )}


                </button>


            </div>


        </header>

    );

}


export default Header;