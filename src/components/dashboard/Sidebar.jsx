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
// • Future Navigation
//
// AUTHOR:
// Joel Butala
// ======================================================


import { NavLink } from "react-router-dom";

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

    return (

        <>

            {/* =========================================
                MOBILE OVERLAY
            ========================================= */}

            <div
                className={`sidebar-overlay ${isOpen ? "show" : ""}`}
                onClick={closeSidebar}
            ></div>


            {/* =========================================
                SIDEBAR
            ========================================= */}

            <aside
                className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
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

                            const Icon = item.icon;

                            return (

                                <li key={item.title}>

               <NavLink
                    to={item.path}

                    end={item.path === "/dashboard"}

                    className={({ isActive }) =>
                    isActive ? "active" : ""
                 }

                onClick={closeSidebar}
               >

                <Icon size={20} />

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

            <button className="sidebar-mobile-action">

            <Bell size={20} />

            <span>Notifications</span>

           {newQuotationCount > 0 && (

    <span className="sidebar-notification-badge">
        {newQuotationCount}
    </span>

)}
            </button>


           <button className="sidebar-mobile-action">

           <UserCircle size={22} />

          <div className="sidebar-user-info">

            <span className="sidebar-user-name">
                Erisha
            </span>

            <small>
                Administrator
            </small>

           </div>

           </button>

           </div>


          {/* =====================================
          FOOTER
          ===================================== */}

        <div className="sidebar-footer">

        <button>

        <LogOut size={20} />

        Logout

    </button>

    </div>
            </aside>

        </>

    );

}

export default Sidebar;