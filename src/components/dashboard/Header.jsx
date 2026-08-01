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
// • User Profile
//
// AUTHOR:
// Joel Butala
// ======================================================

import {

    Search,
    Bell,
    UserCircle,
    Plus

} from "lucide-react";

import "../../styles/dashboard/Header.css";

function Header() {

    return (

        <header className="dashboard-header">

    <div className="header-left">

        <h1>Dashboard</h1>

        <p>

            Welcome back, Erisha.

        </p>

    </div>

    <div className="header-right">

        <div className="search-box">

            <Search size={18} />

            <input
                type="text"
                placeholder="Search projects..."
            />

        </div>

        <button className="new-project-btn">

            <Plus size={18} />

            New Project

        </button>

        <Bell
            size={22}
            className="header-icon"
        />

        <UserCircle
            size={34}
            className="header-profile"
        />

    </div>

</header>

    );

}

export default Header;