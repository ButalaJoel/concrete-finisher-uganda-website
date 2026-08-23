// ======================================================
// FILE: Sidebar.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Displays Dashboard Navigation.
//
// RESPONSIBILITIES:
// • Dashboard Menu
// • Logo
// • Responsive Mobile Navigation
// • Close Mobile Sidebar
// • Display Logged-In Administrator
// • Administrator Logout
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORTS
// ======================================================

import {
    NavLink,
    useNavigate
} from "react-router-dom";

import logo from "../../assets/logo.png";

import "../../styles/dashboard/Sidebar.css";


import {

    LayoutDashboard,
    FileText,
    FolderKanban,
    BarChart3,
    Settings,
    LogOut,
    Bell,
    UserCircle,
    X

} from "lucide-react";


// ======================================================
// DASHBOARD MENU ITEMS
// ======================================================

const menuItems = [

    {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard"
    },

    {
        title: "Quotations",
        icon: FileText,
        path: "/dashboard/quotations"
    },

    {
        title: "Projects",
        icon: FolderKanban,
        path: "/dashboard/projects"
    },

    {
        title: "Reports",
        icon: BarChart3,
        path: "/dashboard/reports"
    },

    {
        title: "Settings",
        icon: Settings,
        path: "/dashboard/settings"
    }

];


// ======================================================
// SIDEBAR COMPONENT
// ======================================================

function Sidebar({

    isOpen,
    closeSidebar,
    newQuotationCount

}) {


    // ==================================================
    // NAVIGATION
    // ==================================================

    const navigate = useNavigate();


    // ==================================================
    // LOGGED-IN ADMINISTRATOR
    //
    // Login.jsx stores administrator information in:
    //
    // • localStorage
    // • sessionStorage
    //
    // We check both because:
    //
    // Remember Me checked:
    // → localStorage
    //
    // Remember Me unchecked:
    // → sessionStorage
    // ==================================================

    const storedAdmin =

        localStorage.getItem("cf_admin") ||

        sessionStorage.getItem("cf_admin");


    // ==================================================
    // PARSE ADMINISTRATOR DATA
    //
    // Storage can only store strings.
    //
    // JSON.parse converts the stored administrator
    // string back into a JavaScript object.
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
    // ADMINISTRATOR DISPLAY VALUES
    //
    // Fallback values prevent the Sidebar from crashing
    // if administrator data is temporarily unavailable.
    // ==================================================

    const adminName =
        admin?.fullName ||
        "Administrator";

        const profilePhotoUrl =
    admin?.profilePhoto
        ? `${import.meta.env.VITE_API_URL}${admin.profilePhoto}`
        : null;


    // ==================================================
    // LOGOUT
    //
    // Remove authentication data from both storage types.
    //
    // This is necessary because Login.jsx stores data in:
    //
    // • localStorage when Remember Me is checked
    // • sessionStorage when Remember Me is not checked
    // ==================================================

    const handleLogout = () => {


        // ==============================================
        // REMOVE LOCAL STORAGE AUTHENTICATION
        // ==============================================

        localStorage.removeItem(
            "cf_auth_token"
        );

        localStorage.removeItem(
            "cf_admin"
        );


        // ==============================================
        // REMOVE SESSION STORAGE AUTHENTICATION
        // ==============================================

        sessionStorage.removeItem(
            "cf_auth_token"
        );

        sessionStorage.removeItem(
            "cf_admin"
        );


        // ==============================================
        // CLOSE MOBILE SIDEBAR
        // ==============================================

        closeSidebar();


        // ==============================================
        // REDIRECT TO LOGIN
        //
        // replace: true prevents the browser Back button
        // from returning to the dashboard.
        // ==============================================

        navigate(

            "/login",

            {
                replace: true
            }

        );


    };


    return (

        <>

            {/* =========================================
                MOBILE OVERLAY
            ========================================= */}

            <div
                className={`sidebar-overlay ${
                    isOpen
                        ? "show"
                        : ""
                }`}
                onClick={closeSidebar}
            ></div>


            {/* =========================================
                SIDEBAR
            ========================================= */}

            <aside
                className={`sidebar ${
                    isOpen
                        ? "sidebar-open"
                        : ""
                }`}
            >


                {/* =====================================
                    MOBILE CLOSE BUTTON
                ===================================== */}

                <button
                    className="sidebar-close"
                    onClick={closeSidebar}
                    aria-label="Close dashboard menu"
                >

                    <X size={24} />

                </button>


                {/* =====================================
                    LOGO
                ===================================== */}

                <div className="sidebar-logo">

                    <img
                        src={logo}
                        alt="Concrete Finisher Uganda"
                    />

                </div>


                {/* =====================================
                    NAVIGATION
                ===================================== */}

                <nav>

                    <ul>

                        {menuItems.map((item) => {

                            const Icon =
                                item.icon;


                            return (

                                <li
                                    key={item.title}
                                >

                                    <NavLink

                                        to={item.path}

                                        end={
                                            item.path ===
                                            "/dashboard"
                                        }

                                        className={(
                                            {
                                                isActive
                                            }
                                        ) =>

                                            isActive
                                                ? "active"
                                                : ""

                                        }

                                        onClick={
                                            closeSidebar
                                        }

                                    >

                                        <Icon
                                            size={20}
                                        />

                                        <span>

                                            {item.title}

                                        </span>

                                    </NavLink>

                                </li>

                            );

                        })}

                    </ul>

                </nav>


                {/* =====================================
                    MOBILE ACCOUNT ACTIONS
                ===================================== */}

                <div className="sidebar-mobile-actions">


                    {/* =================================
                        NOTIFICATIONS
                    ================================= */}

                    <button
                        className="sidebar-mobile-action"
                        type="button"
                    >

                        <Bell size={20} />

                        <span>

                            Notifications

                        </span>


                        {newQuotationCount > 0 && (

                            <span
                                className="
                                    sidebar-notification-badge
                                "
                            >

                                {newQuotationCount}

                            </span>

                        )}

                    </button>


                  <button
    className="sidebar-mobile-action"
    type="button"
>


    {/* =================================
        ADMINISTRATOR PROFILE PHOTO
    ================================= */}

    {profilePhotoUrl ? (

        <img
            src={profilePhotoUrl}
            alt={adminName}
            className="sidebar-profile-image"
        />

    ) : (

        <UserCircle size={22} />

    )}


    <div className="sidebar-user-info">


        {/* DYNAMIC ADMIN NAME */}

        <span className="sidebar-user-name">

            {adminName}

        </span>


        {/* ADMIN ROLE */}

        <small>

            Administrator

        </small>


    </div>


</button>


                </div>


                {/* =====================================
                    FOOTER
                ===================================== */}

                <div
                    className="sidebar-footer"
                >

                    <button
                        type="button"
                        onClick={handleLogout}
                    >

                        <LogOut size={20} />

                        Logout

                    </button>

                </div>


            </aside>

        </>

    );

}


// ======================================================
// EXPORT
// ======================================================

export default Sidebar;