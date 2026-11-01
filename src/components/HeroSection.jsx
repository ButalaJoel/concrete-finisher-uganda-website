import { Link } from "react-router-dom";
import heroVideo from "../assets/hero-video.mp4";
import "../styles/HeroSection.css";

import {
  Phone,
  MessageCircleMore,
  Mail,
  MapPin,
  ArrowRight
} from "lucide-react";

function HeroSection() {
  return (
    <section className="hero">

      {/* Background Video */}
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="hero-overlay"></div>

      {/* Hero Content */}
      <div className="hero-content">

        <p className="subtitle">
          PREMIUM CONCRETE FINISHING SOLUTIONS
        </p>

        <h1>
          Precision Floors.
          <br />
          <span>Built to Last.</span>
        </h1>

        <p className="hero-text">
          We deliver high-performance flooring systems including epoxy
          flooring, concrete polishing, grinding, stamping,
          terrazzo, waterproofing and decorative finishes.
        </p>

        <div className="hero-buttons">

          <Link to="/contact" className="primary-btn">
            GET FREE QUOTE
            <ArrowRight size={15} />
          </Link>

          <Link to="/projects" className="secondary-btn">
            VIEW OUR PROJECTS
            <ArrowRight size={15} />
          </Link>

        </div>

        <div className="contact-bar">

          <a
            href="tel:+256780662557"
            className="contact-card"
          >
            <p>
              <Phone size={16} strokeWidth={2} aria-hidden="true" />
              <span>+256 780 662 557</span>
            </p>
          </a>

          <a
            href="https://wa.me/256780662557"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
          >
            <p>
              <MessageCircleMore size={16} strokeWidth={2} aria-hidden="true" />
              <span>Chat on WhatsApp</span>
            </p>
          </a>

          <a
            href="mailto:info@concretefinisherug.com"
            className="contact-card"
          >
            <p>
              <Mail size={16} strokeWidth={2} aria-hidden="true" />
              <span>info@concretefinisherug.com</span>
            </p>
          </a>

          <a
            href="https://maps.google.com/?q=Kampala,Uganda"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
          >
            <p>
              <MapPin size={16} strokeWidth={2} aria-hidden="true" />
              <span>Kampala, Uganda</span>
            </p>
          </a>

        </div>

      </div>
    </section>
  );
}

export default HeroSection;