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
// • Welcome Message
// • Search
// • New Project Action
// • Notifications
// • User Profile
// • Open Mobile Sidebar
//
// AUTHOR:
// Joel Butala
// ======================================================

import {
    Search,
    Bell,
    UserCircle,
    Plus,
    Menu
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../../styles/dashboard/Header.css";

// ======================================================
// HEADER COMPONENT
// ======================================================

function Header({ openSidebar, newQuotationCount }) {

    // ==================================================
    // NAVIGATION
    //
    // useNavigate allows the header buttons to move
    // between dashboard pages without reloading
    // the entire application.
    // ==================================================

    const navigate = useNavigate();


    // ==================================================
    // NEW PROJECT
    //
    // Sends the administrator directly to the existing
    // project creation form.
    // ==================================================

    const handleNewProject = () => {

        navigate("/dashboard/projects");

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
                        Welcome back, Erisha.
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
                        placeholder="Search projects..."
                    />

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
                    aria-label="User profile"
                >

                    <UserCircle
                        size={34}
                        className="header-profile"
                    />

                </button>


            </div>

        </header>

    );

}

export default Header;