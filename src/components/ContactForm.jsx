import { useState } from "react";

function ContactForm() {


  const [formData, setFormData] = useState({
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
});

 const [isSubmitting, setIsSubmitting] = useState(false);

console.table(formData);

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
//
// RESPONSIBILITIES:
// • Prevent normal browser form refresh
// • Prevent duplicate submissions
// • Send quotation data to Express API
// • Check whether request succeeded
// • Convert server response to JavaScript
// • Handle submission errors
// • Reset submission state
// ======================================================

const handleSubmit = async (event) => {


  // ==================================================
  // PREVENT DEFAULT FORM BEHAVIOUR
  //
  // Normally submitting an HTML form refreshes
  // the browser page.
  //
  // preventDefault() stops that behaviour so React
  // can handle the submission instead.
  // ==================================================

  event.preventDefault();


  // ==================================================
  // PREVENT DUPLICATE SUBMISSION
  //
  // If a quotation is already being submitted,
  // stop the function immediately.
  //
  // This prevents another POST request from being
  // sent when the user clicks the button again.
  // ==================================================

  if (isSubmitting) {

    return;

  }


  // ==================================================
  // START SUBMISSION
  //
  // Tell React that the form is currently submitting.
  //
  // The submit button will use this state to become
  // disabled until the request finishes.
  // ==================================================

  setIsSubmitting(true);


  try {


    // ==================================================
    // SEND QUOTATION TO BACKEND
    //
    // POST sends the formData object to our Express API.
    //
    // VITE_API_URL comes from our .env file.
    // ==================================================

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


    // ==================================================
    // CHECK SERVER RESPONSE
    //
    // response.ok tells us whether the HTTP request
    // completed successfully.
    //
    // For example:
    //
    // 201 = quotation successfully created
    // 400 = bad request
    // 500 = server error
    //
    // If response.ok is false, throw an error and
    // move execution into the catch block.
    // ==================================================

    if (!response.ok) {

      throw new Error(
        "Failed to submit quotation."
      );

    }


    // ==================================================
    // CONVERT RESPONSE FROM JSON
    //
    // The backend sends JSON.
    //
    // response.json() converts that JSON response
    // into a JavaScript object that React can use.
    //
    // We only do this AFTER checking response.ok.
    // ==================================================

    const data = await response.json();


    // ==================================================
    // SUCCESS
    //
    // For now we log the server response so we can
    // confirm that the quotation was created.
    // ==================================================

    console.log(
      "Quotation submitted successfully:",
      data
    );


  } catch (error) {


    // ==================================================
    // HANDLE SUBMISSION ERROR
    //
    // This runs if:
    // • The server cannot be reached
    // • The POST request fails
    // • response.ok is false
    // ==================================================

    console.error(
      "Quotation submission error:",
      error
    );


  } finally {


    // ==================================================
    // FINISH SUBMISSION
    //
    // finally runs whether the request succeeds
    // OR fails.
    //
    // Setting isSubmitting back to false enables
    // the submit button again.
    // ==================================================

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
              >

              <option value="">Select Service</option>

              <option value="Epoxy Flooring">Epoxy Flooring</option>
              <option value="Concrete Polishing">Concrete Polishing</option>
              <option value="Concrete Stamping">Concrete Stamping</option>
              <option value="Terrazzo Flooring">Terrazzo Flooring</option>
              <option value="Surface Preparation">Surface Preparation</option>
              <option value="Waterproofing">Waterproofing</option>
            </select>

          </div>

          <div className="form-group">

            <label>Property Type *</label>

            <select
               name="propertyType"
               value={formData.propertyType}
               onChange={handleChange}
               >

              <option value="">Select Property</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>

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
            ></textarea>

        </div>

        <button
  type="submit"
  className="contact-submit-btn"
  disabled={isSubmitting}
>
  {isSubmitting
    ? "SUBMITTING..."
    : "REQUEST FREE QUOTATION"
  }
</button>
      </form>

    </section>
  );
}

export default ContactForm;