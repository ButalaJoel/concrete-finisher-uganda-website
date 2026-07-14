// Footer.jsx

import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer className="footer">

  <div className="footer-top">

    <div className="footer-column footer-brand">

      <img
        src={logo}
        alt="Concrete Finisher"
        className="footer-logo"
      />

      <p>
        Professional concrete finishing specialists
        delivering epoxy flooring, concrete polishing,
        stamping, terrazzo and waterproofing solutions
        across Uganda.
      </p>

    </div>

    <div className="footer-column">

      <h3>QUICK LINKS</h3>

      <ul>

  <li>
    <Link to="/">Home</Link>
  </li>

  <li>
    <Link to="/about">About Us</Link>
  </li>

  <li>
    <Link to="/services">Services</Link>
  </li>

  <li>
    <Link to="/projects">Projects</Link>
  </li>

  <li>
    <Link to="/contact">Contact Us</Link>
  </li>

</ul>
    </div>

    <div className="footer-column">

      <h3>OUR SERVICES</h3>

      <ul>

  <li>
    <Link to="/services/epoxy-flooring">
      Epoxy Flooring
    </Link>
  </li>

  <li>
    <Link to="/services/concrete-polishing">
      Concrete Polishing
    </Link>
  </li>

  <li>
    <Link to="/services/concrete-stamping">
      Concrete Stamping
    </Link>
  </li>

  <li>
    <Link to="/services/terrazzo-flooring">
      Terrazzo Flooring
    </Link>
  </li>

  <li>
    <Link to="/services/waterproofing">
      Waterproofing
    </Link>
  </li>

</ul>
    </div>

    <div className="footer-column">

      <h3>CONTACT INFO</h3>

      <ul>

  <li>
    <a href="tel:+256780662557">
      +256 780 662 557
    </a>
  </li>

  <li>
    <a href="mailto:info@concretefinisherug.com">
      info@concretefinisherug.com
    </a>
  </li>

  <li>
    <a
      href="https://maps.google.com/?q=Concrete+Finisher+Uganda+Kampala"
      target="_blank"
      rel="noopener noreferrer"
    >
      Kampala, Uganda
    </a>
  </li>

</ul>

    </div>

  </div>

  <div className="footer-bottom">

    <p>
      © 2026 Concrete Finisher Uganda.
      All Rights Reserved.
    </p>

  </div>

</footer>

    </>
  );
}

export default Footer;