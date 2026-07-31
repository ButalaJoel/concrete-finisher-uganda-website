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

console.table(formData);

const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  

  const handleSubmit = async (event) => {

  event.preventDefault();

  try {

  const response = await fetch(
    "http://localhost:5000/api/quotations",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData),
    }
  );

  const data = await response.json();

  console.log(data);

} catch (error) {

  console.error(error);

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
        >
          REQUEST FREE QUOTATION
        </button>

      </form>

    </section>
  );
}

export default ContactForm;