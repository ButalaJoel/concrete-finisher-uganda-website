// ======================================================
// FILE: DashboardCreateQuotation.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Allows administrators to create, edit, delete and
// manage official customer quotations.
//
// FEATURES:
// • Automatic quotation number generation
// • Automatic quotation date
// • Automatic validity date
// • Customer details
// • Project details
// • Dynamic quotation items
// • Automatic item totals
// • MongoDB API integration
// • System preference integration
// • Backend company/settings snapshot integration
// • Official quotation CRUD
// • Frontend pagination
//
// IMPORTANT:
// These official quotations are completely separate from
// the public/customer quotation request system.
//
// AUTHOR:
// Joel Butala
// ======================================================

import { useEffect, useState } from "react";

import {
    FileText,
    User,
    Building2,
    Plus,
    Trash2,
    ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../styles/dashboard/DashboardCreateQuotation.css";


// ======================================================
// CREATE QUOTATION
// ======================================================

function DashboardCreateQuotation() {

    const navigate = useNavigate();


    // ==================================================
    // API URL
    // ==================================================

    const API_URL =
        import.meta.env.VITE_API_URL;


    // ==================================================
    // LOADING / ERROR / SUCCESS
    // ==================================================

    const [loadingPreferences, setLoadingPreferences] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==================================================
    // SYSTEM PREFERENCES
    // ==================================================

    const [preferences, setPreferences] =
        useState(null);


    // ==================================================
    // OFFICIAL QUOTATIONS
    //
    // These are administrator-created quotation records
    // stored in MongoDB through:
    //
    // /api/official-quotations
    //
    // They are NOT public quotation requests.
    // ==================================================

    const [officialQuotations, setOfficialQuotations] =
        useState([]);

    const [quotationsLoading, setQuotationsLoading] =
        useState(true);

    const [quotationsError, setQuotationsError] =
        useState("");

    const [quotationPage, setQuotationPage] =
        useState(1);

    const [editingQuotation, setEditingQuotation] =
        useState(null);

    const [deleteQuotationLoading, setDeleteQuotationLoading] =
        useState(null);
// ==================================================
// PDF GENERATION
// ==================================================

const [generatingPdfQuotation, setGeneratingPdfQuotation] =
    useState(null);

    // ==================================================
    // PAGINATION SETTINGS
    //
    // Three quotation cards are displayed per page.
    // ==================================================

    const quotationsPerPage = 3;


    // ==================================================
    // QUOTATION DETAILS
    //
    // quotationNumber is intentionally NOT stored here.
    //
    // The backend generates the quotation number.
    // This keeps the quotation number immutable.
    // ==================================================

    const [quotationDetails, setQuotationDetails] =
        useState({

            quotationDate: "",

            validUntil: "",

        });


    // ==================================================
    // CUSTOMER DETAILS
    // ==================================================

    const [customerDetails, setCustomerDetails] =
        useState({

            fullName: "",

            company: "",

            phoneNumber: "",

            email: "",

            address: "",

        });


    // ==================================================
    // PROJECT DETAILS
    // ==================================================

    const [projectDetails, setProjectDetails] =
        useState({

            projectName: "",

            projectLocation: "",

            projectDescription: "",

        });


    // ==================================================
    // QUOTATION ITEMS
    // ==================================================

    const [items, setItems] =
        useState([

            {

                id: Date.now(),

                description: "",

                quantity: 1,

                unit: "",

                unitPrice: 0,

            },

        ]);


    // ==================================================
    // GET AUTH TOKEN
    // ==================================================

    const getAuthToken = () => {

        return (

            localStorage.getItem(
                "cf_auth_token"
            ) ||

            sessionStorage.getItem(
                "cf_auth_token"
            )

        );

    };


    // ==================================================
    // FORMAT DATE FOR INPUT
    //
    // Returns:
    //
    // YYYY-MM-DD
    // ==================================================

    const formatDateForInput = (date) => {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    };


    // ==================================================
    // FETCH OFFICIAL QUOTATIONS
    //
    // GET:
    //
    // /api/official-quotations
    //
    // These records come from MongoDB.
    // ==================================================

    const fetchOfficialQuotations = async () => {

        setQuotationsLoading(true);

        setQuotationsError("");


        try {

            const token =
                getAuthToken();


            if (!token) {

                throw new Error(
                    "Your session has expired. Please log in again."
                );

            }


            const response =
                await fetch(
                    `${API_URL}/api/official-quotations`,
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

                throw new Error(

                    data.message ||
                    "Unable to load official quotations."

                );

            }


            const quotations =
                data.data || [];


            setOfficialQuotations(
                quotations
            );


            // ==========================================
            // KEEP CURRENT PAGE VALID
            // ==========================================

            const totalPages =
                Math.max(

                    1,

                    Math.ceil(
                        quotations.length /
                        quotationsPerPage
                    )

                );


            setQuotationPage(
                (currentPage) =>
                    Math.min(
                        currentPage,
                        totalPages
                    )
            );

        } catch (error) {

            console.error(
                "Fetch official quotations error:",
                error
            );


            setQuotationsError(

                error.message ||
                "Unable to load official quotations."

            );

        } finally {

            setQuotationsLoading(false);

        }

    };


    // ==================================================
    // LOAD SYSTEM PREFERENCES
    // ==================================================

    useEffect(() => {

        const loadPreferences = async () => {

            try {

                setLoadingPreferences(true);

                setError("");


                const token =
                    getAuthToken();


                if (!token) {

                    throw new Error(
                        "Your session has expired. Please log in again."
                    );

                }


                const response =
                    await fetch(
                        `${API_URL}/api/preferences`,
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

                    throw new Error(

                        data.message ||

                        "Unable to load quotation preferences."

                    );

                }


                setPreferences(data);


                // ==========================================
                // AUTOMATIC QUOTATION DATE
                // ==========================================

                const today =
                    new Date();


                // ==========================================
                // AUTOMATIC VALID UNTIL
                // ==========================================

                const validUntil =
                    new Date(today);


                validUntil.setDate(

                    validUntil.getDate() +

                    Number(
                        data.defaultValidity || 30
                    )

                );


                setQuotationDetails({

                    quotationDate:
                        formatDateForInput(
                            today
                        ),

                    validUntil:
                        formatDateForInput(
                            validUntil
                        ),

                });

            } catch (error) {

                console.error(
                    "Load quotation preferences error:",
                    error
                );


                setError(
                    error.message ||
                    "Unable to load quotation preferences."
                );

            } finally {

                setLoadingPreferences(false);

            }

        };


        loadPreferences();

    }, [API_URL]);


    // ==================================================
    // LOAD OFFICIAL QUOTATIONS
    // ==================================================

    useEffect(() => {

        fetchOfficialQuotations();

    }, [API_URL]);


    // ==================================================
    // HANDLE CUSTOMER DETAILS
    // ==================================================

    const handleCustomerDetailsChange =
        (event) => {

            const {
                name,
                value,
            } = event.target;


            setCustomerDetails(
                (previous) => ({

                    ...previous,

                    [name]: value,

                })
            );

        };


    // ==================================================
    // HANDLE PROJECT DETAILS
    // ==================================================

    const handleProjectDetailsChange =
        (event) => {

            const {
                name,
                value,
            } = event.target;


            setProjectDetails(
                (previous) => ({

                    ...previous,

                    [name]: value,

                })
            );

        };


    // ==================================================
    // HANDLE ITEM CHANGE
    // ==================================================

    const handleItemChange = (
        id,
        field,
        value
    ) => {

        setItems(
            (previousItems) =>

                previousItems.map(
                    (item) =>

                        item.id === id

                            ? {

                                ...item,

                                [field]:

                                    field === "quantity" ||
                                    field === "unitPrice"

                                        ? Number(value)

                                        : value,

                            }

                            : item

                )

        );

    };


    // ==================================================
    // ADD QUOTATION ITEM
    // ==================================================

    const addItem = () => {

        setItems(
            (previousItems) => [

                ...previousItems,

                {

                    id:
                        Date.now() +
                        Math.random(),

                    description: "",

                    quantity: 1,

                    unit: "",

                    unitPrice: 0,

                },

            ]
        );

    };


    // ==================================================
    // REMOVE QUOTATION ITEM
    // ==================================================

    const removeItem = (id) => {

        setItems(
            (previousItems) => {

                if (
                    previousItems.length === 1
                ) {

                    return previousItems;

                }


                return previousItems.filter(

                    (item) =>
                        item.id !== id

                );

            }
        );

    };


    // ==================================================
    // CALCULATE ITEM AMOUNT
    // ==================================================

    const calculateItemAmount =
        (item) => {

            return (

                Number(
                    item.quantity || 0
                ) *

                Number(
                    item.unitPrice || 0
                )

            );

        };


    // ==================================================
    // CALCULATE SUBTOTAL
    // ==================================================

    const subtotal =
        items.reduce(

            (total, item) =>

                total +

                calculateItemAmount(
                    item
                ),

            0

        );


    // ==================================================
    // FORMAT CURRENCY
    // ==================================================

    const formatCurrency =
        (amount) => {

            const currency =
                preferences?.currencyDisplay ||
                "UGX";


            if (currency === "UGX") {

                return new Intl.NumberFormat(
                    "en-UG",
                    {

                        style: "currency",

                        currency: "UGX",

                        maximumFractionDigits: 0,

                    }
                ).format(amount);

            }


            return new Intl.NumberFormat(
                "en-US",
                {

                    style: "currency",

                    currency:
                        currency === "USD"
                            ? "USD"
                            : "UGX",

                    maximumFractionDigits: 0,

                }
            ).format(amount);

        };


    // ==================================================
    // QUOTATION PAGINATION
    //
    // IMPORTANT:
    // quotationsPerPage is declared ONLY ONCE above.
    // ==================================================

    const totalQuotationPages =
        Math.ceil(

            officialQuotations.length /
            quotationsPerPage

        );


    const quotationStartIndex =
        (quotationPage - 1) *
        quotationsPerPage;


    const currentOfficialQuotations =
        officialQuotations.slice(

            quotationStartIndex,

            quotationStartIndex +
            quotationsPerPage

        );


    // ==================================================
    // RESET QUOTATION FORM
    //
    // Returns the form to create mode.
    // ==================================================

    const resetQuotationForm = () => {

        const today =
            new Date();


        const validUntil =
            new Date(today);


        validUntil.setDate(

            validUntil.getDate() +

            Number(
                preferences?.defaultValidity || 30
            )

        );


        setQuotationDetails({

            quotationDate:
                formatDateForInput(
                    today
                ),

            validUntil:
                formatDateForInput(
                    validUntil
                ),

        });


        setCustomerDetails({

            fullName: "",

            company: "",

            phoneNumber: "",

            email: "",

            address: "",

        });


        setProjectDetails({

            projectName: "",

            projectLocation: "",

            projectDescription: "",

        });


        setItems([

            {

                id:
                    Date.now() +
                    Math.random(),

                description: "",

                quantity: 1,

                unit: "",

                unitPrice: 0,

            },

        ]);


        setEditingQuotation(null);

    };


    // ==================================================
    // START EDITING OFFICIAL QUOTATION
    //
    // quotationNumber is NOT editable.
    // ==================================================

    const handleEditQuotation = (quotation) => {

        setEditingQuotation(
            quotation
        );


        setQuotationDetails({

            quotationDate:
                quotation.quotationDate

                    ? formatDateForInput(
                        new Date(
                            quotation.quotationDate
                        )
                    )

                    : "",

            validUntil:
                quotation.validUntil

                    ? formatDateForInput(
                        new Date(
                            quotation.validUntil
                        )
                    )

                    : "",

        });


        setCustomerDetails({

            fullName:
                quotation.customer?.fullName ||
                "",

            company:
                quotation.customer?.company ||
                "",

            phoneNumber:
                quotation.customer?.phoneNumber ||
                "",

            email:
                quotation.customer?.email ||
                "",

            address:
                quotation.customer?.address ||
                "",

        });


        setProjectDetails({

            projectName:
                quotation.project?.projectName ||
                "",

            projectLocation:
                quotation.project?.projectLocation ||
                "",

            projectDescription:
                quotation.project?.projectDescription ||
                "",

        });


        setItems(

            (quotation.items || []).map(
                (item) => ({

                    id:
                        Date.now() +
                        Math.random(),

                    description:
                        item.description ||
                        "",

                    quantity:
                        Number(
                            item.quantity || 0
                        ),

                    unit:
                        item.unit ||
                        "",

                    unitPrice:
                        Number(
                            item.unitPrice || 0
                        ),

                })
            )

        );


        setError("");

        setSuccess("");


        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    };


    // ==================================================
    // CANCEL EDIT
    // ==================================================

    const handleCancelEdit = () => {

        resetQuotationForm();

        setError("");

        setSuccess("");

    };


// ==================================================
// GENERATE OFFICIAL QUOTATION PDF
//
// The PDF is generated from the quotation saved
// in MongoDB through the backend.
//
// The frontend does NOT build the quotation.
// ==================================================

const handleGenerateQuotationPdf = async (
    quotation
) => {

    const token =
        getAuthToken();


    // ==============================================
    // AUTHENTICATION CHECK
    // ==============================================

    if (!token) {

        setQuotationsError(
            "Your session has expired. Please log in again."
        );

        return;

    }


    setGeneratingPdfQuotation(
        quotation._id
    );

    setQuotationsError("");


    try {

        // ==========================================
        // REQUEST PDF FROM BACKEND
        // ==========================================

        const response =
            await fetch(

                `${API_URL}/api/official-quotations/${quotation._id}/pdf`,

                {

                    method: "GET",

                    headers: {

                        Authorization:
                            `Bearer ${token}`,

                    },

                }

            );


        // ==========================================
        // HANDLE API ERROR
        // ==========================================

        if (!response.ok) {

            let message =
                "Unable to generate quotation PDF.";

            try {

                const data =
                    await response.json();

                message =
                    data.message ||
                    message;

            } catch {

                // ----------------------------------
                // Response was not JSON.
                // Keep the default message.
                // ----------------------------------

            }

            throw new Error(
                message
            );

        }


        // ==========================================
        // CONVERT RESPONSE TO FILE
        // ==========================================

        const blob =
            await response.blob();


        // ==========================================
        // CREATE TEMPORARY DOWNLOAD URL
        // ==========================================

        const downloadUrl =
            window.URL.createObjectURL(
                blob
            );


        // ==========================================
        // CREATE DOWNLOAD LINK
        // ==========================================

        const link =
            document.createElement(
                "a"
            );


        link.href =
            downloadUrl;


        link.download =
            `${quotation.quotationNumber}.pdf`;


        document.body.appendChild(
            link
        );


        link.click();


        // ==========================================
        // CLEAN UP
        // ==========================================

        link.remove();

        window.URL.revokeObjectURL(
            downloadUrl
        );


        setSuccess(

            `Quotation ${
                quotation.quotationNumber
            } PDF generated successfully.`

        );


    } catch (error) {

        console.error(
            "Generate quotation PDF error:",
            error
        );


        setQuotationsError(

            error.message ||
            "Unable to generate quotation PDF."

        );

    } finally {

        setGeneratingPdfQuotation(
            null
        );

    }

};


    // ==================================================
    // DELETE OFFICIAL QUOTATION
    // ==================================================

    const handleDeleteQuotation = async (
        quotation
    ) => {

        const confirmed =
            window.confirm(

                `Are you sure you want to delete quotation ${quotation.quotationNumber}? This action cannot be undone.`

            );


        if (!confirmed) {

            return;

        }


        const token =
            getAuthToken();


        if (!token) {

            setQuotationsError(
                "Your session has expired. Please log in again."
            );

            return;

        }


        setDeleteQuotationLoading(
            quotation._id
        );

        setQuotationsError("");


        try {

            const response =
                await fetch(

                    `${API_URL}/api/official-quotations/${quotation._id}`,

                    {

                        method: "DELETE",

                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                        },

                    }

                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(

                    data.message ||
                    "Unable to delete quotation."

                );

            }


            const remainingCount =
                officialQuotations.length - 1;


            const remainingPages =
                Math.max(

                    1,

                    Math.ceil(
                        remainingCount /
                        quotationsPerPage
                    )

                );


            setOfficialQuotations(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item._id !== quotation._id
                    )
            );


            setQuotationPage(
                (currentPage) =>
                    Math.min(
                        currentPage,
                        remainingPages
                    )
            );


            setSuccess(

                `Quotation ${quotation.quotationNumber} deleted successfully.`

            );


            if (
                editingQuotation?._id ===
                quotation._id
            ) {

                resetQuotationForm();

            }

        } catch (error) {

            console.error(
                "Delete official quotation error:",
                error
            );


            setQuotationsError(

                error.message ||
                "Unable to delete quotation."

            );

        } finally {

            setDeleteQuotationLoading(
                null
            );

        }

    };


    // ==================================================
    // HANDLE QUOTATION PAGINATION
    // ==================================================

    const handleQuotationPageChange = (
        page
    ) => {

        if (page < 1) {

            return;

        }


        if (
            page >
            totalQuotationPages
        ) {

            return;

        }


        if (
            page === quotationPage
        ) {

            return;

        }


        setQuotationPage(
            page
        );


        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    };


    // ==================================================
    // FORM SUBMIT
    //
    // POST = create
    // PUT  = update
    //
    // quotationNumber is NEVER sent.
    // ==================================================

    const handleSubmit =
        async (event) => {

            event.preventDefault();


            setError("");

            setSuccess("");


            // ==========================================
            // BASIC VALIDATION
            // ==========================================

            if (
                !customerDetails.fullName.trim()
            ) {

                setError(
                    "Customer name is required."
                );

                return;

            }


            if (
                !customerDetails.phoneNumber.trim()
            ) {

                setError(
                    "Customer phone number is required."
                );

                return;

            }


            if (
                items.length === 0
            ) {

                setError(
                    "Add at least one quotation item."
                );

                return;

            }


            const invalidItem =
                items.find(

                    (item) =>

                        !item.description.trim() ||

                        !item.unit.trim() ||

                        Number(item.quantity) <= 0 ||

                        Number(item.unitPrice) < 0

                );


            if (invalidItem) {

                setError(
                    "Please complete all quotation item fields correctly."
                );

                return;

            }


            const token =
                getAuthToken();


            if (!token) {

                setError(
                    "Your session has expired. Please log in again."
                );

                return;

            }


            // ==========================================
            // PREPARE API DATA
            //
            // quotationNumber is deliberately omitted.
            // ==========================================

            const quotationData = {

                quotationDate:
                    quotationDetails.quotationDate,

                validUntil:
                    quotationDetails.validUntil,

                customer:
                    customerDetails,

                project:
                    projectDetails,

                items:

                    items.map(
                        (item) => ({

                            description:
                                item.description,

                            quantity:
                                Number(
                                    item.quantity
                                ),

                            unit:
                                item.unit,

                            unitPrice:
                                Number(
                                    item.unitPrice
                                ),

                        })
                    ),

            };


            const isEditing =
                Boolean(
                    editingQuotation
                );


            const url =
                isEditing

                    ? `${API_URL}/api/official-quotations/${editingQuotation._id}`

                    : `${API_URL}/api/official-quotations`;


            const method =
                isEditing
                    ? "PUT"
                    : "POST";


            try {

                setSaving(true);


                const response =
                    await fetch(

                        url,

                        {

                            method,

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,

                            },

                            body:
                                JSON.stringify(
                                    quotationData
                                ),

                        }

                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(

                        data.message ||

                        (
                            isEditing

                                ? "Unable to update quotation."

                                : "Unable to save quotation."

                        )

                    );

                }


                const savedQuotation =
                    data.data;


                // ==========================================
                // UPDATE EXISTING QUOTATION
                // ==========================================

                if (isEditing) {

                    setOfficialQuotations(

                        (previous) =>

                            previous.map(
                                (quotation) =>

                                    quotation._id ===
                                    savedQuotation._id

                                        ? savedQuotation

                                        : quotation

                            )

                    );


                    setSuccess(

                        `Quotation ${savedQuotation.quotationNumber} updated successfully.`

                    );

                }


                // ==========================================
                // CREATE NEW QUOTATION
                // ==========================================

                else {

                    setOfficialQuotations(

                        (previous) => [

                            savedQuotation,

                            ...previous,

                        ]

                    );


                    setQuotationPage(1);


                    setSuccess(

                        `Quotation ${savedQuotation.quotationNumber} saved successfully.`

                    );

                }


                // ==========================================
                // RESET FORM
                // ==========================================

                resetQuotationForm();


            } catch (error) {

                console.error(

                    isEditing
                        ? "Update quotation error:"
                        : "Save quotation error:",

                    error

                );


                setError(

                    error.message ||

                    (
                        isEditing

                            ? "Unable to update quotation."

                            : "Unable to save quotation."

                    )

                );

            } finally {

                setSaving(false);

            }

        };


    // ==================================================
    // LOADING SCREEN
    // ==================================================

    if (loadingPreferences) {

        return (

            <div className="create-quotation-page">

                <div className="quotation-builder-card">

                    <p>
                        Loading quotation preferences...
                    </p>

                </div>

            </div>

        );

    }


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div className="create-quotation-page">


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="create-quotation-header">

                <button

                    type="button"

                    className="create-quotation-back-button"

                    onClick={() =>
                        navigate(
                            "/dashboard/quotations"
                        )
                    }

                >

                    <ArrowLeft size={18} />

                    Back to Quotations

                </button>


                <div className="create-quotation-title">

                    <div className="create-quotation-title-icon">

                        <FileText size={26} />

                    </div>


                    <div>

                        <h1>

                            {editingQuotation
                                ? "Edit Quotation"
                                : "Create Quotation"
                            }

                        </h1>


                        <p>

                            {editingQuotation

                                ? `Update official quotation ${editingQuotation.quotationNumber}.`

                                : "Create an official quotation for a customer."

                            }

                        </p>

                    </div>

                </div>

            </div>


            {/* ==========================================
                EDIT MODE NOTICE
            ========================================== */}

            {editingQuotation && (

                <div className="quotation-edit-mode-bar">

                    <div>

                        Editing quotation:

                        <strong>
                            {" "}
                            {editingQuotation.quotationNumber}
                        </strong>

                    </div>


                    <button

                        type="button"

                        onClick={handleCancelEdit}

                    >

                        Cancel Edit

                    </button>

                </div>

            )}


            {/* ==========================================
                ERROR MESSAGE
            ========================================== */}

            {error && (

                <div

                    className="quotation-form-message quotation-form-error"

                    role="alert"

                >

                    {error}

                </div>

            )}


            {/* ==========================================
                SUCCESS MESSAGE
            ========================================== */}

            {success && (

                <div

                    className="quotation-form-message quotation-form-success"

                    role="status"

                >

                    {success}

                </div>

            )}


            {/* ==========================================
                FORM
            ========================================== */}

            <form

                className="create-quotation-form"

                onSubmit={handleSubmit}

            >


                {/* ======================================
                    QUOTATION DETAILS
                ====================================== */}

                <section className="quotation-builder-card">

                    <div className="quotation-builder-card-header">

                        <div className="quotation-builder-card-icon">

                            <FileText size={22} />

                        </div>


                        <div>

                            <h2>
                                Quotation Details
                            </h2>

                            <p>
                                Quotation numbering and dates
                                are managed automatically.
                            </p>

                        </div>

                    </div>


                    <div className="quotation-builder-grid">


                        {/* QUOTATION NUMBER */}

                        <div className="quotation-builder-form-group">

                            <label>
                                Quotation Number
                            </label>


                            <div className="quotation-auto-generated">

                                {editingQuotation

                                    ? (

                                        <>

                                            <strong>
                                                {editingQuotation.quotationNumber}
                                            </strong>

                                            <span>
                                                Existing quotation number
                                            </span>

                                        </>

                                    )

                                    : (

                                        <>

                                            <strong>
                                                Automatically generated
                                            </strong>

                                            <span>
                                                Assigned when the quotation is saved
                                            </span>

                                        </>

                                    )

                                }

                            </div>

                        </div>


                        {/* QUOTATION DATE */}

                        <div className="quotation-builder-form-group">

                            <label htmlFor="quotationDate">

                                Quotation Date

                            </label>


                            <input

                                id="quotationDate"

                                type="date"

                                value={
                                    quotationDetails.quotationDate
                                }

                                readOnly

                            />

                        </div>


                        {/* VALID UNTIL */}

                        <div className="quotation-builder-form-group">

                            <label htmlFor="validUntil">

                                Valid Until

                            </label>


                            <input

                                id="validUntil"

                                type="date"

                                value={
                                    quotationDetails.validUntil
                                }

                                readOnly

                            />

                        </div>

                    </div>

                </section>


                {/* ======================================
                    CUSTOMER DETAILS
                ====================================== */}

                <section className="quotation-builder-card">

                    <div className="quotation-builder-card-header">

                        <div className="quotation-builder-card-icon">

                            <User size={22} />

                        </div>


                        <div>

                            <h2>
                                Customer Details
                            </h2>

                            <p>
                                Enter the customer receiving
                                this quotation.
                            </p>

                        </div>

                    </div>


                    <div className="quotation-builder-grid">


                        {/* CUSTOMER NAME */}

                        <div className="quotation-builder-form-group">

                            <label htmlFor="fullName">

                                Customer Name *

                            </label>


                            <input

                                id="fullName"

                                name="fullName"

                                type="text"

                                value={
                                    customerDetails.fullName
                                }

                                onChange={
                                    handleCustomerDetailsChange
                                }

                                placeholder="Enter customer name"

                                required

                            />

                        </div>


                        {/* COMPANY */}

                        <div className="quotation-builder-form-group">

                            <label htmlFor="company">

                                Company

                            </label>


                            <input

                                id="company"

                                name="company"

                                type="text"

                                value={
                                    customerDetails.company
                                }

                                onChange={
                                    handleCustomerDetailsChange
                                }

                                placeholder="Enter company name"

                            />

                        </div>


                        {/* PHONE */}

                        <div className="quotation-builder-form-group">

                            <label htmlFor="phoneNumber">

                                Phone Number *

                            </label>


                            <input

                                id="phoneNumber"

                                name="phoneNumber"

                                type="tel"

                                value={
                                    customerDetails.phoneNumber
                                }

                                onChange={
                                    handleCustomerDetailsChange
                                }

                                placeholder="+256 ..."

                                required

                            />

                        </div>


                        {/* EMAIL */}

                        <div className="quotation-builder-form-group">

                            <label htmlFor="email">

                                Email

                            </label>


                            <input

                                id="email"

                                name="email"

                                type="email"

                                value={
                                    customerDetails.email
                                }

                                onChange={
                                    handleCustomerDetailsChange
                                }

                                placeholder="customer@example.com"

                            />

                        </div>


                        {/* ADDRESS */}

                        <div className="quotation-builder-form-group quotation-builder-full-width">

                            <label htmlFor="address">

                                Customer Address

                            </label>


                            <input

                                id="address"

                                name="address"

                                type="text"

                                value={
                                    customerDetails.address
                                }

                                onChange={
                                    handleCustomerDetailsChange
                                }

                                placeholder="Enter customer address"

                            />

                        </div>

                    </div>

                </section>


                {/* ======================================
                    PROJECT DETAILS
                ====================================== */}

                <section className="quotation-builder-card">

                    <div className="quotation-builder-card-header">

                        <div className="quotation-builder-card-icon">

                            <Building2 size={22} />

                        </div>


                        <div>

                            <h2>
                                Project Details
                            </h2>

                            <p>
                                Provide information about
                                the customer's project.
                            </p>

                        </div>

                    </div>


                    <div className="quotation-builder-grid">


                        {/* PROJECT NAME */}

                        <div className="quotation-builder-form-group">

                            <label htmlFor="projectName">

                                Project Name

                            </label>


                            <input

                                id="projectName"

                                name="projectName"

                                type="text"

                                value={
                                    projectDetails.projectName
                                }

                                onChange={
                                    handleProjectDetailsChange
                                }

                                placeholder="e.g. Office Floor Renovation"

                            />

                        </div>


                        {/* PROJECT LOCATION */}

                        <div className="quotation-builder-form-group">

                            <label htmlFor="projectLocation">

                                Project Location

                            </label>


                            <input

                                id="projectLocation"

                                name="projectLocation"

                                type="text"

                                value={
                                    projectDetails.projectLocation
                                }

                                onChange={
                                    handleProjectDetailsChange
                                }

                                placeholder="e.g. Kampala, Uganda"

                            />

                        </div>


                        {/* PROJECT DESCRIPTION */}

                        <div className="quotation-builder-form-group quotation-builder-full-width">

                            <label htmlFor="projectDescription">

                                Project Description

                            </label>


                            <textarea

                                id="projectDescription"

                                name="projectDescription"

                                value={
                                    projectDetails.projectDescription
                                }

                                onChange={
                                    handleProjectDetailsChange
                                }

                                placeholder="Describe the work being quoted..."

                            />

                        </div>

                    </div>

                </section>


                {/* ======================================
                    QUOTATION ITEMS
                ====================================== */}

                <section className="quotation-builder-card">

                    <div className="quotation-builder-card-header quotation-items-header">

                        <div>

                            <h2>
                                Quotation Items
                            </h2>

                            <p>
                                Add the services, materials
                                or labour included in the quotation.
                            </p>

                        </div>


                        <button

                            type="button"

                            className="quotation-add-item-button"

                            onClick={addItem}

                        >

                            <Plus size={18} />

                            Add Item

                        </button>

                    </div>


                    <div className="quotation-items">

                        {items.map(
                            (item, index) => (

                                <div

                                    className="quotation-item"

                                    key={item.id}

                                >

                                    <div className="quotation-item-number">

                                        Item {index + 1}

                                    </div>


                                    <div className="quotation-builder-grid quotation-item-grid">


                                        {/* DESCRIPTION */}

                                        <div className="quotation-builder-form-group quotation-builder-full-width">

                                            <label>
                                                Description
                                            </label>


                                            <input

                                                type="text"

                                                value={
                                                    item.description
                                                }

                                                onChange={
                                                    (event) =>
                                                        handleItemChange(

                                                            item.id,

                                                            "description",

                                                            event.target.value

                                                        )
                                                }

                                                placeholder="e.g. Epoxy Flooring"

                                                required

                                            />

                                        </div>


                                        {/* QUANTITY */}

                                        <div className="quotation-builder-form-group">

                                            <label>
                                                Quantity
                                            </label>


                                            <input

                                                type="number"

                                                min="0.01"

                                                step="any"

                                                value={
                                                    item.quantity
                                                }

                                                onChange={
                                                    (event) =>
                                                        handleItemChange(

                                                            item.id,

                                                            "quantity",

                                                            event.target.value

                                                        )
                                                }

                                                required

                                            />

                                        </div>


                                        {/* UNIT */}

                                        <div className="quotation-builder-form-group">

                                            <label>
                                                Unit
                                            </label>


                                            <input

                                                type="text"

                                                value={
                                                    item.unit
                                                }

                                                onChange={
                                                    (event) =>
                                                        handleItemChange(

                                                            item.id,

                                                            "unit",

                                                            event.target.value

                                                        )
                                                }

                                                placeholder="m², litre, job..."

                                                required

                                            />

                                        </div>


                                        {/* UNIT PRICE */}

                                        <div className="quotation-builder-form-group">

                                            <label>
                                                Unit Price (UGX)
                                            </label>


                                            <input

                                                type="number"

                                                min="0"

                                                step="1"

                                                value={
                                                    item.unitPrice
                                                }

                                                onChange={
                                                    (event) =>
                                                        handleItemChange(

                                                            item.id,

                                                            "unitPrice",

                                                            event.target.value

                                                        )
                                                }

                                                required

                                            />

                                        </div>


                                        {/* AMOUNT */}

                                        <div className="quotation-builder-form-group">

                                            <label>
                                                Amount
                                            </label>


                                            <div className="quotation-item-amount">

                                                {formatCurrency(

                                                    calculateItemAmount(
                                                        item
                                                    )

                                                )}

                                            </div>

                                        </div>

                                    </div>


                                    {/* REMOVE ITEM */}

                                    {items.length > 1 && (

                                        <button

                                            type="button"

                                            className="quotation-remove-item-button"

                                            onClick={() =>
                                                removeItem(
                                                    item.id
                                                )
                                            }

                                        >

                                            <Trash2 size={16} />

                                            Remove Item

                                        </button>

                                    )}

                                </div>

                            )
                        )}

                    </div>


                    {/* TOTAL */}

                    <div className="quotation-total">

                        <span>
                            Subtotal
                        </span>


                        <strong>
                            {formatCurrency(
                                subtotal
                            )}
                        </strong>

                    </div>

                </section>


                {/* ======================================
    FORM ACTIONS
====================================== */}

