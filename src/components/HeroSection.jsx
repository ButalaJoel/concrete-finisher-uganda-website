import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import heroVideo from "../assets/hero-video.mp4";
import heroPoster from "../assets/services/polishing.jpg";
import { CONTACT } from "../data/contact";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__media" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="metadata" poster={heroPoster}>
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      <div className="wrap hero__content">
        <p className="hero__kicker">Concrete finishing specialists, Kampala</p>
        <h1>Precision floors, built to last.</h1>
        <p className="hero__lede">
          Epoxy flooring, concrete polishing, grinding, stamping, terrazzo and
          waterproofing for factories, warehouses, businesses and homes across Uganda.
        </p>
        <div className="hero__actions">
          <Link to="/contact#quote" className="btn btn--primary btn--lg">
            Get a free quote
          </Link>
          <Link to="/projects" className="btn btn--outline-light btn--lg">
            See our projects
          </Link>
        </div>
      </div>

      <ul className="hero__strip wrap" aria-label="Contact options">
        <li>
          <a href={CONTACT.phoneHref}>
            <Phone size={18} aria-hidden="true" />
            <span><small>Call</small>{CONTACT.phone}</span>
          </a>
        </li>
        <li>
          <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden="true" />
            <span><small>WhatsApp</small>Send photos of your floor</span>
          </a>
        </li>
        <li>
          <a href={CONTACT.emailHref}>
            <Mail size={18} aria-hidden="true" />
            <span><small>Email</small>{CONTACT.email}</span>
          </a>
        </li>
        <li>
          <a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer">
            <MapPin size={18} aria-hidden="true" />
            <span><small>Office</small>Luzira, Kampala</span>
          </a>
        </li>
      </ul>
    </section>
  );
}

export default HeroSection;
