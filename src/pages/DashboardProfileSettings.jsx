// ======================================================
// FILE: DashboardProfileSettings.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Allows the administrator to manage personal
// profile information.
//
// RESPONSIBILITIES:
// • Load administrator profile
// • Update full name
// • Update email address
// • Update phone number
// • Upload profile photo
// • Preview selected profile photo
// • Save profile changes
// • Display loading and error states
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORTS
// ======================================================

import {

    ArrowLeft,
    User,
    Camera

} from "lucide-react";

import {

    useEffect,
    useState

} from "react";

import {

    useNavigate

} from "react-router-dom";

import "../styles/dashboard/DashboardProfileSettings.css";


// ======================================================
// API URL
// ======================================================

const API_URL =
   `${import.meta.env.VITE_API_URL}/api/admin/profile`;

const SERVER_URL =
      import.meta.env.VITE_API_URL;


// ======================================================
// COMPONENT
// ======================================================

function DashboardProfileSettings() {


    // ==================================================
    // NAVIGATION
    // ==================================================

    const navigate =
        useNavigate();


    // ==================================================
    // PROFILE FORM STATE
    //
    // Stores the administrator information shown
    // inside the form.
    // ==================================================

    const [

        profile,
        setProfile

    ] = useState({

        fullName: "",

        email: "",

        phoneNumber: "",

    });


    // ==================================================
    // PROFILE PHOTO STATE
    //
    // selectedPhoto:
    // Stores the actual image file selected by the user.
    //
    // photoPreview:
    // Stores the temporary image URL used to preview
    // the selected image before saving.
    // ==================================================

    const [

        selectedPhoto,
        setSelectedPhoto

    ] = useState(null);


    const [

        photoPreview,
        setPhotoPreview

    ] = useState("");


    // ==================================================
    // PAGE STATES
    // ==================================================

    const [

        loading,
        setLoading

    ] = useState(true);


    const [

        error,
        setError

    ] = useState("");


    const [

        success,
        setSuccess

    ] = useState("");


    const [

        saving,
        setSaving

    ] = useState(false);


    // ==================================================
    // LOAD ADMINISTRATOR PROFILE
    //
    // Runs when the page opens.
    //
    // GET:
    //
    // /api/admin/profile
    // ==================================================

    useEffect(() => {


        const fetchProfile =
            async () => {


                try {


                    // Reset previous error

                    setError("");


                    // Send request to backend

                    const response =
                        await fetch(
                            API_URL
                        );


                    // Convert response to JSON

                    const data =
                        await response.json();


                    // Handle backend error

                    if (!response.ok) {

                        throw new Error(

                            data.message ||

                            "Unable to load profile information."

                        );

                    }


                    // Store profile information

                    setProfile({

                        fullName:

                            data.fullName || "",


                        email:

                            data.email || "",


                        phoneNumber:

                            data.phoneNumber || "",

                    });


                    // Load saved profile photo

                    if (data.profilePhoto) {

                        setPhotoPreview(

                            `${SERVER_URL}${data.profilePhoto}`

                        );

                    }


                } catch (error) {


                    setError(

                        error.message ||

                        "Something went wrong while loading your profile."

                    );


                } finally {


                    // Stop loading whether successful
                    // or unsuccessful.

                    setLoading(false);


                }


            };


        fetchProfile();


    }, []);


    // ==================================================
    // HANDLE FORM FIELD CHANGES
    //
    // Updates the correct field using its name.
    // ==================================================

    const handleChange =
        (event) => {


            const {

                name,
                value

            } = event.target;


            setProfile(

                (previousProfile) => ({

                    ...previousProfile,

                    [name]: value,

                })

            );


        };


    // ==================================================
    // HANDLE PHOTO SELECTION
    //
    // Runs when the administrator chooses a new image.
    // ==================================================

    const handlePhotoChange =
        (event) => {


            const file =
                event.target.files?.[0];


            // Stop if no file was selected

            if (!file) {

                return;

            }


            // Store actual image file

            setSelectedPhoto(
                file
            );


            // Create temporary preview

            setPhotoPreview(

                URL.createObjectURL(
                    file
                )

            );


            // Remove old messages

            setError("");

            setSuccess("");


        };


    // ==================================================
    // HANDLE FORM SUBMISSION
    //
    // Sends profile information and optional photo
    // using FormData.
    //
    // PUT:
    //
    // /api/admin/profile
    // ==================================================

    const handleSubmit =
        async (event) => {


            event.preventDefault();


            try {


                // Start saving state

                setSaving(true);


                // Reset messages

                setError("");

                setSuccess("");


                // Create FormData because the request
                // may contain an image file.

                const formData =
                    new FormData();


                // Add text fields

                formData.append(

                    "fullName",

                    profile.fullName

                );


                formData.append(

                    "email",

                    profile.email

                );


                formData.append(

                    "phoneNumber",

                    profile.phoneNumber

                );


                // Add image only if the administrator
                // selected a new one.

                if (selectedPhoto) {

                    formData.append(

                        "profilePhoto",

                        selectedPhoto

                    );

                }


                // Send update request

                const response =
                    await fetch(

                        API_URL,

                        {

                            method: "PUT",

                            body: formData,

                        }

                    );


                // Convert response

                const data =
                    await response.json();


                // Handle backend error

                if (!response.ok) {

                    throw new Error(

                        data.message ||

                        "Unable to update your profile."

                    );

                }


                // Update form using saved data

                setProfile({

                    fullName:

                        data.fullName || "",


                    email:

                        data.email || "",


                    phoneNumber:

                        data.phoneNumber || "",

                });


                // Update saved photo preview

                if (data.profilePhoto) {

                    setPhotoPreview(

                        `${SERVER_URL}${data.profilePhoto}`

                    );

                }


                // Clear selected file because it has
                // now been successfully uploaded.

                setSelectedPhoto(
                    null
                );


                // Show success message

                setSuccess(

                    "Profile updated successfully."

                );


            } catch (error) {


                setError(

                    error.message ||

                    "Something went wrong while updating your profile."

                );


            } finally {


                // Stop saving state

                setSaving(false);


            }


        };


    // ==================================================
    // PAGE LOADING STATE
    // ==================================================

    if (loading) {

        return (

            <div className="profile-settings-page">


                <div className="profile-settings-card">

                    <p>
                        Loading profile information...
                    </p>

                </div>


            </div>

        );

    }


    

    // ==================================================
    // PAGE
    // ==================================================

    return (

        <div className="profile-settings-page">


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="profile-settings-header">


                {/* BACK BUTTON */}

                <button
                    type="button"
                    className="settings-back-button"
                    onClick={() =>
                        navigate(
                            "/dashboard/settings"
                        )
                    }
                >

                    <ArrowLeft size={18} />

                    <span>
                        Back to Settings
                    </span>

                </button>


                {/* TITLE */}

                <div className="profile-settings-title">


                    <h1>
                        Profile Settings
                    </h1>


                    <p>
                        Manage your personal account information.
                    </p>


                </div>


            </div>


            {/* ==========================================
                SUCCESS MESSAGE
            ========================================== */}

            {success && (

                <div className="profile-success-message">

                    {success}

                </div>

            )}


            {/* ==========================================
                FORM ERROR MESSAGE
            ========================================== */}

            {error && (

                <div className="profile-error-message">

                    {error}

                </div>

            )}


            {/* ==========================================
                PROFILE FORM
            ========================================== */}

            <form
                className="profile-settings-card"
                onSubmit={handleSubmit}
            >


                {/* ======================================
                    PROFILE PHOTO
                ====================================== */}

                <div className="profile-photo-section">


                    {/* AVATAR */}

                    <div className="profile-avatar">


                        {photoPreview ? (

                            <img
                                src={photoPreview}
                                alt="Administrator profile"
                            />

                        ) : (

                            <User size={42} />

                        )}


                    </div>


                    {/* PHOTO CONTENT */}

                    <div className="profile-photo-content">


                        <h2>
                            Profile Photo
                        </h2>


                        <p>
                            Add or update your profile picture.
                        </p>


                        {/* Hidden file input */}

                        <input
                            id="profilePhoto"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            hidden
                        />


                        {/* Label opens hidden file input */}

                        <label
                            htmlFor="profilePhoto"
                            className="change-photo-button"
                        >

                            <Camera size={17} />

                            Change Photo

                        </label>


                    </div>


                </div>


                {/* ======================================
                    FORM FIELDS
                ====================================== */}

                <div className="profile-form-grid">


                    {/* FULL NAME */}

                    <div className="profile-form-group">


                        <label htmlFor="fullName">
                            Full Name
                        </label>


                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={profile.fullName}
                            onChange={handleChange}
                            required
                        />


                    </div>


                    {/* EMAIL */}

                    <div className="profile-form-group">


                        <label htmlFor="email">
                            Email Address
                        </label>


                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={profile.email}
                            onChange={handleChange}
                            required
                        />


                    </div>


                    {/* PHONE */}

                    <div className="profile-form-group">


                        <label htmlFor="phoneNumber">
                            Phone Number
                        </label>


                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={profile.phoneNumber}
                            onChange={handleChange}
                        />


                    </div>


                </div>


                {/* ======================================
                    FORM ACTIONS
                ====================================== */}

                <div className="profile-form-actions">


                    <button
                        type="button"
                        className="cancel-profile-button"
                        onClick={() =>
                            navigate(
                                "/dashboard/settings"
                            )
                        }
                        disabled={saving}
                    >

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="save-profile-button"
                        disabled={saving}
                    >

                        {saving

                            ? "Saving Changes..."

                            : "Save Changes"

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

export default DashboardProfileSettings;