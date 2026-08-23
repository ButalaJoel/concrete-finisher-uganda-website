// =========================================================
// REACT IMPORTS
// =========================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";


// =========================================================
// LUCIDE ICONS
// These are used inside the login form.
// =========================================================

import {
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    LogIn,
} from "lucide-react";


// =========================================================
// SOCIAL MEDIA ICONS
// These require the react-icons package.
// =========================================================

import {
    FaTiktok,
    FaInstagram,
    FaFacebookF,
    FaYoutube,
} from "react-icons/fa";


// =========================================================
// COMPANY LOGO
// Login.jsx is inside src/pages.
// ../ takes us back into src.
// =========================================================

import logo from "../assets/logo.png";


// =========================================================
// LOGIN PAGE STYLES
// =========================================================

import "../styles/Login.css";


// =========================================================
// LOGIN COMPONENT
// =========================================================

function Login() {


    // =====================================================
    // NAVIGATION
    // Allows us to move to another route.
    // =====================================================

    const navigate = useNavigate();


    // =====================================================
    // FORM STATE
    // Stores the information entered by the user.
    // =====================================================

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);

    // =====================================================
    // LOGIN STATE
    // =====================================================

    // Prevents multiple login requests while one
    // request is already being processed.

    const [loading, setLoading] = useState(false);

    // Stores backend login errors.

    const [error, setError] = useState("");


    // =====================================================
    // FORM SUBMISSION
    // Authentication will be connected later.
    // For now, submitting the form opens the dashboard.
    // =====================================================

    // =====================================================
// FORM SUBMISSION
//
// Sends administrator credentials to the backend.
// =====================================================

