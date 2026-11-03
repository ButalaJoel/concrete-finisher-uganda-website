import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import logo from "../assets/logo.png";
import { CONTACT } from "../data/contact";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap footer__top">
        <div className="footer__brand">
          <img src={logo} alt="Concrete Finisher" className="footer__logo" width="900" height="261" />
          <p>
            Epoxy flooring, polished concrete, terrazzo, stamping and waterproofing
            for factories, businesses and homes across Uganda.
          </p>
        </div>

        <div className="footer__col">
          <h2>Company</h2>
          <ul>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/company#process">How we work</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/company#faq">FAQs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h2>Services</h2>
          <ul>
            <li><Link to="/services/epoxy-flooring">Epoxy flooring</Link></li>
            <li><Link to="/services/concrete-polishing">Concrete polishing</Link></li>
            <li><Link to="/services/concrete-stamping">Concrete stamping</Link></li>
            <li><Link to="/services/terrazzo-flooring">Terrazzo flooring</Link></li>
            <li><Link to="/services/waterproofing">Waterproofing</Link></li>
            <li><Link to="/services/surface-preparation">Surface preparation</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h2>Get in touch</h2>
          <ul className="footer__contact">
            <li>
              <a href={CONTACT.phoneHref}><Phone size={16} aria-hidden="true" />{CONTACT.phone}</a>
            </li>
            <li>
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} aria-hidden="true" />WhatsApp us
              </a>
            </li>
            <li>
              <a href={CONTACT.emailHref}><Mail size={16} aria-hidden="true" />{CONTACT.email}</a>
            </li>
            <li>
              <a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer">
                <MapPin size={16} aria-hidden="true" />
                {CONTACT.addressLine1}, {CONTACT.addressLine2}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap footer__bottom">
        <p>© {year} Concrete Finisher Uganda. All rights reserved.</p>
        <Link to="/login" className="footer__staff">Staff login</Link>
      </div>
    </footer>
  );
}

export default Footer;
