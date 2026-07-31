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
// • Future Navigation
//
// AUTHOR:
// Joel Butala
// ======================================================

import {

    LayoutDashboard,
    FileText,
    FolderKanban,
    BarChart3,
    Settings,
    LogOut

} from "lucide-react";

const menuItems = [

    {
        title: "Dashboard",
        icon: LayoutDashboard
    },

    {
        title: "Quotations",
        icon: FileText
    },

    {
        title: "Projects",
        icon: FolderKanban
    },

    {
        title: "Reports",
        icon: BarChart3
    },

    {
        title: "Settings",
        icon: Settings
    }

];

function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="sidebar-logo">

                <h2>Concrete Finisher</h2>

            </div>

            <nav>

                <ul>

                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        return (

                            <li key={item.title}>

                                <Icon size={20} />

                                <span>{item.title}</span>

                            </li>

                        );

                    })}

                </ul>

            </nav>

            <div className="sidebar-footer">

                <button>

                    <LogOut size={20} />

                    Logout

                </button>

            </div>

        </aside>

    );

}

export default Sidebar;