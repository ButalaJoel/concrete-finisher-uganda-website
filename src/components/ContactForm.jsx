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

      // Convert backend response to JavaScript
      const data = await response.json();

      console.log(
        "Quotation submitted successfully:",
        data
      );

      // Clear all form fields
      setFormData(initialFormData);

      // Show successful submission state
      setIsSubmitted(true);

      // Return button to normal after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error(
        "Quotation submission error:",
        error
      );

    } finally {
      // End loading state
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-form-section">

      <div className="contact-form-header">

        <span>REQUEST A QUOTATION</span>

        <h2>
          Tell Us About Your Project
        </h2>

        <p>
          Complete the form below and our specialists will review your
          requirements before preparing a free quotation or arranging a
          site inspection.
        </p>

      </div>

      <form
        className="contact-form"
        onSubmit={handleSubmit}
      >

        <div className="form-row">

          <div className="form-group">

            <label>Full Name *</label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

          </div>

          <div className="form-group">

            <label>Company (Optional)</label>

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="ABC Ltd"
            />

          </div>

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>Phone Number *</label>

            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+256..."
              required
            />

          </div>

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

          </div>

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>Service Required *</label>

            <select
              name="serviceRequired"
              value={formData.serviceRequired}
              onChange={handleChange}
              required
            >

              <option value="">Select Service</option>

              <option value="Epoxy Flooring">
                Epoxy Flooring
              </option>

              <option value="Concrete Polishing">
                Concrete Polishing
              </option>

              <option value="Concrete Stamping">
                Concrete Stamping
              </option>

              <option value="Terrazzo Flooring">
                Terrazzo Flooring
              </option>

              <option value="Surface Preparation">
                Surface Preparation
              </option>

              <option value="Waterproofing">
                Waterproofing
              </option>

            </select>

          </div>

          <div className="form-group">

            <label>Property Type *</label>

            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
            >

              <option value="">Select Property</option>

              <option value="Residential">
                Residential
              </option>

              <option value="Commercial">
                Commercial
              </option>

              <option value="Industrial">
                Industrial
              </option>

            </select>

          </div>

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>Project Location *</label>

            <input
              type="text"
              name="projectLocation"
              value={formData.projectLocation}
              onChange={handleChange}
              placeholder="Kampala"
              required
            />

          </div>

          <div className="form-group">

            <label>Estimated Area (m²)</label>

            <input
              type="number"
              name="estimatedArea"
              value={formData.estimatedArea}
              onChange={handleChange}
              placeholder="500"
            />

          </div>

        </div>

        <div className="form-group">

          <label>Preferred Start Date</label>

          <input
            type="date"
            name="preferredStartDate"
            value={formData.preferredStartDate}
            onChange={handleChange}
          />

        </div>

        <div className="form-group">

          <label>Project Description *</label>

          <textarea
            rows="7"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            placeholder="Tell us about your project..."
            required
          />

        </div>

        <button
          type="submit"
          className="contact-submit-btn"
          disabled={isSubmitting || isSubmitted}
        >
          {isSubmitting
            ? "SUBMITTING..."
            : isSubmitted
            ? "QUOTATION REQUEST SENT ✓"
            : "REQUEST FREE QUOTATION"
          }
        </button>

      </form>

    </section>
  );
}

export default ContactForm;