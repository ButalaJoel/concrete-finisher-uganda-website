import { Link } from "react-router-dom";

function CompanyHero() {
  return (
    <section className="company-hero">

      <div className="company-hero-overlay">

        <div className="company-container">

          <p className="company-section-label">
            ABOUT COMPANY
          </p>

          <h1>
            Building Durable Concrete Solutions Across Uganda
          </h1>

          <p>
            Learn more about Concrete Finisher Uganda, our experience,
            our process and our commitment to delivering professional
            concrete finishing solutions.
          </p>

          <Link
            to="/contact"
            className="company-button"
          >
            Request a Site Inspection
          </Link>

        </div>

      </div>

    </section>
  );
}

export default CompanyHero;