const handleSubmit = async (event) => {

    // Prevent normal browser form submission.

    event.preventDefault();


    // Clear any previous login error.

    setError("");


    // Prevent duplicate login requests.

    setLoading(true);


    try {

        // ==============================================
        // SEND LOGIN REQUEST
        // ==============================================

        const response = await fetch(

            `${import.meta.env.VITE_API_URL}/api/auth/login`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({

                    email,

                    password,

                }),

            }

        );


        // ==============================================
        // READ BACKEND RESPONSE
        // ==============================================

        const data = await response.json();


        // ==============================================
        // HANDLE FAILED LOGIN
        // ==============================================

        if (!response.ok) {

            setError(

                data.message ||
                "Unable to sign in. Please try again."

            );

            return;

        }


        // ==============================================
        // VERIFY TOKEN EXISTS
        // ==============================================

        if (!data.token) {

            setError(
                "Login succeeded but no authentication token was received."
            );

            return;

        }


        // ==============================================
        // STORE AUTHENTICATION DATA
        // ==============================================

        // Remember Me determines whether authentication
        // survives after the browser is closed.

        const storage = rememberMe
            ? localStorage
            : sessionStorage;


        storage.setItem(

            "cf_auth_token",

            data.token

        );


        storage.setItem(

            "cf_admin",

            JSON.stringify(data.admin)

        );


        // ==============================================
        // OPEN PROTECTED DASHBOARD
        // ==============================================

        navigate("/dashboard");


    } catch (error) {

        console.error(
            "Login request error:",
            error
        );


        setError(
            "Unable to connect to the server. Please try again."
        );


    } finally {

        // Re-enable login button.

        setLoading(false);

    }

};

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <main className="cf-login-page">


            {/* =================================================
                MAIN LOGIN CARD

                LEFT SIDE:
                White company branding section.

                RIGHT SIDE:
                Dark brown administrator login section.
            ================================================= */}

            <div className="cf-login-card">


                {/* =============================================
                    LEFT SIDE
                    COMPANY BRANDING
                ============================================= */}

                <section className="cf-login-brand-side">


                    {/* =========================================
                        COMPANY LOGO
                    ========================================= */}

                    <div className="cf-login-logo-wrapper">

                        <img
                            src={logo}
                            alt="Concrete Finisher Uganda"
                            className="cf-login-logo"
                        />

                    </div>


                    {/* =========================================
                        BRAND MESSAGE
                    ========================================= */}

                    <div className="cf-login-brand-content">


                        <p className="cf-login-eyebrow">
                            Admin Portal
                        </p>


                        <h1 className="cf-login-brand-title">
                            Built for Precision.
                            <br />
                            Designed for Control.
                        </h1>


                        <p className="cf-login-brand-description">
                            Manage projects, quotations, reports and
                            Concrete Finisher operations from one
                            secure dashboard.
                        </p>


                    </div>


                    {/* =========================================
                        SOCIAL MEDIA
                    ========================================= */}

                    <div className="cf-login-social-section">


                        <p className="cf-login-social-title">
                            Follow Concrete Finisher
                        </p>


                        <div className="cf-login-social-links">


                            {/* TIKTOK */}

                            <a
                                href="#"
                                className="cf-login-social-link"
                                aria-label="TikTok"
                            >
                                <FaTiktok />
                            </a>


                            {/* INSTAGRAM */}

                            <a
                                href="#"
                                className="cf-login-social-link"
                                aria-label="Instagram"
                            >
                                <FaInstagram />
                            </a>


                            {/* FACEBOOK */}

                            <a
                                href="#"
                                className="cf-login-social-link"
                                aria-label="Facebook"
                            >
                                <FaFacebookF />
                            </a>


                            {/* YOUTUBE */}

                            <a
                                href="#"
                                className="cf-login-social-link"
                                aria-label="YouTube"
                            >
                                <FaYoutube />
                            </a>


                        </div>


                    </div>


                </section>


                {/* =============================================
                    RIGHT SIDE
                    LOGIN FORM
                ============================================= */}

                <section className="cf-login-form-side">


                    {/* Decorative circle */}

                    <div className="cf-login-decoration-one"></div>

                    <div className="cf-login-decoration-two"></div>


                    {/* =========================================
                        LOGIN CONTENT
                    ========================================= */}

                    <div className="cf-login-form-container">


                        {/* =====================================
                            HEADER
                        ===================================== */}

                        <div className="cf-login-header">


                            <p className="cf-login-header-eyebrow">
                                Welcome Back
                            </p>


                            <h2>
                                Sign In
                            </h2>


                            <p className="cf-login-header-description">
                                Sign in to access your management
                                dashboard.
                            </p>


                        </div>


                        {/* =====================================
                            LOGIN FORM
                        ===================================== */}

                        <form
                            className="cf-login-form"
                            onSubmit={handleSubmit}
                        >
                        {error && (

                    <div
                        className="cf-login-error"
                        role="alert"
                    >

                    {error}

                    </div>

                    )}    

                            


                            {/* =================================
                                EMAIL ADDRESS
                            ================================= */}

                            <div className="cf-login-form-group">


                                <label htmlFor="email">
                                    Email Address
                                </label>


                                <div className="cf-login-input-wrapper">


                                    <Mail
                                        className="cf-login-input-icon"
                                        size={18}
                                    />


                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                    />


                                </div>


                            </div>


                            {/* =================================
                                PASSWORD
                            ================================= */}

                            <div className="cf-login-form-group">


                                <label htmlFor="password">
                                    Password
                                </label>


                                <div className="cf-login-input-wrapper">


                                    <LockKeyhole
                                        className="cf-login-input-icon"
                                        size={18}
                                    />


                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        required
                                    />


                                    {/* PASSWORD VISIBILITY */}

                                    <button
                                        type="button"
                                        className="cf-login-password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        aria-label="Toggle password visibility"
                                    >

                                        {showPassword
                                            ? <EyeOff size={18} />
                                            : <Eye size={18} />
                                        }

                                    </button>


                                </div>


                            </div>


                            {/* =================================
                                REMEMBER ME AND FORGOT PASSWORD
                            ================================= */}

                            <div className="cf-login-options">


                                <label className="cf-login-remember-me">


                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(event) =>
                                            setRememberMe(
                                                event.target.checked
                                            )
                                        }
                                    />


                                    <span>
                                        Remember me
                                    </span>


                                </label>


                                <button
                                    type="button"
                                    className="cf-login-forgot-button"
                                >
                                    Forgot Password?
                                </button>


                            </div>


                            {/* =================================
                                SIGN IN BUTTON
                            ================================= */}

                            <button
                                type="submit"
                                className="cf-login-submit-button"
                                disabled={loading}
                            >

                                <LogIn size={18} />

                                <span>
                                    {loading
                                    ? "Signing In..."
                                    : "Sign In"
                                    }
                                </span>
                                

                            </button>


                        </form>


                        {/* =====================================
                            FOOTER
                        ===================================== */}

                        <p className="cf-login-footer">
                            Secure access for authorized
                            administrators only.
                        </p>


                    </div>


                </section>


            </div>


        </main>

    );

}


// =========================================================
// EXPORT
// =========================================================

export default Login;