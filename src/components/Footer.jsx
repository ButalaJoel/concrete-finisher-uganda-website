// Footer.jsx

import logo from "../assets/logo.png";

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
        <li>Home</li>
        <li>About Us</li>
        <li>Services</li>
        <li>Projects</li>
        <li>Contact Us</li>
      </ul>

    </div>

    <div className="footer-column">

      <h3>OUR SERVICES</h3>

      <ul>
        <li>Epoxy Flooring</li>
        <li>Concrete Polishing</li>
        <li>Concrete Stamping</li>
        <li>Terrazzo Flooring</li>
        <li>Waterproofing</li>
      </ul>

    </div>

    <div className="footer-column">

      <h3>CONTACT INFO</h3>

      <ul>
        <li>+256 780 662 557</li>
        <li>info@concretefinisherug.com</li>
        <li>Kampala, Uganda</li>
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