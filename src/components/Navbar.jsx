import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { ChevronDown, ArrowRight } from "lucide-react";

function Navbar() {
  return (
    <>
    
      <header className="navbar">
        <div className="logo-section">
          <img src={logo} alt="Concrete Finisher" />
        </div>


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
      
    </>
  );
}

export default Navbar;