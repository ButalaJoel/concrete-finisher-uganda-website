// ======================================================
// FILE: DashboardQuotationSettings.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Manage default information used when generating
// administrator-created quotations.
//
// VERSION 1:
// • Payment information
// • Default quotation terms
// • Quotation footer
//
// AUTHOR:
// Joel Butala
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    FileText,
    CreditCard,
    ScrollText,
    MessageSquareText,
} from "lucide-react";

import "../styles/dashboard/DashboardQuotationSettings.css";


function DashboardQuotationSettings() {

    const navigate = useNavigate();

// ==================================================
// API STATE
// ==================================================

const [loading, setLoading] = useState(true);

const [saving, setSaving] = useState(false);

const [error, setError] = useState("");

const [success, setSuccess] = useState("");


    // ==================================================
    // FORM STATE
    // ==================================================

    const [formData, setFormData] = useState({

        bankName: "",
        accountName: "",
        accountNumber: "",
        mobileMoneyNumber: "",
        mobileMoneyName: "",
        termsAndConditions: "",
        footerMessage: "",

    });


    // ==================================================
    // HANDLE INPUT CHANGE
    // ==================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData({

            ...formData,

            [name]: value,

        });

    };

// ==================================================
// LOAD QUOTATION SETTINGS
// ==================================================

