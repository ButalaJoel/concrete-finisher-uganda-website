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

<li>
  <Link to="/about">ABOUT US</Link>
  <ChevronDown size={13} strokeWidth={2} />
</li>

<li>
  <Link to="/services">SERVICES</Link>
  <ChevronDown size={13} strokeWidth={2} />
</li>

<li>
  <Link to="/projects">PROJECTS</Link>
  <ChevronDown size={13} strokeWidth={2} />
</li>

<li>
  <Link to="/contact">CONTACT US</Link>
</li>

 </ul>
  </nav>

        <div className="nav-right">
          <button className="quote-btn">
            GET A QUOTE
            <ArrowRight size={14} />
          </button>

          <div className="call-us">
            

            <div>
              <span>CALL US NOW</span>
              <strong>+256 780 662 557</strong>
              
            </div>
          </div>
        </div>
       
      </header>
      
    </>
  );
}

export default Navbar;