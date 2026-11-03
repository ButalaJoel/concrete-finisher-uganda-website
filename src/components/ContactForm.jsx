import { useState } from "react";

const initialFormData = {
  fullName: "",
  company: "",
  phoneNumber: "",
  email: "",
  serviceRequired: "",
  propertyType: "",
  projectLocation: "",
  estimatedArea: "",
  preferredStartDate: "",
  projectDescription: "",
};

function ContactForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ======================================================
  // HANDLE FORM SUBMISSION
  //
  // Sends quotation form data to the backend API.
  // Prevents duplicate submissions, shows loading feedback,
  // resets the form after success and shows success feedback.
  // ======================================================

  const handleSubmit = async (event) => {
    // Prevent normal browser form refresh
    event.preventDefault();

    // Stop duplicate submissions
    if (isSubmitting || isSubmitted) {
      return;
    }

    // Start submission
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      // Send quotation to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/quotations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Check whether request was successful
      if (!response.ok) {
        throw new Error("Failed to submit quotation.");
      }

      // Clear all form fields
      setFormData(initialFormData);

      // Show successful submission state
      setIsSubmitted(true);

      // Return button to normal after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

    } catch (error) {
      setSubmissionError(
        error.message || "Unable to submit your request. Please try again."
      );

    } finally {
      // End loading state
      setIsSubmitting(false);
    }
  };

  const fieldProps = (name) => ({
    id: `quote-${name}`,
    name,
    value: formData[name],
    onChange: handleChange,
  });

  return (
    <div className="quote-form">
      <div className="quote-form__head">
        <h2 className="h2">Request a quotation</h2>
        <p>
          Fill in what you know. A specialist will review it and call you to arrange
          a site inspection. Fields marked * are required.
        </p>
      </div>

      {submissionError && (
        <p className="form-alert form-alert--error" role="alert">
          {submissionError}
        </p>
      )}

      {isSubmitted && (
        <p className="form-alert form-alert--success" role="status">
          Thanks, your request has been sent. We'll be in touch within one working day.
        </p>
      )}

      <form className="form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
        <div className="form__grid">
          <div className="field">
            <label htmlFor="quote-fullName">Full name *</label>
            <input type="text" autoComplete="name" required {...fieldProps("fullName")} />
          </div>

          <div className="field">
            <label htmlFor="quote-company">Company</label>
            <input type="text" autoComplete="organization" {...fieldProps("company")} />
          </div>

          <div className="field">
            <label htmlFor="quote-phoneNumber">Phone number *</label>
            <input type="tel" autoComplete="tel" placeholder="+256" required {...fieldProps("phoneNumber")} />
          </div>

          <div className="field">
            <label htmlFor="quote-email">Email</label>
            <input type="email" autoComplete="email" {...fieldProps("email")} />
          </div>

          <div className="field">
            <label htmlFor="quote-serviceRequired">Service *</label>
            <select required {...fieldProps("serviceRequired")}>
              <option value="">Choose a service</option>
              <option value="Epoxy Flooring">Epoxy flooring</option>
              <option value="Concrete Polishing">Concrete polishing</option>
              <option value="Concrete Stamping">Concrete stamping</option>
              <option value="Terrazzo Flooring">Terrazzo flooring</option>
              <option value="Surface Preparation">Surface preparation</option>
              <option value="Waterproofing">Waterproofing</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="quote-propertyType">Property type *</label>
            <select required {...fieldProps("propertyType")}>
              <option value="">Choose a property type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="quote-projectLocation">Project location *</label>
            <input type="text" placeholder="e.g. Namanve, Mukono" required {...fieldProps("projectLocation")} />
          </div>

          <div className="field">
            <label htmlFor="quote-estimatedArea">Approximate area (m²)</label>
            <input type="number" min="0" inputMode="numeric" {...fieldProps("estimatedArea")} />
          </div>

          <div className="field">
            <label htmlFor="quote-preferredStartDate">Preferred start date</label>
            <input type="date" {...fieldProps("preferredStartDate")} />
          </div>

          <div className="field field--full">
            <label htmlFor="quote-projectDescription">About the project *</label>
            <textarea
              rows="6"
              placeholder="What is the space used for? What condition is the floor in now?"
              required
              {...fieldProps("projectDescription")}
            />
          </div>
        </div>

        <button type="submit" className="btn btn--primary btn--lg" disabled={isSubmitting || isSubmitted}>
          {isSubmitting ? "Sending request…" : isSubmitted ? "Request sent" : "Send quotation request"}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