useEffect(() => {

    const loadQuotationSettings = async () => {

        try {

            setLoading(true);

            setError("");

            const token =
                localStorage.getItem("cf_auth_token") ||
                sessionStorage.getItem("cf_auth_token");


            if (!token) {

                setError(
                    "Authentication session not found."
                );

                return;

            }


            const response = await fetch(

                `${import.meta.env.VITE_API_URL}/api/quotation-settings`,

                {

                    method: "GET",

                    headers: {

                        Authorization:
                            `Bearer ${token}`,

                    },

                }

            );


            const data =
                await response.json();


            if (!response.ok) {

                setError(

                    data.message ||
                    "Unable to load quotation settings."

                );

                return;

            }


            if (data.settings) {

                setFormData({

                    bankName:
                        data.settings.bankName || "",

                    accountName:
                        data.settings.accountName || "",

                    accountNumber:
                        data.settings.accountNumber || "",

                    mobileMoneyNumber:
                        data.settings.mobileMoneyNumber || "",

                    mobileMoneyName:
                        data.settings.mobileMoneyName || "",

                    termsAndConditions:
                        data.settings.termsAndConditions || "",

                    footerMessage:
                        data.settings.footerMessage || "",

                });

            }


        } catch (error) {

            console.error(
                "Load quotation settings error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );


        } finally {

            setLoading(false);

        }

    };


    loadQuotationSettings();

}, []);


    // ==================================================
    // BACK TO SETTINGS
    // ==================================================

    const handleBackToSettings = () => {

        navigate("/dashboard/settings");

    };


    // ==================================================
// SAVE QUOTATION SETTINGS
// ==================================================

const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    setSuccess("");

    setSaving(true);


    try {

        const token =
            localStorage.getItem("cf_auth_token") ||
            sessionStorage.getItem("cf_auth_token");


        if (!token) {

            setError(
                "Authentication session not found."
            );

            return;

        }


        const response = await fetch(

            `${import.meta.env.VITE_API_URL}/api/quotation-settings`,

            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,

                },

                body: JSON.stringify(
                    formData
                ),

            }

        );


        const data =
            await response.json();


        if (!response.ok) {

            setError(

                data.message ||
                "Unable to save quotation settings."

            );

            return;

        }


        setFormData({

            bankName:
                data.settings.bankName || "",

            accountName:
                data.settings.accountName || "",

            accountNumber:
                data.settings.accountNumber || "",

            mobileMoneyNumber:
                data.settings.mobileMoneyNumber || "",

            mobileMoneyName:
                data.settings.mobileMoneyName || "",

            termsAndConditions:
                data.settings.termsAndConditions || "",

            footerMessage:
                data.settings.footerMessage || "",

        });


        setSuccess(
            "Quotation settings saved successfully."
        );


    } catch (error) {

        console.error(
            "Save quotation settings error:",
            error
        );

        setError(
            "Unable to connect to the server."
        );


    } finally {

        setSaving(false);

    }

};

    return (

        <div className="quotation-settings-page">


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="quotation-settings-header">


                <button
                    type="button"
                    className="quotation-settings-back-button"
                    onClick={handleBackToSettings}
                >

                    <ArrowLeft size={18} />

                    Back to Settings

                </button>


                <div className="quotation-settings-title">

                    <div className="quotation-settings-title-icon">

                        <FileText size={26} />

                    </div>


                    <div>

                        <h1>
                            Quotation Settings
                        </h1>

                        <p>
                            Manage the default information used when creating quotations.
                        </p>

                    </div>

                </div>

            </div>

           

            {/* ==========================================
                FORM
            ========================================== */}

            <form
                className="quotation-settings-form"
                onSubmit={handleSubmit}
            >

                {error && (

    <div className="quotation-settings-message quotation-settings-error">

        {error}

    </div>

)}


{success && (

    <div className="quotation-settings-message quotation-settings-success">

        {success}

    </div>

)}


                {/* ======================================
                    PAYMENT INFORMATION
                ====================================== */}

                <section className="quotation-settings-card">


                    <div className="quotation-settings-card-header">

                        <div className="quotation-settings-card-icon">

                            <CreditCard size={22} />

                        </div>


                        <div>

                            <h2>
                                Payment Information
                            </h2>

                            <p>
                                These details will automatically appear on generated quotations.
                            </p>

                        </div>

                    </div>


                    <div className="quotation-settings-grid">


                        {/* BANK NAME */}

                        <div className="quotation-settings-form-group">

                            <label htmlFor="bankName">
                                Bank Name
                            </label>

                            <input
                                id="bankName"
                                name="bankName"
                                type="text"
                                placeholder="Enter bank name"
                                value={formData.bankName}
                                onChange={handleChange}
                            />

                        </div>


                        {/* ACCOUNT NAME */}

                        <div className="quotation-settings-form-group">

                            <label htmlFor="accountName">
                                Account Name
                            </label>

                            <input
                                id="accountName"
                                name="accountName"
                                type="text"
                                placeholder="Enter account name"
                                value={formData.accountName}
                                onChange={handleChange}
                            />

                        </div>


                        {/* ACCOUNT NUMBER */}

                        <div className="quotation-settings-form-group">

                            <label htmlFor="accountNumber">
                                Account Number
                            </label>

                            <input
                                id="accountNumber"
                                name="accountNumber"
                                type="text"
                                placeholder="Enter account number"
                                value={formData.accountNumber}
                                onChange={handleChange}
                            />

                        </div>


                        {/* MOBILE MONEY NUMBER */}

                        <div className="quotation-settings-form-group">

                            <label htmlFor="mobileMoneyNumber">
                                Mobile Money Number
                            </label>

                            <input
                                id="mobileMoneyNumber"
                                name="mobileMoneyNumber"
                                type="text"
                                placeholder="Enter Mobile Money number"
                                value={formData.mobileMoneyNumber}
                                onChange={handleChange}
                            />

                        </div>


                        {/* MOBILE MONEY NAME */}

                        <div className="quotation-settings-form-group">

                            <label htmlFor="mobileMoneyName">
                                Mobile Money Name
                            </label>

                            <input
                                id="mobileMoneyName"
                                name="mobileMoneyName"
                                type="text"
                                placeholder="Enter Mobile Money account name"
                                value={formData.mobileMoneyName}
                                onChange={handleChange}
                            />

                        </div>


                    </div>

                </section>


                {/* ======================================
                    TERMS & CONDITIONS
                ====================================== */}

                <section className="quotation-settings-card">


                    <div className="quotation-settings-card-header">

                        <div className="quotation-settings-card-icon">

                            <ScrollText size={22} />

                        </div>


                        <div>

                            <h2>
                                Terms & Conditions
                            </h2>

                            <p>
                                These terms will automatically appear on generated quotations.
                            </p>

                        </div>

                    </div>


                    <div className="quotation-settings-form-group">

                        <label htmlFor="termsAndConditions">
                            Default Terms & Conditions
                        </label>

                        <textarea
                            id="termsAndConditions"
                            name="termsAndConditions"
                            rows="8"
                            placeholder="Enter the default quotation terms and conditions..."
                            value={formData.termsAndConditions}
                            onChange={handleChange}
                        />

                    </div>

                </section>


                {/* ======================================
                    FOOTER MESSAGE
                ====================================== */}

                <section className="quotation-settings-card">


                    <div className="quotation-settings-card-header">

                        <div className="quotation-settings-card-icon">

                            <MessageSquareText size={22} />

                        </div>


                        <div>

                            <h2>
                                Quotation Footer
                            </h2>

                            <p>
                                Add a short message displayed at the bottom of quotations.
                            </p>

                        </div>

                    </div>


                    <div className="quotation-settings-form-group">

                        <label htmlFor="footerMessage">
                            Footer Message
                        </label>

                        <textarea
                            id="footerMessage"
                            name="footerMessage"
                            rows="4"
                            placeholder="Example: Thank you for choosing Concrete Finisher Uganda."
                            value={formData.footerMessage}
                            onChange={handleChange}
                        />

                    </div>

                </section>


                {/* ======================================
                    FORM ACTIONS
                ====================================== */}

                <div className="quotation-settings-actions">

                    <button
                        type="button"
                        className="quotation-settings-cancel-button"
                        onClick={handleBackToSettings}
                    >
                        Cancel
                    </button>


                    <button
    type="submit"
    className="quotation-settings-save-button"
    disabled={saving}
>
    {saving
        ? "Saving..."
        : "Save Settings"
    }
</button>
                </div>


            </form>

        </div>

    );

}


export default DashboardQuotationSettings;