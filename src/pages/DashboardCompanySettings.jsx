// ======================================================
// FILE: DashboardCompanySettings.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Allows the administrator to manage company
// information and branding.
//
// FEATURES:
// • Load company profile from database
// • Create first company profile
// • Update company information
// • Upload company logo
// • Preview company logo
// • Loading states
// • Error states
// • Save state
// ======================================================


// ======================================================
// IMPORTS
// ======================================================

import {
    ArrowLeft,
    Building2,
    Camera
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "../styles/dashboard/DashboardCompanySettings.css";


// ======================================================
// API URL
//
// Uses the frontend environment variable.
//
// Example:
//
// VITE_API_URL=http://localhost:5000
// ======================================================

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/company/profile`;


// ======================================================
// COMPONENT
// ======================================================

function DashboardCompanySettings() {

    // ==================================================
    // NAVIGATION
    // ==================================================

    const navigate = useNavigate();


    // ==================================================
    // FILE INPUT REFERENCE
    //
    // Allows the Change Logo button to open the hidden
    // file input.
    // ==================================================

    const fileInputRef = useRef(null);


    // ==================================================
    // COMPANY FORM STATE
    // ==================================================

    const [
        formData,
        setFormData
    ] = useState({

        companyName: "",

        email: "",

        phoneNumber: "",

        whatsappNumber: "",

        physicalAddress: "",

        website: "",

        description: "",

    });


    // ==================================================
    // LOGO STATE
    //
    // selectedLogo:
    // The actual image file selected by the user.
    //
    // logoPreview:
    // The URL currently displayed in the preview.
    // ==================================================

    const [
        selectedLogo,
        setSelectedLogo
    ] = useState(null);


    const [
        logoPreview,
        setLogoPreview
    ] = useState("");


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
    // LOAD COMPANY PROFILE
    //
    // GET:
    //
    // /api/company/profile
    // ==================================================

    useEffect(() => {

        const loadCompanyProfile = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await fetch(API_URL);


                // ==========================================
                // NO COMPANY PROFILE YET
                //
                // This is normal when the company profile
                // has never been created.
                // ==========================================

                if (response.status === 404) {

                    setLoading(false);

                    return;

                }


                if (!response.ok) {

                    throw new Error(
                        "Unable to load company information."
                    );

                }


                const company =
                    await response.json();


                // ==========================================
                // POPULATE FORM
                // ==========================================

                setFormData({

                    companyName:
                        company.companyName || "",

                    email:
                        company.email || "",

                    phoneNumber:
                        company.phoneNumber || "",

                    whatsappNumber:
                        company.whatsappNumber || "",

                    physicalAddress:
                        company.physicalAddress || "",

                    website:
                        company.website || "",

                    description:
                        company.description || "",

                });


                // ==========================================
                // LOAD SAVED LOGO
                // ==========================================

                if (company.logo) {

                    setLogoPreview(
                        `${import.meta.env.VITE_API_URL}${company.logo}`
                    );

                }

            } catch (error) {

                console.error(
                    "Load company profile error:",
                    error
                );


                setError(
                    "Unable to load company information. Please try again."
                );

            } finally {

                setLoading(false);

            }

        };


        loadCompanyProfile();

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


        // Clear old success message when editing again.

        setSuccessMessage("");

    };


    // ==================================================
    // HANDLE LOGO SELECTION
    // ==================================================

    const handleLogoChange = (event) => {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        // Basic image validation.

        if (!file.type.startsWith("image/")) {

            setError(
                "Please select a valid image file."
            );

            return;

        }


        setError("");


        setSelectedLogo(file);


        // Create a local preview immediately.

        setLogoPreview(
            URL.createObjectURL(file)
        );


        setSuccessMessage("");

    };


    // ==================================================
    // OPEN FILE PICKER
    // ==================================================

    const handleChangeLogoClick = () => {

        fileInputRef.current?.click();

    };


    // ==================================================
    // SAVE COMPANY PROFILE
    //
    // PUT:
    //
    // /api/company/profile
    //
    // Uses FormData because we may be uploading an image.
    // ==================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        try {

            setSaving(true);

            setError("");

            setSuccessMessage("");


            // ==============================================
            // CREATE FORMDATA
            // ==============================================

            const companyFormData =
                new FormData();


            companyFormData.append(
                "companyName",
                formData.companyName
            );


            companyFormData.append(
                "email",
                formData.email
            );


            companyFormData.append(
                "phoneNumber",
                formData.phoneNumber
            );


            companyFormData.append(
                "whatsappNumber",
                formData.whatsappNumber
            );


            companyFormData.append(
                "physicalAddress",
                formData.physicalAddress
            );


            companyFormData.append(
                "website",
                formData.website
            );


            companyFormData.append(
                "description",
                formData.description
            );


            // ==============================================
            // ADD LOGO IF USER SELECTED A NEW ONE
            //
            // IMPORTANT:
            //
            // "companyLogo" must exactly match:
            //
            // uploadCompanyLogo.single("companyLogo")
            // ==============================================

            if (selectedLogo) {

                companyFormData.append(
                    "companyLogo",
                    selectedLogo
                );

            }


            // ==============================================
            // SEND REQUEST
            // ==============================================

            const response =
                await fetch(

                    API_URL,

                    {

                        method: "PUT",

                        body: companyFormData,

                    }

                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(

                    data.message ||

                    "Unable to save company information."

                );

            }


            // ==============================================
            // UPDATE FORM WITH SAVED DATA
            // ==============================================

            if (data.company) {

                setFormData({

                    companyName:
                        data.company.companyName || "",

                    email:
                        data.company.email || "",

                    phoneNumber:
                        data.company.phoneNumber || "",

                    whatsappNumber:
                        data.company.whatsappNumber || "",

                    physicalAddress:
                        data.company.physicalAddress || "",

                    website:
                        data.company.website || "",

                    description:
                        data.company.description || "",

                });


                // Update preview using saved server logo.

                if (data.company.logo) {

                    setLogoPreview(
                        `${import.meta.env.VITE_API_URL}${data.company.logo}`
                    );

                }

            }


            // Clear selected file because it is now saved.

            setSelectedLogo(null);


            setSuccessMessage(
                "Company information saved successfully."
            );


        } catch (error) {

            console.error(
                "Save company profile error:",
                error
            );


            setError(
                error.message ||
                "Unable to save company information."
            );


        } finally {

            setSaving(false);

        }

    };


    // ==================================================
    // LOADING STATE
    // ==================================================

    if (loading) {

        return (

            <div className="company-settings-page">

                <div className="company-settings-loading">

                    Loading company information...

                </div>

            </div>

        );

    }


    // ==================================================
    // COMPONENT RETURN
    // ==================================================

    return (

        <div className="company-settings-page">


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="company-settings-header">


                {/* BACK BUTTON */}

                <button
                    type="button"
                    className="settings-back-button"
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

                <div className="company-settings-title">

                    <h1>
                        Company Profile
                    </h1>

                    <p>
                        Manage Concrete Finisher business details.
                    </p>

                </div>

            </div>


            {/* ==========================================
                ERROR MESSAGE
            ========================================== */}

            {error && (

                <div className="company-settings-error">

                    <p>
                        {error}
                    </p>

                </div>

            )}


            {/* ==========================================
                SUCCESS MESSAGE
            ========================================== */}

            {successMessage && (

                <div className="company-settings-success">

                    <p>
                        {successMessage}
                    </p>

                </div>

            )}


            {/* ==========================================
                COMPANY PROFILE FORM
            ========================================== */}

            <form
                className="company-settings-card"
                onSubmit={handleSubmit}
            >


                {/* ======================================
                    COMPANY LOGO
                ====================================== */}

                <div className="company-logo-section">


                    {/* LOGO PREVIEW */}

                    <div className="company-logo-preview">

                        {logoPreview ? (

                            <img
                                src={logoPreview}
                                alt="Company logo"
                            />

                        ) : (

                            <Building2 size={42} />

                        )}

                    </div>


                    {/* LOGO CONTENT */}

                    <div className="company-logo-content">

                        <h2>
                            Company Logo
                        </h2>

                        <p>
                            Add or update your company logo.
                        </p>


                        {/* HIDDEN FILE INPUT */}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            style={{
                                display: "none"
                            }}
                        />


                        {/* CHANGE LOGO BUTTON */}

                        <button
                            type="button"
                            className="change-logo-button"
                            onClick={
                                handleChangeLogoClick
                            }
                        >

                            <Camera size={17} />

                            Change Logo

                        </button>

                    </div>


                </div>


                {/* DIVIDER */}

                <div className="company-settings-divider" />


                {/* ======================================
                    COMPANY INFORMATION
                ====================================== */}

                <div className="company-form-grid">


                    <div className="company-form-group">

                        <label htmlFor="companyName">
                            Company Name
                        </label>

                        <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Enter company name"
                            required
                        />

                    </div>


                    <div className="company-form-group">

                        <label htmlFor="companyEmail">
                            Company Email
                        </label>

                        <input
                            id="companyEmail"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter company email"
                        />

                    </div>


                    <div className="company-form-group">

                        <label htmlFor="companyPhone">
                            Phone Number
                        </label>

                        <input
                            id="companyPhone"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter company phone number"
                        />

                    </div>


                    <div className="company-form-group">

                        <label htmlFor="whatsappNumber">
                            WhatsApp Number
                        </label>

                        <input
                            id="whatsappNumber"
                            name="whatsappNumber"
                            type="tel"
                            value={formData.whatsappNumber}
                            onChange={handleChange}
                            placeholder="Enter WhatsApp number"
                        />

                    </div>


                    <div className="company-form-group">

                        <label htmlFor="physicalAddress">
                            Physical Address
                        </label>

                        <input
                            id="physicalAddress"
                            name="physicalAddress"
                            type="text"
                            value={formData.physicalAddress}
                            onChange={handleChange}
                            placeholder="Enter company physical address"
                        />

                    </div>


                    <div className="company-form-group">

                        <label htmlFor="website">
                            Website
                        </label>

                        <input
                            id="website"
                            name="website"
                            type="text"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="Enter company website"
                        />

                    </div>


                </div>


                {/* ======================================
                    COMPANY DESCRIPTION
                ====================================== */}

                <div className="company-form-group company-description-group">

                    <label htmlFor="companyDescription">
                        Company Description
                    </label>

                    <textarea
                        id="companyDescription"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Write a short description about the company"
                        rows="5"
                    />

                </div>


                {/* ======================================
                    FORM ACTIONS
                ====================================== */}

                <div className="company-form-actions">


                    <button
                        type="button"
                        className="cancel-company-button"
                        onClick={() =>
                            navigate("/dashboard/settings")
                        }
                        disabled={saving}
                    >

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="save-company-button"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : "Save Changes"
                        }

                    </button>


                </div>


            </form>


        </div>

    );

}

export default DashboardCompanySettings;