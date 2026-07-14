import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

import {
  Phone,
  MessageCircleMore,
  Mail,
  MapPin,
  ArrowRight
} from "lucide-react";

function HeroSection() {
  return (
    <>
     <section
        className="hero"
        style={{
          backgroundImage: `
          linear-gradient(
            to right,
            rgba(12,10,8,0.92) 0%,
            rgba(12,10,8,0.82) 28%,
            rgba(12,10,8,0.45) 55%,
            rgba(12,10,8,0.08) 100%
          ),
          url(${heroImage})
        `,
        }}
      >
        <div className="hero-content">
          <p className="subtitle">
            PREMIUM CONCRETE FINISHING SOLUTIONS
          </p>

          <h1>
  PRECISION FLOORS.
  <br />
  <span>BUILT TO LAST.</span>
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
              <h4>
                <Phone size={15} strokeWidth={2} />
                CALL US
              </h4>

              <p>+256 780 662 557</p>
            </a>

            <a
              href="https://wa.me/256780662557"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
             <h4>
            <MessageCircleMore size={15} strokeWidth={2} />
             WHATSAPP US
            </h4>

             <p>Chat on WhatsApp</p>
            </a>

            <a
             href="mailto:info@concretefinisherug.com"
             className="contact-card"
            >
          <h4>
          <Mail size={15} strokeWidth={2} />
           EMAIL US
          </h4>

           <p>info@concretefinisherug.com</p>
          </a>

            <a
             href="https://maps.google.com/?q=Kampala,Uganda"
             target="_blank"
             rel="noopener noreferrer"
             className="contact-card"
            >
           <h4>
            <MapPin size={15} strokeWidth={2} />
            LOCATION
            </h4>

           <p>Kampala, Uganda</p>
          </a>
          </div>
        </div>
      </section> 
    </>
  );
}

export default HeroSection;