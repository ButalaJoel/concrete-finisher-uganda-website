// ======================================================
// FILE: DashboardSystemPreferences.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Allows the administrator to manage system-wide
// preferences.
//
// VERSION 1:
// • Currency
// • Currency display
// • Timezone
// • Date format
// • Quotation number prefix
// • Default quotation validity
//
// BACKEND:
// API integration will be added after the interface
// is completed and styled.
// ======================================================


// ======================================================
// IMPORTS
// ======================================================

import {

    ArrowLeft,
    Globe2,
    FileText,

} from "lucide-react";

import {

    useNavigate,

} from "react-router-dom";

import "../styles/dashboard/DashboardSystemPreferences.css";


// ======================================================
// COMPONENT
// ======================================================

function DashboardSystemPreferences() {

    // ==================================================
    // NAVIGATION
    // ==================================================

    const navigate = useNavigate();


    // ==================================================
    // FORM SUBMISSION
    //
    // Temporary frontend behaviour.
    //
    // Backend API integration will be added later.
    // ==================================================

    const handleSubmit = (event) => {

        event.preventDefault();

        console.log(
            "System preferences submitted."
        );

    };


    // ==================================================
    // COMPONENT RETURN
    // ==================================================

    return (

        <div className="system-preferences-page">


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="system-preferences-header">


                {/* BACK BUTTON */}

                <button
                    type="button"
                    className="preferences-back-button"
                    onClick={() =>
                        navigate("/dashboard/settings")
                    }
                >

                    <ArrowLeft size={18} />

                    <span>
                        Back to Settings
                    </span>

                </button>


                {/* PAGE TITLE */}

                <div className="system-preferences-title">

                    <h1>
                        System Preferences
                    </h1>

                    <p>
                        Manage currency, timezone, date and quotation preferences.
                    </p>

                </div>


            </div>


            {/* ==========================================
                SYSTEM PREFERENCES FORM
            ========================================== */}

            <form
                className="system-preferences-card"
                onSubmit={handleSubmit}
            >


                {/* ======================================
                    GENERAL PREFERENCES
                ====================================== */}

                <div className="preferences-section">


                    {/* SECTION HEADER */}

                    <div className="preferences-section-header">

                        <div className="preferences-section-icon">

                            <Globe2 size={24} />

                        </div>


                        <div>

                            <h2>
                                General Preferences
                            </h2>

                            <p>
                                Configure regional and display settings.
                            </p>

                        </div>

                    </div>


                    {/* GENERAL PREFERENCES GRID */}

                    <div className="preferences-form-grid">


                        {/* CURRENCY */}

                        <div className="preferences-form-group">

                            <label htmlFor="currency">
                                Currency
                            </label>

                            <select
                                id="currency"
                                defaultValue="UGX"
                            >

                                <option value="UGX">
                                    Ugandan Shilling (UGX)
                                </option>

                                <option value="USD">
                                    US Dollar (USD)
                                </option>

                                <option value="KES">
                                    Kenyan Shilling (KES)
                                </option>

                            </select>

                        </div>


                        {/* CURRENCY DISPLAY */}

                        <div className="preferences-form-group">

                            <label htmlFor="currencyDisplay">
                                Currency Display
                            </label>

                            <select
                                id="currencyDisplay"
                                defaultValue="UGX"
                            >

                                <option value="UGX">
                                    UGX
                                </option>

                                <option value="USh">
                                    USh
                                </option>

                            </select>

                        </div>


                        {/* TIMEZONE */}

                        <div className="preferences-form-group">

                            <label htmlFor="timezone">
                                Timezone
                            </label>

                            <select
                                id="timezone"
                                defaultValue="Africa/Kampala"
                            >

                                <option value="Africa/Kampala">
                                    Africa/Kampala (EAT)
                                </option>

                            </select>

                        </div>


                        {/* DATE FORMAT */}

                        <div className="preferences-form-group">

                            <label htmlFor="dateFormat">
                                Date Format
                            </label>

                            <select
                                id="dateFormat"
                                defaultValue="DD/MM/YYYY"
                            >

                                <option value="DD/MM/YYYY">
                                    DD/MM/YYYY
                                </option>

                                <option value="MM/DD/YYYY">
                                    MM/DD/YYYY
                                </option>

                                <option value="YYYY-MM-DD">
                                    YYYY-MM-DD
                                </option>

                            </select>

                        </div>


                    </div>


                </div>


                {/* ======================================
                    DIVIDER
                ====================================== */}

                <div className="system-preferences-divider" />


                {/* ======================================
                    QUOTATION PREFERENCES
                ====================================== */}

                <div className="preferences-section">


                    {/* SECTION HEADER */}

                    <div className="preferences-section-header">

                        <div className="preferences-section-icon">

                            <FileText size={24} />

                        </div>


                        <div>

                            <h2>
                                Quotation Preferences
                            </h2>

                            <p>
                                Configure default settings used when creating quotations.
                            </p>

                        </div>

                    </div>


                    {/* QUOTATION SETTINGS GRID */}

                    <div className="preferences-form-grid">


                        {/* QUOTATION PREFIX */}

                        <div className="preferences-form-group">

                            <label htmlFor="quotationPrefix">
                                Quotation Number Prefix
                            </label>

                            <input
                                id="quotationPrefix"
                                type="text"
                                placeholder="Example: CFU-QT"
                            />

                        </div>


                        {/* DEFAULT VALIDITY */}

                        <div className="preferences-form-group">

                            <label htmlFor="quotationValidity">
                                Default Validity
                            </label>

                            <select
                                id="quotationValidity"
                                defaultValue="30"
                            >

                                <option value="7">
                                    7 Days
                                </option>

                                <option value="14">
                                    14 Days
                                </option>

                                <option value="30">
                                    30 Days
                                </option>

                                <option value="60">
                                    60 Days
                                </option>

                                <option value="90">
                                    90 Days
                                </option>

                            </select>

                        </div>


                    </div>


                </div>


                {/* ======================================
                    FORM ACTIONS
                ====================================== */}

                <div className="system-preferences-actions">


                    {/* CANCEL */}

                    <button
                        type="button"
                        className="cancel-preferences-button"
                        onClick={() =>
                            navigate("/dashboard/settings")
                        }
                    >

                        Cancel

                    </button>


                    {/* SAVE */}

                    <button
                        type="submit"
                        className="save-preferences-button"
                    >

                        Save Preferences

                    </button>


                </div>


            </form>


        </div>

    );

}


// ======================================================
// EXPORT
// ======================================================

export default DashboardSystemPreferences;