import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Download,
    Eye,
    FilePlus,
    Printer,
    Receipt,
    Search,
    Ban,
} from "lucide-react";
import "../styles/dashboard/Receipts.css";

const API_URL = import.meta.env.VITE_API_URL;
const RECEIPTS_URL = `${API_URL}/api/payment-receipts`;
const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Mobile Money", "Cheque", "Other"];

const getAuthToken = () =>
    localStorage.getItem("cf_auth_token") ||
    sessionStorage.getItem("cf_auth_token");

const getAdminName = () => {
    const storedAdmin =
        localStorage.getItem("cf_admin") || sessionStorage.getItem("cf_admin");

    if (!storedAdmin) return "";
    try {
        return JSON.parse(storedAdmin).fullName || "";
    } catch (error) {
        console.error("Unable to read administrator data:", error);
        return "";
    }
};

const formatDate = (date) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("en-UG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

const formatCurrency = (amount) =>
    `${new Intl.NumberFormat("en-UG", {
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))} UGX`;

const localDateValue = () => {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
};

const responseData = async (response, fallback) => {
    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error(fallback);
    }
    if (!response.ok) throw new Error(result.message || fallback);
    return result;
};

function ReceiptHistory() {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [status, setStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const loadReceipts = async () => {
            setLoading(true);
            setError("");
            try {
                const params = new URLSearchParams();
                if (search.trim()) params.set("search", search.trim());
                if (paymentMethod) params.set("paymentMethod", paymentMethod);
                if (status) params.set("status", status);
                if (dateFrom) params.set("dateFrom", dateFrom);
                if (dateTo) params.set("dateTo", dateTo);

                const response = await fetch(`${RECEIPTS_URL}?${params.toString()}`, {
                    headers: { Authorization: `Bearer ${getAuthToken()}` },
                    signal: controller.signal,
                });
                const result = await responseData(response, "Unable to load payment receipts.");
                setReceipts(result.data || []);
            } catch (fetchError) {
                if (fetchError.name !== "AbortError") {
                    console.error("Payment receipt history error:", fetchError);
                    setError(fetchError.message);
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        loadReceipts();
        return () => controller.abort();
    }, [dateFrom, dateTo, paymentMethod, search, status]);

    return (
        <section className="receipts-page">
            <header className="receipts-page-header">
                <div>
                    <h1>Payment Receipts</h1>
                    <p>Record and manage payments received from customers.</p>
                </div>
                <Link className="receipt-primary-button" to="/dashboard/receipts/new">
                    <FilePlus size={17} />
                    Create Receipt
                </Link>
            </header>

            <div className="receipts-filter-panel">
                <label className="receipt-search-field">
                    <Search size={17} aria-hidden="true" />
                    <span className="receipt-visually-hidden">Search receipts</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search number, customer, project or reference"
                    />
                </label>
                <label>
                    <span>Payment method</span>
                    <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                        <option value="">All methods</option>
                        {PAYMENT_METHODS.map((method) => <option key={method}>{method}</option>)}
                    </select>
                </label>
                <label>
                    <span>Status</span>
                    <select value={status} onChange={(event) => setStatus(event.target.value)}>
                        <option value="">All statuses</option>
                        <option>Issued</option>
                        <option>Voided</option>
                    </select>
                </label>
                <label>
                    <span>From</span>
                    <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
                </label>
                <label>
                    <span>To</span>
                    <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
                </label>
            </div>

            {error && <div className="receipt-alert" role="alert">{error}</div>}

            <div className="receipts-table-wrap" aria-busy={loading}>
                {loading && <span className="receipt-visually-hidden" role="status">Loading receipts</span>}
                <table className="receipts-table">
                    <thead>
                        <tr>
                            <th>Receipt number</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Amount received</th>
                            <th>Payment method</th>
                            <th>Status</th>
                            <th><span className="receipt-visually-hidden">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 4 }, (_, row) => (
                                <tr key={`loading-${row}`} aria-hidden="true">
                                    {Array.from({ length: 7 }, (_, column) => (
                                        <td key={column}>
                                            <span className="dashboard-skeleton dashboard-skeleton-table-cell" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : receipts.length ? receipts.map((receipt) => (
                            <tr key={receipt._id}>
                                <td className="receipt-number-cell">{receipt.receiptNumber}</td>
                                <td>{receipt.customer?.fullName}</td>
                                <td>{formatDate(receipt.paymentDate)}</td>
                                <td className="receipt-amount-cell">{formatCurrency(receipt.amountReceived)}</td>
                                <td>{receipt.paymentMethod}</td>
                                <td>
                                    <span className={`receipt-status receipt-status-${receipt.status.toLowerCase()}`}>
                                        {receipt.status}
                                    </span>
                                </td>
                                <td>
                                    <Link
                                        className="receipt-icon-button"
                                        to={`/dashboard/receipts/${receipt._id}`}
                                        aria-label={`View ${receipt.receiptNumber}`}
                                        title="View receipt"
                                    >
                                        <Eye size={17} />
                                    </Link>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td className="receipt-table-message" colSpan="7">
                                    No receipts found. Create a receipt after recording a payment.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function CreateReceipt() {
    const navigate = useNavigate();
    const [quotations, setQuotations] = useState([]);
    const [loadingQuotations, setLoadingQuotations] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        paymentDate: localDateValue(),
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        projectDescription: "",
        relatedQuotation: "",
        amountReceived: "",
        paymentMethod: "Cash",
        transactionReference: "",
        receivedBy: getAdminName(),
        notes: "",
    });

    useEffect(() => {
        const loadQuotations = async () => {
            setLoadingQuotations(true);
            try {
                const response = await fetch(`${API_URL}/api/official-quotations`, {
                    headers: { Authorization: `Bearer ${getAuthToken()}` },
                });
                const result = await responseData(response, "Unable to load quotations.");
                setQuotations(result.data || []);
            } catch (fetchError) {
                console.error("Receipt quotation options error:", fetchError);
                setError(fetchError.message);
            } finally {
                setLoadingQuotations(false);
            }
        };
        loadQuotations();
    }, []);

    const changeField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const submitReceipt = async (event) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const response = await fetch(RECEIPTS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify({
                    paymentDate: form.paymentDate,
                    customer: {
                        fullName: form.customerName,
                        phoneNumber: form.customerPhone,
                        email: form.customerEmail,
                    },
                    projectDescription: form.projectDescription,
                    relatedQuotation: form.relatedQuotation || null,
                    amountReceived: Number(form.amountReceived),
                    paymentMethod: form.paymentMethod,
                    transactionReference: form.transactionReference,
                    receivedBy: form.receivedBy,
                    notes: form.notes,
                }),
            });
            const result = await responseData(response, "Unable to create payment receipt.");
            navigate(`/dashboard/receipts/${result.data._id}`);
        } catch (submitError) {
            console.error("Create payment receipt error:", submitError);
            setError(submitError.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="receipts-page">
            <Link to="/dashboard/receipts" className="receipt-back-link"><ArrowLeft size={16} /> Receipts</Link>
            <header className="receipt-form-heading">
                <div className="receipt-heading-icon"><Receipt size={22} /></div>
                <div>
                    <h1>Create Payment Receipt</h1>
                    <p>The receipt number is generated securely when you save.</p>
                </div>
            </header>

            {error && <div className="receipt-alert" role="alert">{error}</div>}
            <form className="receipt-form" onSubmit={submitReceipt}>
                <div className="receipt-form-section">
                    <h2>Payment details</h2>
                    <div className="receipt-form-grid">
                        <label>
                            <span>Date payment received <b>*</b></span>
                            <input name="paymentDate" type="date" required value={form.paymentDate} onChange={changeField} />
                        </label>
                        <label>
                            <span>Amount received (UGX) <b>*</b></span>
                            <input name="amountReceived" type="number" min="0.01" step="0.01" required value={form.amountReceived} onChange={changeField} placeholder="e.g. 500000" />
                        </label>
                        <label>
                            <span>Payment method <b>*</b></span>
                            <select name="paymentMethod" required value={form.paymentMethod} onChange={changeField}>
                                {PAYMENT_METHODS.map((method) => <option key={method}>{method}</option>)}
                            </select>
                        </label>
                        <label>
                            <span>Transaction / reference number</span>
                            <input name="transactionReference" value={form.transactionReference} onChange={changeField} maxLength="120" />
                        </label>
                    </div>
                </div>

                <div className="receipt-form-section">
                    <h2>Customer</h2>
                    <div className="receipt-form-grid">
                        <label>
                            <span>Customer name <b>*</b></span>
                            <input name="customerName" required value={form.customerName} onChange={changeField} maxLength="160" />
                        </label>
                        <label>
                            <span>Phone number <b>*</b></span>
                            <input name="customerPhone" required value={form.customerPhone} onChange={changeField} maxLength="50" />
                        </label>
                        <label>
                            <span>Email address</span>
                            <input name="customerEmail" type="email" value={form.customerEmail} onChange={changeField} maxLength="160" />
                        </label>
                        <label>
                            <span>Related quotation</span>
                            <select name="relatedQuotation" value={form.relatedQuotation} onChange={changeField} disabled={loadingQuotations}>
                                <option value="">{loadingQuotations ? "Loading quotations..." : "No quotation linked"}</option>
                                {quotations.map((quotation) => (
                                    <option key={quotation._id} value={quotation._id}>
                                        {quotation.quotationNumber} — {quotation.customer?.fullName || "Customer"}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                <div className="receipt-form-section">
                    <h2>Project and receipt notes</h2>
                    <div className="receipt-form-grid">
                        <label className="receipt-form-full">
                            <span>Project name / payment description <b>*</b></span>
                            <input name="projectDescription" required value={form.projectDescription} onChange={changeField} maxLength="500" />
                        </label>
                        <label>
                            <span>Payment received by <b>*</b></span>
                            <input name="receivedBy" required value={form.receivedBy} onChange={changeField} maxLength="160" />
                        </label>
                        <label className="receipt-form-full">
                            <span>Additional notes</span>
                            <textarea name="notes" rows="3" value={form.notes} onChange={changeField} maxLength="1000" />
                        </label>
                    </div>
                </div>
                <div className="receipt-form-actions">
                    <Link to="/dashboard/receipts" className="receipt-secondary-button">Cancel</Link>
                    <button className="receipt-primary-button" type="submit" disabled={submitting}>
                        {submitting ? "Saving..." : "Issue Receipt"}
                    </button>
                </div>
            </form>
        </section>
    );
}

function ReceiptDetails() {
    const { id } = useParams();
    const [receipt, setReceipt] = useState(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [voiding, setVoiding] = useState(false);
    const [error, setError] = useState("");
    const frameRef = useRef(null);

    const loadPdf = useCallback(async () => {
        const response = await fetch(`${RECEIPTS_URL}/${id}/pdf`, {
            headers: { Authorization: `Bearer ${getAuthToken()}` },
        });
        if (!response.ok) {
            const result = await responseData(response, "Unable to generate receipt PDF.");
            throw new Error(result.message);
        }
        const nextUrl = URL.createObjectURL(await response.blob());
        setPdfUrl(nextUrl);
    }, [id]);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await fetch(`${RECEIPTS_URL}/${id}`, {
                    headers: { Authorization: `Bearer ${getAuthToken()}` },
                });
                const result = await responseData(response, "Unable to load payment receipt.");
                if (cancelled) return;
                setReceipt(result.data);

                const pdfResponse = await fetch(`${RECEIPTS_URL}/${id}/pdf`, {
                    headers: { Authorization: `Bearer ${getAuthToken()}` },
                });
                if (!pdfResponse.ok) {
                    await responseData(pdfResponse, "Unable to generate receipt PDF.");
                }
                const url = URL.createObjectURL(await pdfResponse.blob());
                if (cancelled) {
                    URL.revokeObjectURL(url);
                } else {
                    setPdfUrl(url);
                }
            } catch (loadError) {
                if (!cancelled) {
                    console.error("Payment receipt detail error:", loadError);
                    setError(loadError.message);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    }, [pdfUrl]);

    const downloadPdf = async () => {
        setError("");
        try {
            const response = await fetch(`${RECEIPTS_URL}/${id}/pdf?download=true`, {
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            if (!response.ok) {
                await responseData(response, "Unable to download receipt PDF.");
            }
            const url = URL.createObjectURL(await response.blob());
            const link = document.createElement("a");
            link.href = url;
            link.download = `${receipt.receiptNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (downloadError) {
            console.error("Receipt PDF download error:", downloadError);
            setError(downloadError.message);
        }
    };

    const voidReceipt = async () => {
        if (!window.confirm(`Void receipt ${receipt.receiptNumber}? This action cannot be undone.`)) return;
        setVoiding(true);
        setError("");
        try {
            const response = await fetch(`${RECEIPTS_URL}/${id}/void`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            const result = await responseData(response, "Unable to void payment receipt.");
            setReceipt(result.data);
            await loadPdf();
        } catch (voidError) {
            console.error("Void payment receipt error:", voidError);
            setError(voidError.message);
        } finally {
            setVoiding(false);
        }
    };

    const printReceipt = () => {
        if (!pdfUrl) return;
        const frame = frameRef.current;
        if (frame?.contentWindow) {
            frame.contentWindow.focus();
            frame.contentWindow.print();
        } else {
            window.open(pdfUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <section className="receipts-page">
            <Link to="/dashboard/receipts" className="receipt-back-link"><ArrowLeft size={16} /> Receipts</Link>
            {error && <div className="receipt-alert" role="alert">{error}</div>}
            {loading ? <p className="receipt-loading">Loading receipt...</p> : receipt ? (
                <>
                    <header className="receipt-detail-header">
                        <div>
                            <div className="receipt-detail-number">
                                <h1>{receipt.receiptNumber}</h1>
                                <span className={`receipt-status receipt-status-${receipt.status.toLowerCase()}`}>{receipt.status}</span>
                            </div>
                            <p>{receipt.customer.fullName} · {formatCurrency(receipt.amountReceived)}</p>
                        </div>
                        <div className="receipt-detail-actions">
                            <button type="button" className="receipt-secondary-button" onClick={printReceipt} disabled={!pdfUrl}>
                                <Printer size={16} /> Print
                            </button>
                            <button type="button" className="receipt-secondary-button" onClick={downloadPdf} disabled={!pdfUrl}>
                                <Download size={16} /> Download PDF
                            </button>
                            {receipt.status === "Issued" && (
                                <button type="button" className="receipt-danger-button" onClick={voidReceipt} disabled={voiding}>
                                    <Ban size={16} /> {voiding ? "Voiding..." : "Void receipt"}
                                </button>
                            )}
                        </div>
                    </header>
                    <div className="receipt-preview-wrap">
                        {pdfUrl ? (
                            <iframe ref={frameRef} className="receipt-pdf-preview" src={pdfUrl} title={`Preview of ${receipt.receiptNumber}`} />
                        ) : <p className="receipt-loading">Preparing receipt preview...</p>}
                    </div>
                </>
            ) : null}
        </section>
    );
}

export default function DashboardReceipts() {
    const { id } = useParams();
    const { pathname } = useLocation();

    if (pathname.endsWith("/new")) return <CreateReceipt />;
    if (id) return <ReceiptDetails />;
    return <ReceiptHistory />;
}
