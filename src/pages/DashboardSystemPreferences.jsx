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
// FEATURES:
// • Load saved preferences
// • Update preferences
// • Save preferences to MongoDB
// • Loading state
// • Saving state
// • Error state
// • Success state
// ======================================================

import {
    ArrowLeft,
    Globe2,
    FileText,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import "../styles/dashboard/DashboardSystemPreferences.css";


// ======================================================
// API URL
// ======================================================

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/preferences`;


// ======================================================
// COMPONENT
// ======================================================

function DashboardSystemPreferences() {

    // ==================================================
    // NAVIGATION
    // ==================================================

    const navigate = useNavigate();


    // ==================================================
    // FORM STATE
    // ==================================================

    const [
        formData,
        setFormData
    ] = useState({

        currency: "Ugandan Shilling (UGX)",

        currencyDisplay: "UGX",

        timezone: "Africa/Kampala",

        dateFormat: "DD/MM/YYYY",

        quotationPrefix: "CFU-QT",

        defaultValidity: "30",

    });


    // ==================================================
    // PAGE STATES
    // ==================================================

    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        saving,
        setSaving
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        successMessage,
        setSuccessMessage
    ] = useState("");


    // ==================================================
    // LOAD SYSTEM PREFERENCES
    //
    // GET:
    //
    // /api/preferences
    // ==================================================

    useEffect(() => {

        const loadPreferences = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await fetch(API_URL);


                if (!response.ok) {

                    throw new Error(
                        "Unable to load system preferences."
                    );

                }


                const preferences =
                    await response.json();


                // ==========================================
                // POPULATE FORM
                // ==========================================

                setFormData({

                    currency:
                        preferences.currency ||
                        "Ugandan Shilling (UGX)",

                    currencyDisplay:
                        preferences.currencyDisplay ||
                        "UGX",

                    timezone:
                        preferences.timezone ||
                        "Africa/Kampala",

                    dateFormat:
                        preferences.dateFormat ||
                        "DD/MM/YYYY",

                    quotationPrefix:
                        preferences.quotationPrefix ||
                        "CFU-QT",

                    defaultValidity:
                        String(
                            preferences.defaultValidity ||
                            30
                        ),

                });

            } catch (error) {

                console.error(
                    "Load system preferences error:",
                    error
                );


                setError(
                    "Unable to load system preferences. Please try again."
                );

            } finally {

                setLoading(false);

            }

        };


        loadPreferences();

    }, []);


    // ==================================================
    // HANDLE FORM CHANGES
    // ==================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData({

            ...formData,

            [name]:
                value,

        });


        setSuccessMessage("");

    };


    // ==================================================
    // SAVE SYSTEM PREFERENCES
    //
    // PUT:
    //
    // /api/preferences
    // ==================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        try {

            setSaving(true);

            setError("");

            setSuccessMessage("");


            // ==============================================
            // PREPARE DATA
            // ==============================================

            const preferencesData = {

                currency:
                    formData.currency,

                currencyDisplay:
                    formData.currencyDisplay,

                timezone:
                    formData.timezone,

                dateFormat:
                    formData.dateFormat,

                quotationPrefix:
                    formData.quotationPrefix.trim(),

                defaultValidity:
                    Number(
                        formData.defaultValidity
                    ),

            };


            // ==============================================
            // SEND REQUEST
            // ==============================================

            const response =
                await fetch(

                    API_URL,

                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                        },

                        body:
                            JSON.stringify(
                                preferencesData
                            ),

                    }

                );


            const data =
                await response.json();


            // ==============================================
            // HANDLE API ERROR
            // ==============================================

            if (!response.ok) {

                throw new Error(

                    data.message ||

                    "Unable to save system preferences."

                );

            }


            // ==============================================
            // UPDATE FORM WITH SAVED DATA
            // ==============================================

            if (data.preferences) {

                setFormData({

                    currency:
                        data.preferences.currency ||
                        "Ugandan Shilling (UGX)",

                    currencyDisplay:
                        data.preferences.currencyDisplay ||
                        "UGX",

                    timezone:
                        data.preferences.timezone ||
                        "Africa/Kampala",

                    dateFormat:
                        data.preferences.dateFormat ||
                        "DD/MM/YYYY",

                    quotationPrefix:
                        data.preferences.quotationPrefix ||
                        "CFU-QT",

                    defaultValidity:
                        String(
                            data.preferences.defaultValidity ||
                            30
                        ),

                });

            }


            // ==============================================
            // SUCCESS
            // ==============================================

            setSuccessMessage(
                "System preferences saved successfully."
            );


        } catch (error) {

            console.error(
                "Save system preferences error:",
                error
            );


            setError(

                error.message ||

                "Unable to save system preferences."

            );

        } finally {

            setSaving(false);

        }

    };


    // ==================================================
    // LOADING SCREEN
    // ==================================================

    if (loading) {

        return (

            <div className="system-preferences-page">

                <div className="system-preferences-loading">

                    Loading system preferences...

                </div>

            </div>

        );

    }


    // ==================================================
    // COMPONENT
    // ==================================================

    return (

        <div className="system-preferences-page">


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="system-preferences-header">


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
                ERROR MESSAGE
            ========================================== */}

            {error && (

                <div className="system-preferences-error">

                    <p>
                        {error}
                    </p>

                </div>

            )}


            {/* ==========================================
                SUCCESS MESSAGE
            ========================================== */}

            {successMessage && (

                <div className="system-preferences-success">

                    <p>
                        {successMessage}
                    </p>

                </div>

            )}


            {/* ==========================================
                FORM
            ========================================== */}

            <form
                className="system-preferences-card"
                onSubmit={handleSubmit}
            >


                {/* ======================================
                    GENERAL PREFERENCES
                ====================================== */}

                <div className="preferences-section">


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


                    <div className="preferences-form-grid">


                        {/* CURRENCY */}

                        <div className="preferences-form-group">

                            <label htmlFor="currency">
                                Currency
                            </label>

                            <select
                                id="currency"
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                            >

                                <option value="Ugandan Shilling (UGX)">
                                    Ugandan Shilling (UGX)
                                </option>

                                <option value="US Dollar (USD)">
                                    US Dollar (USD)
                                </option>

                                <option value="Kenyan Shilling (KES)">
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
                                name="currencyDisplay"
                                value={formData.currencyDisplay}
                                onChange={handleChange}
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
                                name="timezone"
                                value={formData.timezone}
                                onChange={handleChange}
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
                                name="dateFormat"
                                value={formData.dateFormat}
                                onChange={handleChange}
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


                    <div className="preferences-form-grid">


                        {/* QUOTATION PREFIX */}

                        <div className="preferences-form-group">

                            <label htmlFor="quotationPrefix">
                                Quotation Number Prefix
                            </label>

                            <input
                                id="quotationPrefix"
                                name="quotationPrefix"
                                type="text"
                                value={formData.quotationPrefix}
                                onChange={handleChange}
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
                                name="defaultValidity"
                                value={formData.defaultValidity}
                                onChange={handleChange}
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


                    <button
                        type="button"
                        className="cancel-preferences-button"
                        onClick={() =>
                            navigate("/dashboard/settings")
                        }
                        disabled={saving}
                    >

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="save-preferences-button"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : "Save Preferences"
                        }

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