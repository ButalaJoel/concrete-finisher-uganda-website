

function ContactForm() {
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

      <form className="contact-form">

        <div className="form-row">

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>Company (Optional)</label>
            <input
              type="text"
              placeholder="ABC Ltd"
            />
          </div>

        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              placeholder="+256..."
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
            />
          </div>

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>Service Required *</label>

            <select>

              <option>Select Service</option>

              <option>Epoxy Flooring</option>

              <option>Concrete Polishing</option>

              <option>Concrete Stamping</option>

              <option>Terrazzo Flooring</option>

              <option>Surface Preparation</option>

              <option>Waterproofing</option>

            </select>

          </div>

          <div className="form-group">

            <label>Property Type *</label>

            <select>

              <option>Select Property</option>

              <option>Residential</option>

              <option>Commercial</option>

              <option>Industrial</option>

            </select>

          </div>

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>Project Location *</label>

            <input
              type="text"
              placeholder="Kampala"
            />

          </div>

          <div className="form-group">

            <label>Estimated Area (m²)</label>

            <input
              type="text"
              placeholder="500"
            />

          </div>

        </div>

        <div className="form-group">

          <label>Preferred Start Date</label>

          <input type="date" />

        </div>

        <div className="form-group">

          <label>Project Description *</label>

          <textarea
            rows="7"
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