<div className="create-quotation-actions">


    {/* ==================================
        CANCEL
    ================================== */}

    <button

        type="button"

        className="create-quotation-cancel-button"

        onClick={
            editingQuotation
                ? handleCancelEdit
                : () =>
                    navigate(
                        "/dashboard/quotations"
                    )
        }

    >

        Cancel

    </button>


    {/* ==================================
        GENERATE PDF
        Only available when editing an
        existing saved quotation.
    ================================== */}

    


    {/* ==================================
        SAVE / UPDATE
    ================================== */}

    <button

        type="submit"

        className="create-quotation-save-button"

        disabled={saving}

    >

        {

            saving

                ? (
                    editingQuotation
                        ? "Updating..."
                        : "Saving..."
                )

                : (
                    editingQuotation
                        ? "Update Quotation"
                        : "Save Quotation"
                )

        }

    </button>


</div>

            </form>


            {/* ==================================================
                EXISTING OFFICIAL QUOTATIONS
            ================================================== */}

            <section className="existing-quotations-section">


                <div className="existing-quotations-header">

                    <div>

                        <h2>
                            Existing Official Quotations
                        </h2>

                        <p>
                            Manage quotation records stored in the system.
                        </p>

                    </div>

                </div>


                {/* ==============================================
                    LOADING
                ============================================== */}

                {quotationsLoading && (

                    <div className="quotations-loading-state">

                        <p>
                            Loading official quotations...
                        </p>

                    </div>

                )}


                {/* ==============================================
                    ERROR
                ============================================== */}

                {!quotationsLoading &&
                    quotationsError && (

                        <div className="quotations-error-state">

                            <p>
                                {quotationsError}
                            </p>


                            <button

                                type="button"

                                onClick={
                                    fetchOfficialQuotations
                                }

                            >

                                Try Again

                            </button>

                        </div>

                    )
                }


                {/* ==============================================
                    EMPTY STATE
                ============================================== */}

                {!quotationsLoading &&
                    !quotationsError &&
                    officialQuotations.length === 0 && (

                        <div className="quotations-empty-state">

                            <p>
                                No official quotations have been created yet.
                            </p>

                        </div>

                    )
                }


                {/* ==============================================
                    OFFICIAL QUOTATION CARDS
                ============================================== */}

                {!quotationsLoading &&
                    !quotationsError &&
                    currentOfficialQuotations.length > 0 && (

                        <div className="official-quotation-list">

                            {currentOfficialQuotations.map(
                                (quotation) => (

                                    <article

                                        className="official-quotation-card"

                                        key={
                                            quotation._id
                                        }

                                    >

                                        <div className="official-quotation-card-content">


                                            {/* ==========================
                                                CARD HEADER
                                            ========================== */}

                                            <div className="official-quotation-card-header">

                                                <div>

                                                    <h3>
                                                        {
                                                            quotation.quotationNumber
                                                        }
                                                    </h3>


                                                    <p>

                                                        {
                                                            quotation.customer?.fullName ||
                                                            "No customer name"
                                                        }

                                                    </p>

                                                </div>


                                                <span

                                                    className={

                                                        `official-quotation-status-badge status-${(

                                                            quotation.status ||
                                                            "Draft"

                                                        ).toLowerCase()}`

                                                    }

                                                >

                                                    {
                                                        quotation.status ||
                                                        "Draft"
                                                    }

                                                </span>

                                            </div>


                                            {/* ==========================
                                                CARD DETAILS
                                            ========================== */}

                                            <div className="official-quotation-card-details">


                                                <div>

                                                    <span>
                                                        Company
                                                    </span>

                                                    <strong>
                                                        {
                                                            quotation.customer?.company ||
                                                            "—"
                                                        }
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Project
                                                    </span>

                                                    <strong>
                                                        {
                                                            quotation.project?.projectName ||
                                                            "—"
                                                        }
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Location
                                                    </span>

                                                    <strong>
                                                        {
                                                            quotation.project?.projectLocation ||
                                                            "—"
                                                        }
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Total
                                                    </span>

                                                    <strong>
                                                        {
                                                            formatCurrency(
                                                                quotation.subtotal ||
                                                                0
                                                            )
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* ==================================================
    QUOTATION ACTIONS
================================================== */}

<div className="official-quotation-actions">


    {/* ==============================================
        EDIT
    ============================================== */}

    <button

        type="button"

        className="edit-official-quotation-btn"

        onClick={() =>
            handleEditQuotation(
                quotation
            )
        }

    >

        Edit

    </button>


    {/* ==============================================
        GENERATE PDF
    ============================================== */}

    <button

        type="button"

        className="generate-official-quotation-btn"

        disabled={
            generatingPdfQuotation ===
            quotation._id
        }

        onClick={() =>
            handleGenerateQuotationPdf(
                quotation
            )
        }

    >

        {

            generatingPdfQuotation ===
            quotation._id

                ? "Generating..."

                : "Generate PDF"

        }

    </button>


    {/* ==============================================
        DELETE
    ============================================== */}

    <button

        type="button"

        className="delete-official-quotation-btn"

        disabled={
            deleteQuotationLoading ===
            quotation._id ||
            generatingPdfQuotation ===
            quotation._id
        }

        onClick={() =>
            handleDeleteQuotation(
                quotation
            )
        }

    >

        {

            deleteQuotationLoading ===
            quotation._id

                ? "Deleting..."

                : "Delete"

        }

    </button>


</div>
                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )
                }


                {/* ==================================================
                    PAGINATION
                ================================================== */}

                {!quotationsLoading &&
                    !quotationsError &&
                    officialQuotations.length > 0 &&
                    totalQuotationPages > 1 && (

                        <div className="projects-pagination">


                            {/* ======================================
                                PREVIOUS
                            ====================================== */}

                            <button

                                type="button"

                                className="pagination-btn"

                                disabled={
                                    quotationPage === 1
                                }

                                onClick={() =>
                                    handleQuotationPageChange(
                                        quotationPage - 1
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
                                            totalQuotationPages
                                    },

                                    (_, index) => {

                                        const pageNumber =
                                            index + 1;


                                        return (

                                            <button

                                                type="button"

                                                key={
                                                    pageNumber
                                                }

                                                className={

                                                    `pagination-number ${
                                                        quotationPage ===
                                                        pageNumber
                                                            ? "active"
                                                            : ""
                                                    }`

                                                }

                                                onClick={() =>
                                                    handleQuotationPageChange(
                                                        pageNumber
                                                    )
                                                }

                                            >

                                                {
                                                    pageNumber
                                                }

                                            </button>

                                        );

                                    }

                                )}

                            </div>


                            {/* ======================================
                                NEXT
                            ====================================== */}

                            <button

                                type="button"

                                className="pagination-btn"

                                disabled={

                                    quotationPage ===
                                    totalQuotationPages

                                }

                                onClick={() =>
                                    handleQuotationPageChange(
                                        quotationPage + 1
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


// ======================================================
// EXPORT
// ======================================================

export default DashboardCreateQuotation;