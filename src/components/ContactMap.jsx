function ContactMap() {
  return (
    <section className="contact-map-section">

      <div className="contact-map-header">

        <span>VISIT OUR OFFICE</span>

        <h2>Find Concrete Finisher Uganda</h2>

        <p>
          Visit our office in Kampala for consultations, quotations and
          project discussions. Our team is ready to help you choose the
          right flooring solution.
        </p>

      </div>

      <div className="contact-map-container">

        <div className="map-frame">

          <iframe
            title="Concrete Finisher Uganda Location"
            src="https://www.google.com/maps?q=Plot+56+6th+Street+Industrial+Area+Kampala&output=embed"
            loading="lazy"
            allowFullScreen
          ></iframe>

        </div>

        <div className="map-details">

          <h3>Office Location</h3>

          <p>
            Plot 56, 6th Street<br />
            Industrial Area<br />
            Kampala, Uganda
          </p>

          <div className="map-features">

            <div>✓ Customer Parking Available</div>

            <div>✓ Easy Access for Site Visits</div>

            <div>✓ Professional Consultations</div>

            <div>✓ Product & Flooring Advice</div>

          </div>

          <a
            href="https://maps.google.com/?q=Plot+56+6th+Street+Industrial+Area+Kampala"
            target="_blank"
            rel="noopener noreferrer"
            className="map-btn"
          >
            Open in Google Maps
          </a>

        </div>

      </div>

    </section>
  );
}

export default ContactMap;