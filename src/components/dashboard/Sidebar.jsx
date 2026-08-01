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
import logo from "../../assets/logo.png";

import "../../styles/dashboard/Sidebar.css";

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

    <img
        src={logo}
        alt="Concrete Finisher Uganda"
    />

</div>
            <nav>

                <ul>

                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        return (

                            <li
                            key={item.title}
                            className={item.title === "Dashboard" ? "active" : ""}
                            >

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