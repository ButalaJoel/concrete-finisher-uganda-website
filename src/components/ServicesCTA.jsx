import { Link } from "react-router-dom";

function ServicesCTA() {
  return (
    <section className="services-cta">

      <div className="container">

        <h2>
          Ready To Start Your Flooring Project?
        </h2>

        <p>
          Contact our team today for a free consultation
          and quotation.
        </p>

        <Link
  to="/contact"
  className="services-cta-btn"
>
  GET A FREE QUOTE
</Link>

      </div>

    </section>
  );
}

export default ServicesCTA;