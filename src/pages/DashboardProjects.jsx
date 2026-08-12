// ======================================================
// FILE: DashboardProjects.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Admin project management page.
//
// RESPONSIBILITIES:
// • Create projects
// • Edit projects
// • Delete projects
// • Set project status
// • Set project value
// • Upload project images
// • Display existing projects
// • Handle loading states
// • Handle error states
// • Handle success messages
// • Handle project pagination
//
// AUTHOR:
// Joel Butala
// ======================================================

import "../styles/dashboard/DashboardProjects.css";

import {
    useEffect,
    useState
} from "react";


// ======================================================
// API BASE URL
// ======================================================

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/projects`;


// ======================================================
// EMPTY FORM
// ======================================================

const emptyForm = {

    title: "",

    slug: "",

    category: "",

    service: "",

    client: "",

    location: "",

    industry: "",

    surfaceArea: "",

    completionTime: "",

    system: "",

    status: "Pending",

    projectValue: "",

    shortDescription: "",

    overview: "",

    challenge: "",

    solution: "",

};


// ======================================================
// DASHBOARD PROJECTS
// ======================================================

function DashboardProjects() {


    // ==================================================
    // FORM STATE
    // ==================================================

    const [formData, setFormData] =
        useState(emptyForm);


    // ==================================================
    // PROJECT LIST
    // ==================================================

    const [projects, setProjects] =
        useState([]);


    // ==================================================
    // PAGINATION STATE
    // ==================================================

    const [currentPage, setCurrentPage] =
        useState(1);


    const [pagination, setPagination] =
        useState({

            currentPage: 1,

            totalPages: 1,

            totalProjects: 0,

            limit: 6,

            hasNextPage: false,

            hasPreviousPage: false,

        });


    // ==================================================
    // EDIT MODE
    //
    // null = creating
    // project object = editing
    // ==================================================

    const [editingProject, setEditingProject] =
        useState(null);


    // ==================================================
    // IMAGE STATE
    // ==================================================

    const [heroImage, setHeroImage] =
        useState(null);


    const [beforeImages, setBeforeImages] =
        useState([]);


    const [afterImages, setAfterImages] =
        useState([]);


    // ==================================================
    // IMAGE PREVIEW STATE
    // ==================================================

    const [heroPreview, setHeroPreview] =
        useState("");


    const [beforePreviews, setBeforePreviews] =
        useState([]);


    const [afterPreviews, setAfterPreviews] =
        useState([]);


    // ==================================================
    // PROJECT LIST LOADING STATE
    // ==================================================

    const [projectsLoading, setProjectsLoading] =
        useState(true);


    // ==================================================
    // FORM LOADING STATE
    // ==================================================

    const [formLoading, setFormLoading] =
        useState(false);


    // ==================================================
    // DELETE LOADING STATE
    // ==================================================

    const [deleteLoading, setDeleteLoading] =
        useState(null);


    // ==================================================
    // PROJECT LIST ERROR
    // ==================================================

    const [projectsError, setProjectsError] =
        useState("");


    // ==================================================
    // FORM ERROR
    // ==================================================

    const [formError, setFormError] =
        useState("");


    // ==================================================
    // SUCCESS MESSAGE
    // ==================================================

    const [message, setMessage] =
        useState("");


    // ==================================================
    // GET IMAGE URL
    // ==================================================

    const getImageUrl = (imagePath) => {

        if (!imagePath) {

            return "";

        }


        if (
            imagePath.startsWith("http://") ||
            imagePath.startsWith("https://")
        ) {

            return imagePath;

        }


        return `${import.meta.env.VITE_API_URL}${imagePath}`;

    };


    // ==================================================
    // FETCH PROJECTS
    //
    // This function loads a specific backend page.
    //
    // Example:
    //
    // fetchProjects(1)
    // fetchProjects(2)
    // fetchProjects(3)
    //
    // ==================================================

    const fetchProjects = async (page = 1) => {

        setProjectsLoading(true);

        setProjectsError("");


        try {

            const response =
                await fetch(

                    `${API_URL}?page=${page}&limit=6`

                );


            const result =
                await response.json();


            // ==========================================
            // HANDLE API ERROR
            // ==========================================

            if (!response.ok) {

                throw new Error(

                    result.message ||
                    "Unable to load projects."

                );

            }


            // ==========================================
            // SAVE PROJECTS
            // ==========================================

            setProjects(

                result.data || []

            );


            // ==========================================
            // SAVE PAGINATION DATA
            // ==========================================

            setPagination(

                result.pagination || {

                    currentPage: page,

                    totalPages: 1,

                    totalProjects:
                        result.data?.length || 0,

                    limit: 6,

                    hasNextPage: false,

                    hasPreviousPage:
                        page > 1,

                }

            );


            // ==========================================
            // SAVE CURRENT PAGE
            // ==========================================

            setCurrentPage(

                result.pagination?.currentPage ||
                page

            );


        } catch (error) {

            console.error(

                "Fetch projects error:",

                error

            );


            setProjectsError(

                error.message ||
                "Unable to load projects."

            );

        } finally {

            setProjectsLoading(false);

        }

    };


    // ==================================================
    // LOAD PROJECTS WHEN PAGE OPENS
    // ==================================================

    useEffect(() => {

        fetchProjects(1);

    }, []);


    // ==================================================
    // HANDLE TEXT INPUTS
    // ==================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => ({

            ...previous,

            [name]: value,

        }));


        if (formError) {

            setFormError("");

        }

    };


    // ==================================================
    // HANDLE HERO IMAGE
    // ==================================================

    const handleHeroImage = (event) => {

        const file =
            event.target.files[0];


        setHeroImage(
            file || null
        );


        if (file) {

            setHeroPreview(

                URL.createObjectURL(file)

            );

        }

    };


    // ==================================================
    // HANDLE BEFORE IMAGES
    // ==================================================

    const handleBeforeImages = (event) => {

        const files =
            Array.from(
                event.target.files
            ).slice(0, 4);


        setBeforeImages(files);


        setBeforePreviews(

            files.map((file) => ({

                file,

                url:
                    URL.createObjectURL(file),

            }))

        );

    };


    // ==================================================
    // HANDLE AFTER IMAGES
    // ==================================================

    const handleAfterImages = (event) => {

        const files =
            Array.from(
                event.target.files
            ).slice(0, 4);


        setAfterImages(files);


        setAfterPreviews(

            files.map((file) => ({

                file,

                url:
                    URL.createObjectURL(file),

            }))

        );

    };


    // ==================================================
    // REMOVE HERO IMAGE
    // ==================================================

    const removeHeroImage = () => {

        setHeroImage(null);

        setHeroPreview("");

    };


    // ==================================================
    // REMOVE BEFORE IMAGE
    // ==================================================

    const removeBeforeImage = (index) => {

        setBeforeImages((previous) =>

            previous.filter(

                (_, imageIndex) =>
                    imageIndex !== index

            )

        );


        setBeforePreviews((previous) =>

            previous.filter(

                (_, imageIndex) =>
                    imageIndex !== index

            )

        );

    };


    // ==================================================
    // REMOVE AFTER IMAGE
    // ==================================================

    const removeAfterImage = (index) => {

        setAfterImages((previous) =>

            previous.filter(

                (_, imageIndex) =>
                    imageIndex !== index

            )

        );


        setAfterPreviews((previous) =>

            previous.filter(

                (_, imageIndex) =>
                    imageIndex !== index

            )

        );

    };


    // ==================================================
    // RESET FORM
    // ==================================================

    const resetForm = () => {

        setFormData(emptyForm);

        setHeroImage(null);

        setBeforeImages([]);

        setAfterImages([]);

        setHeroPreview("");

        setBeforePreviews([]);

        setAfterPreviews([]);

        setEditingProject(null);

        setFormError("");

    };


    // ==================================================
    // START EDITING PROJECT
    // ==================================================

    const handleEdit = (project) => {

        setEditingProject(project);


        // ==============================================
        // LOAD PROJECT DATA INTO FORM
        // ==============================================

        setFormData({

            title:
                project.title || "",

            slug:
                project.slug || "",

            category:
                project.category || "",

            service:
                project.service || "",

            client:
                project.client || "",

            location:
                project.location || "",

            industry:
                project.industry || "",

            surfaceArea:
                project.surfaceArea || "",

            completionTime:
                project.completionTime || "",

            system:
                project.system || "",

            status:
                project.status || "Pending",

            projectValue:
                project.projectValue ?? 0,

            shortDescription:
                project.shortDescription || "",

            overview:
                project.overview || "",

            challenge:
                project.challenge || "",

            solution:
                project.solution || "",

        });


        // ==============================================
        // LOAD EXISTING HERO IMAGE
        // ==============================================

        if (project.heroImage) {

            setHeroPreview(

                getImageUrl(
                    project.heroImage
                )

            );

        } else if (project.image) {

            setHeroPreview(

                getImageUrl(
                    project.image
                )

            );

        } else {

            setHeroPreview("");

        }


        // ==============================================
        // LOAD EXISTING BEFORE IMAGES
        // ==============================================

        setBeforePreviews(

            Array.isArray(project.beforeImages)

                ? project.beforeImages.map(
                    (image) => ({

                        file: null,

                        url:
                            getImageUrl(image),

                    })
                )

                : []

        );


        // ==============================================
        // LOAD EXISTING AFTER IMAGES
        // ==============================================

        setAfterPreviews(

            Array.isArray(project.afterImages)

                ? project.afterImages.map(
                    (image) => ({

                        file: null,

                        url:
                            getImageUrl(image),

                    })
                )

                : []

        );


        setHeroImage(null);

        setBeforeImages([]);

        setAfterImages([]);

        setMessage("");

        setFormError("");


        // ==============================================
        // MOVE TO FORM
        // ==============================================

        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    };


    // ==================================================
    // CREATE / UPDATE PROJECT
    // ==================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        setFormLoading(true);

        setMessage("");

        setFormError("");


        try {

            // ==========================================
            // CREATE MULTIPART FORM DATA
            // ==========================================

            const data =
                new FormData();


            // ==========================================
            // ADD TEXT FIELDS
            // ==========================================

            Object.entries(formData).forEach(

                ([key, value]) => {

                    data.append(

                        key,

                        value

                    );

                }

            );


            // ==========================================
            // ADD HERO IMAGE
            // ==========================================

            if (heroImage) {

                data.append(

                    "heroImage",

                    heroImage

                );

            }


            // ==========================================
            // ADD BEFORE IMAGES
            // ==========================================

            beforeImages.forEach((file) => {

                data.append(

                    "beforeImages",

                    file

                );

            });


            // ==========================================
            // ADD AFTER IMAGES
            // ==========================================

            afterImages.forEach((file) => {

                data.append(

                    "afterImages",

                    file

                );

            });


            // ==========================================
            // DETERMINE CREATE / UPDATE
            // ==========================================

            const isEditing =
                Boolean(editingProject);


            const url =

                isEditing

                    ? `${API_URL}/${editingProject._id}`

                    : API_URL;


            const method =

                isEditing

                    ? "PUT"

                    : "POST";


            // ==========================================
            // SEND REQUEST
            // ==========================================

            const response =
                await fetch(

                    url,

                    {

                        method,

                        body: data,

                    }

                );


            const result =
                await response.json();


            // ==========================================
            // HANDLE API ERROR
            // ==========================================

            if (!response.ok) {

                throw new Error(

                    result.message ||

                    (
                        isEditing

                            ? "Unable to update project."

                            : "Unable to create project."
                    )

                );

            }


            // ==========================================
            // SUCCESS MESSAGE
            // ==========================================

            setMessage(

                isEditing

                    ? "Project updated successfully."

                    : "Project created successfully."

            );


            // ==========================================
            // RESET FORM
            // ==========================================

            resetForm();


            // ==========================================
            // REFRESH PROJECTS
            //
            // New projects appear on page 1.
            //
            // Edited projects remain on current page.
            // ==========================================

            await fetchProjects(

                isEditing

                    ? currentPage

                    : 1

            );


        } catch (error) {

            console.error(

                "Project submission error:",

                error

            );


            setFormError(

                error.message ||
                "Something went wrong."

            );

        } finally {

            setFormLoading(false);

        }

    };


    // ==================================================
    // DELETE PROJECT
    // ==================================================

    const handleDelete = async (project) => {


        // ==============================================
        // CONFIRMATION
        // ==============================================

        const confirmed =
            window.confirm(

                `Are you sure you want to delete "${project.title}"? This action cannot be undone.`

            );


        if (!confirmed) {

            return;

        }


        setDeleteLoading(

            project._id

        );

        setProjectsError("");

        setMessage("");


        try {

            const response =
                await fetch(

                    `${API_URL}/${project._id}`,

                    {

                        method: "DELETE",

                    }

                );


            const result =
                await response.json();


            // ==========================================
            // HANDLE API ERROR
            // ==========================================

            if (!response.ok) {

                throw new Error(

                    result.message ||
                    "Unable to delete project."

                );

            }


            // ==========================================
            // SUCCESS MESSAGE
            // ==========================================

            setMessage(

                "Project deleted successfully."

            );


            // ==========================================
            // DETERMINE WHETHER CURRENT PAGE WILL STILL
            // CONTAIN PROJECTS AFTER DELETION.
            //
            // If this was the final project on the page,
            // move to the previous page.
            // ==========================================

            const remainingProjects =
                projects.length - 1;


            if (

                remainingProjects === 0 &&

                currentPage > 1

            ) {

                await fetchProjects(

                    currentPage - 1

                );

            } else {

                await fetchProjects(

                    currentPage

                );

            }


            // ==========================================
            // EXIT EDIT MODE IF NECESSARY
            // ==========================================

            if (

                editingProject?._id ===
                project._id

            ) {

                resetForm();

            }


        } catch (error) {

            console.error(

                "Delete project error:",

                error

            );


            setProjectsError(

                error.message ||
                "Unable to delete project."

            );

        } finally {

            setDeleteLoading(null);

        }

    };


    // ==================================================
    // HANDLE PAGINATION
    // ==================================================

    const handlePageChange = (page) => {

        if (page < 1) {

            return;

        }


        if (
            page >
            pagination.totalPages
        ) {

            return;

        }


        if (
            page === currentPage
        ) {

            return;

        }


        fetchProjects(page);


        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    };


    // ==================================================
    // PAGE
    // ==================================================

    return (

        <div className="dashboard-projects-page">


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="dashboard-projects-header">

                <div>

                    <h1>

                        {editingProject

                            ? "Edit Project"

                            : "Add Project"

                        }

                    </h1>


                    <p>

                        {editingProject

                            ? "Update project information, status and value."

                            : "Add a completed Concrete Finisher project."

                        }

                    </p>

                </div>


                {/* ======================================
                    CANCEL EDIT
                ====================================== */}

                {editingProject && (

                    <button

                        type="button"

                        onClick={resetForm}

                        className="cancel-edit-btn"

                    >

                        Cancel Edit

                    </button>

                )}

            </div>


            {/* ==========================================
                SUCCESS MESSAGE
            ========================================== */}

            {message && (

                <p className="project-success-message">

                    {message}

                </p>

            )}


            {/* ==========================================
                FORM ERROR
            ========================================== */}

            {formError && (

                <p className="project-error-message">

                    {formError}

                </p>

            )}


            {/* ==========================================
                PROJECT FORM
            ========================================== */}

            <form

                onSubmit={handleSubmit}

                encType="multipart/form-data"

            >


                {/* ====================================
                    BASIC INFORMATION
                ==================================== */}

                <h2>

                    Project Information

                </h2>


                <input

                    type="text"

                    name="title"

                    placeholder="Project Title"

                    value={formData.title}

                    onChange={handleChange}

                    required

                />


                <input

                    type="text"

                    name="slug"

                    placeholder="Project Slug"

                    value={formData.slug}

                    onChange={handleChange}

                    required

                />


                <input

                    type="text"

                    name="category"

                    placeholder="Category"

                    value={formData.category}

                    onChange={handleChange}

                    required

                />


                <input

                    type="text"

                    name="service"

                    placeholder="Service"

                    value={formData.service}

                    onChange={handleChange}

                    required

                />


                <input

                    type="text"

                    name="client"

                    placeholder="Client"

                    value={formData.client}

                    onChange={handleChange}

                    required

                />


                <input

                    type="text"

                    name="location"

                    placeholder="Location"

                    value={formData.location}

                    onChange={handleChange}

                    required

                />


                <input

                    type="text"

                    name="industry"

                    placeholder="Industry"

                    value={formData.industry}

                    onChange={handleChange}

                    required

                />


                <input

                    type="text"

                    name="surfaceArea"

                    placeholder="Surface Area"

                    value={formData.surfaceArea}

                    onChange={handleChange}

                />


                <input

                    type="text"

                    name="completionTime"

                    placeholder="Completion Time"

                    value={formData.completionTime}

                    onChange={handleChange}

                />


                <input

                    type="text"

                    name="system"

                    placeholder="Flooring / Finishing System"

                    value={formData.system}

                    onChange={handleChange}

                />


                {/* ====================================
                    PROJECT STATUS + VALUE
                ==================================== */}

                <div className="project-financial-section">


                    <h2>

                        Project Management

                    </h2>


                    <div className="project-management-grid">


                        {/* ==============================
                            PROJECT STATUS
                        ============================== */}

                        <div className="project-field">


                            <label htmlFor="status">

                                Project Status

                            </label>


                            <select

                                id="status"

                                name="status"

                                value={formData.status}

                                onChange={handleChange}

                                required

                            >

                                <option value="Pending">

                                    Pending

                                </option>


                                <option value="Active">

                                    Active

                                </option>


                                <option value="Completed">

                                    Completed

                                </option>

                            </select>


                            <span className="field-help">

                                Pending = approved or paused.
                                Active = currently being worked on.
                                Completed = fully finished.

                            </span>


                        </div>


                        {/* ==============================
                            PROJECT VALUE
                        ============================== */}

                        <div className="project-field">


                            <label htmlFor="projectValue">

                                Project Value

                            </label>


                            <div className="currency-input">


                                <span>

                                    UGX

                                </span>


                                <input

                                    id="projectValue"

                                    type="number"

                                    name="projectValue"

                                    placeholder="0"

                                    min="0"

                                    step="1000"

                                    value={formData.projectValue}

                                    onChange={handleChange}

                                    required

                                />


                            </div>


                            <span className="field-help">

                                Enter the agreed project price.

                            </span>


                        </div>


                    </div>


                </div>


                {/* ====================================
                    DESCRIPTIONS
                ==================================== */}

                <h2>

                    Project Description

                </h2>


                <textarea

                    name="shortDescription"

                    placeholder="Short Description"

                    value={formData.shortDescription}

                    onChange={handleChange}

                />


                <textarea

                    name="overview"

                    placeholder="Project Overview"

                    value={formData.overview}

                    onChange={handleChange}

                />


                <textarea

                    name="challenge"

                    placeholder="Project Challenge"

                    value={formData.challenge}

                    onChange={handleChange}

                />


                <textarea

                    name="solution"

                    placeholder="Project Solution"

                    value={formData.solution}

                    onChange={handleChange}

                />


                {/* ====================================
                    HERO IMAGE
                ==================================== */}

                <div className="project-image-section">


                    <h2>

                        Hero Image

                    </h2>


                    <label className="image-upload-box">


                        <input

                            type="file"

                            accept="image/jpeg,image/jpg,image/png,image/webp"

                            onChange={handleHeroImage}

                        />


                        <span className="upload-title">

                            {heroImage

                                ? "Change hero image"

                                : editingProject &&
                                  heroPreview

                                    ? "Choose new hero image"

                                    : "Choose hero image"

                            }

                        </span>


                        <span className="upload-subtitle">

                            JPG, PNG or WEBP

                        </span>


                    </label>


                    {heroPreview && (

                        <div className="hero-image-preview">


                            <img

                                src={heroPreview}

                                alt="Hero preview"

                            />


                            <div className="image-preview-info">


                                <span>

                                    {heroImage?.name ||

                                        (

                                            editingProject

                                                ? "Current hero image"

                                                : ""

                                        )

                                    }

                                </span>


                                {heroImage && (

                                    <button

                                        type="button"

                                        onClick={removeHeroImage}

                                        className="remove-image-btn"

                                    >

                                        Remove

                                    </button>

                                )}


                            </div>


                        </div>

                    )}


                </div>


                {/* ====================================
                    BEFORE IMAGES
                ==================================== */}

                <div className="project-image-section">


                    <h2>

                        Before Images

                    </h2>


                    <label className="image-upload-box">


                        <input

                            type="file"

                            accept="image/jpeg,image/jpg,image/png,image/webp"

                            multiple

                            onChange={handleBeforeImages}

                        />


                        <span className="upload-title">

                            Choose before images

                        </span>


                        <span className="upload-subtitle">

                            Select up to 4 new images

                        </span>


                    </label>


                    {beforePreviews.length > 0 && (

                        <div className="image-preview-grid">


                            {beforePreviews.map(

                                (image, index) => (

                                    <div

                                        className="image-preview-card"

                                        key={`${image.url}-${index}`}

                                    >


                                        <img

                                            src={image.url}

                                            alt={`Before ${index + 1}`}

                                        />


                                        <div className="image-preview-footer">


                                            <span>

                                                {image.file

                                                    ? image.file.name

                                                    : "Existing image"

                                                }

                                            </span>


                                            {image.file && (

                                                <button

                                                    type="button"

                                                    onClick={() =>
                                                        removeBeforeImage(index)
                                                    }

                                                    className="remove-image-btn"

                                                >

                                                    Remove

                                                </button>

                                            )}


                                        </div>


                                    </div>

                                )

                            )}


                        </div>

                    )}


                </div>


                {/* ====================================
                    AFTER IMAGES
                ==================================== */}

                <div className="project-image-section">


                    <h2>

                        After Images

                    </h2>


                    <label className="image-upload-box">


                        <input

                            type="file"

                            accept="image/jpeg,image/jpg,image/png,image/webp"

                            multiple

                            onChange={handleAfterImages}

                        />


                        <span className="upload-title">

                            Choose after images

                        </span>


                        <span className="upload-subtitle">

                            Select up to 4 new images

                        </span>


                    </label>


                    {afterPreviews.length > 0 && (

                        <div className="image-preview-grid">


                            {afterPreviews.map(

                                (image, index) => (

                                    <div

                                        className="image-preview-card"

                                        key={`${image.url}-${index}`}

                                    >


                                        <img

                                            src={image.url}

                                            alt={`After ${index + 1}`}

                                        />


                                        <div className="image-preview-footer">


                                            <span>

                                                {image.file

                                                    ? image.file.name

                                                    : "Existing image"

                                                }

                                            </span>


                                            {image.file && (

                                                <button

                                                    type="button"

                                                    onClick={() =>
                                                        removeAfterImage(index)
                                                    }

                                                    className="remove-image-btn"

                                                >

                                                    Remove

                                                </button>

                                            )}


                                        </div>


                                    </div>

                                )

                            )}


                        </div>

                    )}


                </div>


                {/* ====================================
                    SUBMIT
                ==================================== */}

                <button

                    type="submit"

                    disabled={formLoading}

                >

                    {formLoading

                        ? (

                            editingProject

                                ? "Updating Project..."

                                : "Creating Project..."

                        )

                        : (

                            editingProject

                                ? "Update Project"

                                : "Create Project"

                        )

                    }

                </button>


            </form>


            {/* ==================================================
                PROJECT LIST
            ================================================== */}

            <section className="existing-projects-section">


                <div className="existing-projects-header">

                    <div>

                        <h2>

                            Existing Projects

                        </h2>


                        <p>

                            Manage projects already stored in the system.

                        </p>

                    </div>

                </div>


                {/* ==============================================
                    PROJECT LIST LOADING
                ============================================== */}

                {projectsLoading && (

                    <div className="projects-loading-state">

                        <p>

                            Loading projects...

                        </p>

                    </div>

                )}


                {/* ==============================================
                    PROJECT LIST ERROR
                ============================================== */}

                {!projectsLoading &&
                    projectsError && (

                        <div className="projects-error-state">

                            <p>

                                {projectsError}

                            </p>


                            <button

                                type="button"

                                onClick={() =>
                                    fetchProjects(currentPage)
                                }

                            >

                                Try Again

                            </button>

                        </div>

                    )
                }


                {/* ==============================================
                    EMPTY PROJECT LIST
                ============================================== */}

                {!projectsLoading &&
                    !projectsError &&
                    projects.length === 0 && (

                        <div className="projects-empty-state">

                            <p>

                                No projects have been added yet.

                            </p>

                        </div>

                    )
                }


                {/* ==============================================
                    PROJECT CARDS
                ============================================== */}

                {!projectsLoading &&
                    !projectsError &&
                    projects.length > 0 && (

                        <div className="dashboard-project-list">


                            {projects.map((project) => (

                                <article

                                    className="dashboard-project-card"

                                    key={project._id}

                                >


                                    {/* ==========================
                                        PROJECT IMAGE
                                    ========================== */}

                                    <div className="dashboard-project-card-image">


                                        {(project.heroImage ||
                                            project.image) ? (

                                            <img

                                                src={getImageUrl(

                                                    project.heroImage ||
                                                    project.image

                                                )}

                                                alt={project.title}

                                            />

                                        ) : (

                                            <div className="project-no-image">

                                                No Image

                                            </div>

                                        )}


                                    </div>


                                    {/* ==========================
                                        PROJECT CONTENT
                                    ========================== */}

                                    <div className="dashboard-project-card-content">


                                        <div className="dashboard-project-card-header">


                                            <div>

                                                <h3>

                                                    {project.title}

                                                </h3>


                                                <p>

                                                    {project.client}

                                                </p>

                                            </div>


                                            <span

                                                className={`project-status-badge status-${(

                                                    project.status ||
                                                    "Pending"

                                                ).toLowerCase()}`}

                                            >

                                                {project.status ||
                                                    "Pending"
                                                }

                                            </span>


                                        </div>


                                        <div className="dashboard-project-card-details">


                                            <div>

                                                <span>

                                                    Service

                                                </span>


                                                <strong>

                                                    {project.service}

                                                </strong>

                                            </div>


                                            <div>

                                                <span>

                                                    Location

                                                </span>


                                                <strong>

                                                    {project.location}

                                                </strong>

                                            </div>


                                            <div>

                                                <span>

                                                    Value

                                                </span>


                                                <strong>

                                                    UGX{" "}

                                                    {Number(

                                                        project.projectValue || 0

                                                    ).toLocaleString()}

                                                </strong>

                                            </div>


                                        </div>


                                        {/* ==========================
                                            ACTIONS
                                        ========================== */}

                                        <div className="dashboard-project-actions">


                                            <button

                                                type="button"

                                                onClick={() =>
                                                    handleEdit(project)
                                                }

                                                disabled={

                                                    deleteLoading ===
                                                    project._id

                                                }

                                                className="edit-project-btn"

                                            >

                                                Edit

                                            </button>


                                            <button

                                                type="button"

                                                onClick={() =>
                                                    handleDelete(project)
                                                }

                                                disabled={

                                                    deleteLoading ===
                                                    project._id

                                                }

                                                className="delete-project-btn"

                                            >

                                                {deleteLoading ===
                                                project._id

                                                    ? "Deleting..."

                                                    : "Delete"

                                                }

                                            </button>


                                        </div>


                                    </div>


                                </article>

                            ))}


                        </div>

                    )
                }


                {/* ==================================================
                    PAGINATION
                ================================================== */}

                {!projectsLoading &&
                    !projectsError &&
                    projects.length > 0 &&
                    pagination.totalPages > 1 && (

                        <div className="projects-pagination">


                            {/* ======================================
                                PREVIOUS BUTTON
                            ====================================== */}

                            <button

                                type="button"

                                className="pagination-btn"

                                disabled={
                                    !pagination.hasPreviousPage ||
                                    projectsLoading
                                }

                                onClick={() =>
                                    handlePageChange(
                                        currentPage - 1
                                    )
                                }

                            >

                                ← Previous

                            </button>


                            {/* ======================================
                                PAGE NUMBERS
                            ====================================== */}

                            <div className="pagination-pages">


                                {Array.from(

                                    {
                                        length:
                                            pagination.totalPages
                                    },

                                    (_, index) => {

                                        const pageNumber =
                                            index + 1;


                                        return (

                                            <button

                                                type="button"

                                                key={pageNumber}

                                                className={

                                                    `pagination-number ${
                                                        currentPage ===
                                                        pageNumber
                                                            ? "active"
                                                            : ""
                                                    }`

                                                }

                                                disabled={
                                                    projectsLoading
                                                }

                                                onClick={() =>
                                                    handlePageChange(
                                                        pageNumber
                                                    )
                                                }

                                            >

                                                {pageNumber}

                                            </button>

                                        );

                                    }

                                )}


                            </div>


                            {/* ======================================
                                NEXT BUTTON
                            ====================================== */}

                            <button

                                type="button"

                                className="pagination-btn"

                                disabled={
                                    !pagination.hasNextPage ||
                                    projectsLoading
                                }

                                onClick={() =>
                                    handlePageChange(
                                        currentPage + 1
                                    )
                                }

                            >

                                Next →

                            </button>


                        </div>

                    )
                }


            </section>


        </div>

    );

}


export default DashboardProjects;