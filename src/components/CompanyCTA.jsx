import { Link } from "react-router-dom";

function CompanyCTA() {
  return (
    <section className="company-cta">

      <div className="company-container">

        <h2>
          Ready To Start Your Concrete Project?
        </h2>

        <p>
          Contact our team for professional advice, a site inspection and a free quotation.
        </p>

        <Link
          to="/contact"
          className="company-button"
        >
          Contact Us
        </Link>

      </div>

    </section>
  );
}

export default CompanyCTA;