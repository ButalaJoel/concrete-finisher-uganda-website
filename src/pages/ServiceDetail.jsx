import { Link, useParams } from "react-router-dom";
import { Check } from "lucide-react";

import { servicesData } from "../data/servicesData";
import { SERVICES } from "../data/services";
import SiteShell from "../components/SiteShell";
import PageHero from "../components/PageHero";
import CtaBand from "../components/CtaBand";

function ServiceDetail() {
  const { slug } = useParams();
  const service = servicesData.find((item) => item.slug === slug);

  if (!service) {
    return (
      <SiteShell>
        <section className="not-found wrap">
          <h1 className="h2">That service isn't available.</h1>
          <p className="lede">The link may be out of date. See the full list of services instead.</p>
          <Link to="/services" className="btn btn--primary">View all services</Link>
        </section>
      </SiteShell>
    );
  }

  const others = SERVICES.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <SiteShell>
      <PageHero
        image={service.heroImage}
        crumb={[{ label: "Services", to: "/services" }, { label: service.title }]}
        title={service.title}
        intro={service.shortDescription}
      >
        <div className="page-hero__actions">
          <Link to="/contact#quote" className="btn btn--primary">Get a quote for {service.title.toLowerCase()}</Link>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap detail">
          <div className="prose">
            <h2 className="h2">About this service</h2>
            <p className="lede">{service.overview}</p>
          </div>

          <div className="detail__lists">
            <div className="checklist">
              <h3>Benefits</h3>
              <ul>
                {service.benefits.map((b) => (
                  <li key={b}><Check size={18} aria-hidden="true" />{b}</li>
                ))}
              </ul>
            </div>
            <div className="checklist">
              <h3>Where it's used</h3>
              <ul className="tags">
                {service.applications.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">Other services</h2>
            <Link to="/services" className="link-arrow section-head__link">All services</Link>
          </div>
          <ul className="service-grid">
            {others.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className="service-card">
                  <div className="service-card__img"><img src={s.image} alt="" loading="lazy" /></div>
                  <div className="service-card__body"><h3>{s.title}</h3><p>{s.text}</p></div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={`Need ${service.title.toLowerCase()}?`} />
    </SiteShell>
  );
}

export default ServiceDetail;
