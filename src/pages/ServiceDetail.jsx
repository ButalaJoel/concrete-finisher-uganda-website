import { useParams } from "react-router-dom";
import { servicesData } from "../data/servicesData";
import "../App.css";

function ServiceDetail() {
  const { slug } = useParams();

  const service = servicesData.find((item) => item.slug === slug);

  if (!service) {
    return <h1>Service not found</h1>;
  }

  return (
    <main className="service-detail-page">
      <section
        className="service-detail-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(12, 10, 8, 0.72), rgba(12, 10, 8, 0.72)), url(${service.heroImage})`,
        }}
      >
        <div className="service-detail-hero-content">
          <p className="section-tag">OUR SERVICES</p>
          <h1>{service.title}</h1>
          <p>{service.shortDescription}</p>
        </div>
      </section>

      <section className="service-overview">
        <div className="service-overview-content">
          <p className="section-tag">ABOUT THIS SERVICE</p>
          <h2>Built for Performance and Protection</h2>
          <p>{service.overview}</p>
        </div>
      </section>

      <section className="service-detail-info">
        <div className="service-detail-info-grid">
          <div className="service-detail-list">
            <p className="section-tag">KEY BENEFITS</p>
            <h2>Why Choose {service.title}?</h2>

            <ul>
              {service.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="service-detail-list">
            <p className="section-tag">IDEAL FOR</p>
            <h2>Recommended Applications</h2>

            <ul>
              {service.applications.map((application) => (
                <li key={application}>{application}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="service-detail-cta">
        <p className="section-tag">START YOUR PROJECT</p>
        <h2>Need a Durable Flooring Solution?</h2>
        <p>
          Talk to our team about the right flooring system for your space.
        </p>
        <button>Request a Site Inspection</button>
      </section>
    </main>
  );
}

export default ServiceDetail;