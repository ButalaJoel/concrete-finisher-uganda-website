// ======================================================
// FILE: DashboardSettings.jsx
//
// PURPOSE:
// Settings page for the Concrete Finisher UG dashboard.
//
// VERSION 1:
// • Profile Settings
// • Company Profile
// • System Preferences
// • Security
// ======================================================


import { 
    Settings, 
    User, 
    Building2, 
    Globe, 
    ShieldCheck,
    FileText
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../styles/dashboard/DashboardSettings.css";


function DashboardSettings() {

    const navigate = useNavigate();

    return (

        <div className="dashboard-settings">

            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="settings-header">

                <div>

                    <div className="settings-title-row">

                        <Settings
                            size={28}
                            className="settings-page-icon"
                        />

                        <h1>
                            Settings
                        </h1>

                    </div>

                    <p>
                        Manage your account, company information and
                        system preferences.
                    </p>

                </div>

            </div>


            {/* ==========================================
                SETTINGS GRID
            ========================================== */}

            <div className="settings-grid">


                {/* PROFILE SETTINGS */}

                <div className="settings-card">

                    <div className="settings-card-icon">
                        <User size={24} />
                    </div>

                    <div className="settings-card-content">

                        <h2>
                            Profile Settings
                        </h2>

                        <p>
                            Manage your personal account information.
                        </p>

                        <button
                       className="settings-action-button"
                       onClick={() => navigate("/dashboard/settings/profile")}
                       >
                       Edit Profile
                        </button>

                    </div>

                </div>


                {/* COMPANY PROFILE */}

                <div className="settings-card">

                    <div className="settings-card-icon">
                        <Building2 size={24} />
                    </div>

                    <div className="settings-card-content">

                        <h2>
                            Company Profile
                        </h2>

                        <p>
                            Manage Concrete Finisher business details.
                        </p>

                        <button
                        className="settings-action-button"
                        onClick={() => navigate("/dashboard/settings/company")}
                        >
                        Manage Company
                        </button>

                    </div>

                </div>


                {/* SYSTEM PREFERENCES */}

                <div className="settings-card">

                    <div className="settings-card-icon">
                        <Globe size={24} />
                    </div>

                    <div className="settings-card-content">

                        <h2>
                            System Preferences
                        </h2>

                        <p>
                            Currency, timezone and date preferences.
                        </p>

                        <button
                            className="settings-action-button"
                            onClick={() => navigate("/dashboard/settings/preferences")}
                        >
                            Configure Preferences

                           
                        </button>

                    </div>

                </div>

                {/* QUOTATION SETTINGS */}

<div className="settings-card">

    <div className="settings-card-icon">
        <FileText size={24} />
    </div>

    <div className="settings-card-content">

        <h2>
            Quotation Settings
        </h2>

        <p>
            Manage payment details, quotation terms and document defaults.
        </p>

        <button
            className="settings-action-button"
            onClick={() =>
                navigate("/dashboard/settings/quotations")
            }
        >
            Manage Quotations
        </button>

    </div>

</div>


                {/* SECURITY */}

                <div className="settings-card">

                    <div className="settings-card-icon">
                        <ShieldCheck size={24} />
                    </div>

                    <div className="settings-card-content">

                        <h2>
                            Security
                        </h2>

                        <p>
                            Update your password and account security.
                        </p>

                        <button
                            className="settings-action-button"
                            onClick={() => navigate("/dashboard/settings/security")}
                        >
                            Change Password

                         
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default DashboardSettings;