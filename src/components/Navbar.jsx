import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  ChevronDown,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

import { useState, useEffect } from "react";

function Navbar() {

  // ================= Add the UI state =================

  const [menuOpen, setMenuOpen] = useState(false);

  console.log(menuOpen);

  useEffect(() => {

  if (menuOpen) {

    document.body.style.overflow = "hidden";

  } else {

    document.body.style.overflow = "auto";

  }

  return () => {

    document.body.style.overflow = "auto";

  };

}, [menuOpen]);

  return (
    <>
    
      <header className="navbar">

        <div className="logo-section">
          <img src={logo} alt="Concrete Finisher" />
        </div>

{/* ================= Adding the Hamburger Button ================= */}
        <button
  className="menu-toggle"
  onClick={() => setMenuOpen(!menuOpen)}
>
  {menuOpen ? <X size={28} /> : <Menu size={28} />}
</button>


<nav>
    <ul className="nav-links">
        <li className="active">
  <Link to="/">HOME</Link>
</li>

{/* ================= about us dropdown link ================= */}

<li className="dropdown">

  <div className="dropdown-title">

    <Link to="/about">
      ABOUT US
    </Link>

    <ChevronDown size={13} strokeWidth={2} />

  </div>

  <ul className="dropdown-menu">

    <li>
      <Link to="/company#company">
        About Company
      </Link>
    </li>

    <li>
      <Link to="/company#process">
        Our Process
      </Link>
    </li>

    <li>
      <Link to="/company#faq">
        FAQs
      </Link>
    </li>

  </ul>

</li>


<li className="dropdown">

  <div className="dropdown-title">

    <Link to="/services">
      SERVICES
    </Link>

    <ChevronDown size={13} strokeWidth={2} />

  </div>

  <ul className="dropdown-menu">

    <li>
      <Link to="/services#services">
        All Services
      </Link>
    </li>

    <li>
      <Link to="/services#benefits">
        Why Choose Us
      </Link>
    </li>

    <li>
      <Link to="/services#process">
        Our Process
      </Link>
    </li>

    <li>
      <Link to="/services#industries">
        Industries We Serve
      </Link>
    </li>

    <li>
      <Link to="/services#faq">
        FAQs
      </Link>
    </li>

  </ul>

</li>

<li className="dropdown">

    <div className="dropdown-title">

        <Link to="/projects">
            PROJECTS
        </Link>

        <ChevronDown
            size={13}
            strokeWidth={2}
        />

    </div>

    <ul className="dropdown-menu">

        <li>
            <Link to="/projects">
                All Projects
            </Link>
        </li>

        <li>
            <Link to="/projects?category=Epoxy Flooring">
                Epoxy Flooring
            </Link>
        </li>

        <li>
            <Link to="/projects?category=Concrete Polishing">
                Concrete Polishing
            </Link>
        </li>

        <li>
            <Link to="/projects?category=Waterproofing">
                Waterproofing
            </Link>
        </li>

        <li>
            <Link to="/projects?category=Decorative Finishes">
                Decorative Finishes
            </Link>
        </li>

    </ul>

</li>
<li>
  <Link to="/contact">CONTACT US</Link>
</li>

 </ul>
  </nav>

        <div className="nav-right">
          <Link to="/contact" className="quote-btn">
            GET A QUOTE
          <ArrowRight size={14} />
        </Link>

          <div className="call-us">
            

            <div>
              <span>CALL US NOW</span>
              <a href="tel:+256780662557" className="phone-link">
               +256 780 662 557
              </a>
              
            </div>
          </div>
        </div>
       
      </header>

      {menuOpen && (
  <div className="mobile-menu">

    <div className="mobile-menu-header">

    <img
        src={logo}
        alt="Concrete Finisher"
        className="mobile-logo"
    />

    <button
        className="mobile-close"
        onClick={() => setMenuOpen(false)}
    >
        <X size={26} />
    </button>

</div>

  
    <Link to="/" onClick={() => setMenuOpen(false)}>
      HOME
    </Link>

    <Link to="/about" onClick={() => setMenuOpen(false)}>
      ABOUT US
    </Link>

    <Link to="/services" onClick={() => setMenuOpen(false)}>
      SERVICES
    </Link>

    <Link to="/projects" onClick={() => setMenuOpen(false)}>
      PROJECTS
    </Link>

    <Link to="/contact" onClick={() => setMenuOpen(false)}>
      CONTACT US
    </Link>

    <Link
      to="/contact"
      className="mobile-quote-btn"
      onClick={() => setMenuOpen(false)}
    >
      GET A QUOTE
    </Link>

  </div>
)}
      
    </>
  );
}

export default Navbar;