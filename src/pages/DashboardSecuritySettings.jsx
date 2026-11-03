import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    ShieldCheck,
    LockKeyhole,
    Eye,
    EyeOff,
} from "lucide-react";

import "../styles/dashboard/DashboardSecuritySettings.css";
import { getAuthHeaders } from "../utils/auth";


function DashboardSecuritySettings() {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleBackToSettings = () => {
    navigate("/dashboard/settings");
   };


    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    // Sends the change to PUT /api/auth/change-password.
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (saving) return;

        if (newPassword.length < 8) {
            setStatus({ type: "error", message: "The new password must be at least 8 characters." });
            return;
        }
        if (newPassword !== confirmPassword) {
            setStatus({ type: "error", message: "The new passwords don't match. Type the same password in both boxes." });
            return;
        }

        setSaving(true);
        setStatus({ type: "", message: "" });

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeaders(),
                    },
                    body: JSON.stringify({ currentPassword, newPassword }),
                }
            );
            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.message || "Unable to update password.");
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setStatus({ type: "success", message: "Password updated. Use the new password next time you sign in." });
        } catch (error) {
            setStatus({ type: "error", message: error.message || "Unable to update password." });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setStatus({ type: "", message: "" });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);

    };


    return (

        <div className="security-settings-page">


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="security-settings-header">

                <button
    className="settings-back-button"
    type="button"
    onClick={handleBackToSettings}
>
    <ArrowLeft size={18} />
    Back to Settings
</button>


                <div className="security-settings-title">

                    <h1>Security Settings</h1>

                    <p>
                        Manage your password and account security.
                    </p>

                </div>

            </div>


            {/* ==========================================
                SECURITY CARD
            ========================================== */}

            <div className="security-settings-card">


                {/* SECURITY HEADER */}

                <div className="security-card-intro">

                    <div className="security-card-icon">
                        <ShieldCheck size={25} />
                    </div>


                    <div className="security-card-content">

                        <h2>Change Password</h2>

                        <p>
                            Use a strong password to keep your administrator account secure.
                        </p>

                    </div>

                </div>

                {status.message && (
                    <p
                        className={`security-status security-status--${status.type}`}
                        role={status.type === "error" ? "alert" : "status"}
                    >
                        {status.message}
                    </p>
                )}

                {/* PASSWORD FORM */}

                <form
                    className="security-password-form"
                    onSubmit={handleSubmit}
                    aria-busy={saving}
                >


                    {/* CURRENT PASSWORD */}

                    <div className="security-form-group">

                        <label htmlFor="currentPassword">
                            Current Password
                        </label>


                        <div className="password-input-wrapper">

                            <LockKeyhole
                                className="password-input-icon"
                                size={18}
                            />


                            <input
                                id="currentPassword"
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your current password"
                                value={currentPassword}
                                onChange={(event) =>
                                    setCurrentPassword(event.target.value)
                                }
                            />


                            <button
                                type="button"
                                className="password-toggle-button"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        !showCurrentPassword
                                    )
                                }
                                aria-label="Toggle current password visibility"
                            >
                                {showCurrentPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />
                                }
                            </button>

                        </div>

                    </div>


                    {/* NEW PASSWORD */}

                    <div className="security-form-group">

                        <label htmlFor="newPassword">
                            New Password
                        </label>


                        <div className="password-input-wrapper">

                            <LockKeyhole
                                className="password-input-icon"
                                size={18}
                            />


                            <input
                                id="newPassword"
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(event.target.value)
                                }
                            />


                            <button
                                type="button"
                                className="password-toggle-button"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                                aria-label="Toggle new password visibility"
                            >
                                {showNewPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />
                                }
                            </button>

                        </div>


                        <span className="password-helper-text">
                            Use at least 8 characters.
                        </span>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="security-form-group">

                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>


                        <div className="password-input-wrapper">

                            <LockKeyhole
                                className="password-input-icon"
                                size={18}
                            />


                            <input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                            />


                            <button
                                type="button"
                                className="password-toggle-button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />
                                }
                            </button>

                        </div>

                    </div>


                    {/* FORM ACTIONS */}

                    <div className="security-form-actions">

                        <button
                            type="button"
                            className="cancel-security-button"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="update-password-button"
                            disabled={saving}
                        >
                            {saving ? "Updating password…" : "Update password"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default DashboardSecuritySettings;