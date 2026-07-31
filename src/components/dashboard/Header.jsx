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
    UserCircle

} from "lucide-react";

function Header() {

    return (

        <header className="dashboard-header">

            <div>

                <h1>Dashboard</h1>

                <p>Welcome back, Erisha.</p>

            </div>

            <div className="header-actions">

                <Search size={20} />

                <Bell size={20} />

                <UserCircle size={30} />

            </div>

        </header>

    );

}

export default Header;