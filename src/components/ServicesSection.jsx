import { Link } from "react-router-dom";
import { SERVICES } from "../data/services";

// Grid of service cards. Used on the home page and the services page.
function ServicesSection({ title = "What we do", intro, showAllLink = true, headingLevel = "h2" }) {
  const Heading = headingLevel;

  return (
    <section className="section section--tint">
      <div className="wrap">
        <div className="section-head">
          <Heading className="h2">{title}</Heading>
          {intro && <p className="lede">{intro}</p>}
          {showAllLink && (
            <Link to="/services" className="link-arrow section-head__link">All services</Link>
          )}
        </div>

        <ul className="service-grid">
          {SERVICES.map((service) => (
            <li key={service.slug}>
              <Link to={`/services/${service.slug}`} className="service-card">
                <div className="service-card__img">
                  <img src={service.image} alt="" loading="lazy" />
                </div>
                <div className="service-card__body">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ServicesSection;
