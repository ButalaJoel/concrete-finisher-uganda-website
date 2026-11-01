import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  ChevronDown,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

import { useState, useEffect } from "react";

import "../styles/Navbar.css";

function Navbar() {

  // ================= Add the UI state =================

  const [menuOpen, setMenuOpen] = useState(false);

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

        <Link to="/" className="logo-section" aria-label="Concrete Finisher home">
          <img src={logo} alt="Concrete Finisher" />
        </Link>

{/* ================= Adding the Hamburger Button ================= */}
        <button
  className="menu-toggle"
  type="button"
  aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
  aria-expanded={menuOpen}
  aria-controls="mobile-navigation"
  onClick={() => setMenuOpen(!menuOpen)}
>
  {menuOpen ? <X size={28} /> : <Menu size={28} />}
</button>


<nav>
    <ul className="nav-links">
        <li>
  <NavLink to="/" end>HOME</NavLink>
</li>

{/* ================= about us dropdown link ================= */}

<li className="dropdown">

  <div className="dropdown-title">

    <NavLink to="/about">
      ABOUT US
    </NavLink>

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

    <NavLink to="/services">
      SERVICES
    </NavLink>

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

        <NavLink to="/projects">
            PROJECTS
        </NavLink>

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
  <NavLink to="/contact">CONTACT US</NavLink>
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
  <nav className="mobile-menu" id="mobile-navigation" aria-label="Mobile navigation">

    <div className="mobile-menu-header">

    <img
        src={logo}
        alt="Concrete Finisher"
        className="mobile-logo"
    />

    <button
        className="mobile-close"
        type="button"
        aria-label="Close navigation menu"
        onClick={() => setMenuOpen(false)}
    >
        <X size={26} />
    </button>

</div>

  
    <NavLink to="/" end className={({ isActive }) => `mobile-nav-link${isActive ? " is-current" : ""}`} onClick={() => setMenuOpen(false)}>
      HOME
    </NavLink>

    <NavLink to="/about" className={({ isActive }) => `mobile-nav-link${isActive ? " is-current" : ""}`} onClick={() => setMenuOpen(false)}>
      ABOUT US
    </NavLink>

    <NavLink to="/services" className={({ isActive }) => `mobile-nav-link${isActive ? " is-current" : ""}`} onClick={() => setMenuOpen(false)}>
      SERVICES
    </NavLink>

    <NavLink to="/projects" className={({ isActive }) => `mobile-nav-link${isActive ? " is-current" : ""}`} onClick={() => setMenuOpen(false)}>
      PROJECTS
    </NavLink>

    <NavLink to="/contact" className={({ isActive }) => `mobile-nav-link${isActive ? " is-current" : ""}`} onClick={() => setMenuOpen(false)}>
      CONTACT US
    </NavLink>

    <Link
      to="/contact"
      className="mobile-quote-btn"
      onClick={() => setMenuOpen(false)}
    >
      GET A QUOTE
    </Link>

  </nav>
)}
      
    </>
  );
}

export default Navbar;