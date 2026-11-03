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

import { mediaUrl } from "../../utils/mediaUrl";
import {
    Search,
    Bell,
    UserCircle,
    Plus,
    Menu
} from "lucide-react";

import { useState, useEffect, useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import "../../styles/dashboard/Header.css";

const SECTION_TITLES = [
    ["/dashboard/quotations/create", "Create quotation"],
    ["/dashboard/quotations", "Quotation requests"],
    ["/dashboard/receipts", "Payment receipts"],
    ["/dashboard/projects", "Projects"],
    ["/dashboard/reports", "Reports"],
    ["/dashboard/settings", "Settings"],
];

const getSectionTitle = (pathname) =>
    SECTION_TITLES.find(([path]) => pathname.startsWith(path))?.[1] || "Overview";

// "Today, 09:15" / "3 Nov, 14:02"
const formatNotificationTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const isToday = date.toDateString() === new Date().toDateString();
    return isToday
        ? `Today, ${time}`
        : `${date.toLocaleDateString([], { day: "numeric", month: "short" })}, ${time}`;
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
};
import { getAuthHeaders } from "../../utils/auth";


// ======================================================
// HEADER COMPONENT
// ======================================================

function Header({

    openSidebar,
    newQuotationCount,
    newQuotations = []

}) {


    // ==================================================
    // NAVIGATION
    // ==================================================

    const navigate = useNavigate();
    const location = useLocation();
    const sectionTitle = getSectionTitle(location.pathname);
    const greeting = getGreeting();

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
    const searchContainerRef = useRef(null);

    // Notification bell dropdown
    const notificationRef = useRef(null);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (!showNotifications) {
            return undefined;
        }

        const handlePointerDown = (event) => {
            if (!notificationRef.current?.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowNotifications(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showNotifications]);

    // ==================================================
    // SEARCH PROJECTS AND QUOTATIONS
    //
    // Uses the same search term to search both APIs.
    // ==================================================

    useEffect(() => {


        // Remove unnecessary spaces
        const trimmedSearch =
            searchTerm.trim();


        if (!trimmedSearch) {
            return;
        }

        let isCurrent = true;

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
                            `${import.meta.env.VITE_API_URL}/api/quotations?search=${encodeURIComponent(trimmedSearch)}`,
                            {
                                headers: getAuthHeaders(),
                            }
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
                    if (isCurrent) {
                        setProjectResults(projectData.data || []);
                    }


                    // Save matching quotations
                    if (isCurrent) {
                        setQuotationResults(quotationData.data || []);
                    }


                } catch (error) {


                    console.error(
                        "Global search error:",
                        error
                    );


                    // Prevent old results from remaining
                    // on screen after a failed search.
                    if (isCurrent) {
                        setProjectResults([]);
                        setQuotationResults([]);
                    }


                } finally {


                    if (isCurrent) {
                        setIsSearching(false);
                    }

                }


            }, 400);


        // Cleanup:
        // If the user types again before 400ms,
        // cancel the previous timer.
        return () => {
            isCurrent = false;
            clearTimeout(searchTimer);

        };


    }, [searchTerm]);

    useEffect(() => {
        if (!showSearchResults) {
            return undefined;
        }

        const handleOutsidePointerDown = (event) => {
            if (!searchContainerRef.current?.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowSearchResults(false);
            }
        };

        document.addEventListener("pointerdown", handleOutsidePointerDown);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("pointerdown", handleOutsidePointerDown);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showSearchResults]);


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

            ? mediaUrl(admin.profilePhoto)

            : null;

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

                    <p className="header-greeting">
                        {greeting}, {adminName.split(" ")[0]}
                    </p>

                    {sectionTitle === "Overview" ? (
                        <h1>Overview</h1>
                    ) : (
                        <p className="header-section">{sectionTitle}</p>
                    )}

                </div>


            </div>


            {/* =========================================
                RIGHT SIDE
            ========================================= */}

            <div className="header-right">


                {/* =====================================
                    SEARCH
                ===================================== */}

                <div className="search-box" ref={searchContainerRef}>


                    <Search size={18} />


                    <input
    type="text"
    placeholder="Search projects or quotations..."
    value={searchTerm}
    onChange={(event) => {

        setSearchTerm(event.target.value);
        const hasQuery = event.target.value.trim() !== "";
        setIsSearching(hasQuery);

        if (!hasQuery) {
            setProjectResults([]);
            setQuotationResults([]);
        }

        setShowSearchResults(
            hasQuery
        );

    }}
    onFocus={() => {

        if (searchTerm.trim()) {

            setShowSearchResults(true);

        }

    }}
/>

{showSearchResults && searchTerm.trim() && (

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

                <div className="notification-menu" ref={notificationRef}>

                <button
                    className="notification-wrapper"
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={showNotifications}
                    onClick={() => setShowNotifications((open) => !open)}
                    aria-label={
                        newQuotationCount > 0
                            ? `${newQuotationCount} new quotation requests`
                            : "Notifications"
                    }
                >
                    <Bell size={22} className="header-icon" />
                    {newQuotationCount > 0 && (
                        <span className="notification-badge">
                            {newQuotationCount}
                        </span>
                    )}
                </button>

                {showNotifications && (
                    <div className="notification-panel" role="dialog" aria-label="Notifications">
                        <div className="notification-panel-head">
                            <strong>New quotation requests</strong>
                            <span>{newQuotationCount}</span>
                        </div>

                        {newQuotations.length === 0 ? (
                            <p className="notification-empty">
                                You're all caught up. New requests from the website will appear here.
                            </p>
                        ) : (
                            <ul>
                                {newQuotations.slice(0, 6).map((quotation) => (
                                    <li key={quotation._id}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowNotifications(false);
                                                handleQuotationClick(quotation._id);
                                            }}
                                        >
                                            <strong>{quotation.fullName || "Website visitor"}</strong>
                                            <span>
                                                {[quotation.serviceRequired, quotation.projectLocation]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </span>
                                            {quotation.createdAt && (
                                                <small>{formatNotificationTime(quotation.createdAt)}</small>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button
                            type="button"
                            className="notification-view-all"
                            onClick={() => {
                                setShowNotifications(false);
                                navigate("/dashboard/quotations");
                            }}
                        >
                            View all quotations
                        </button>
                    </div>
                )}

                </div>


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