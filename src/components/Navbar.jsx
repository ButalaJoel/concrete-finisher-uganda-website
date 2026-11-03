import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, Phone, X } from "lucide-react";

import logo from "../assets/logo.png";
import { CONTACT } from "../data/contact";

const NAV_ITEMS = [
  { label: "Home", to: "/", end: true },
  {
    label: "About",
    to: "/about",
    children: [
      { label: "Who we are", to: "/about" },
      { label: "Company overview", to: "/company#company" },
      { label: "How we work", to: "/company#process" },
      { label: "FAQs", to: "/company#faq" },
    ],
  },
  {
    label: "Services",
    to: "/services",
    children: [
      { label: "Epoxy flooring", to: "/services/epoxy-flooring" },
      { label: "Concrete polishing", to: "/services/concrete-polishing" },
      { label: "Concrete stamping", to: "/services/concrete-stamping" },
      { label: "Terrazzo flooring", to: "/services/terrazzo-flooring" },
      { label: "Waterproofing", to: "/services/waterproofing" },
      { label: "Surface preparation", to: "/services/surface-preparation" },
    ],
  },
  {
    label: "Projects",
    to: "/projects",
    children: [
      { label: "All projects", to: "/projects" },
      { label: "Epoxy flooring", to: "/projects?category=Epoxy Flooring" },
      { label: "Concrete polishing", to: "/projects?category=Concrete Polishing" },
      { label: "Waterproofing", to: "/projects?category=Waterproofing" },
      { label: "Decorative finishes", to: "/projects?category=Decorative Finishes" },
    ],
  },
  { label: "Contact", to: "/contact" },
];

function Navbar() {
  const location = useLocation();
  // The menu remembers which page it was opened on, so it closes itself
  // as soon as the visitor navigates somewhere else.
  const [openedOn, setOpenedOn] = useState(null);
  const menuOpen = openedOn === location.key;
  const setMenuOpen = (next) => {
    const open = typeof next === "function" ? next(menuOpen) : next;
    setOpenedOn(open ? location.key : null);
  };
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__logo" aria-label="Concrete Finisher Uganda, home">
          <img src={logo} alt="Concrete Finisher" width="900" height="261" />
        </Link>

        <nav className="nav__links" aria-label="Main navigation">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className={item.children ? "has-menu" : undefined}>
                <NavLink to={item.to} end={item.end} className="nav__link">
                  {item.label}
                  {item.children && <ChevronDown size={14} aria-hidden="true" />}
                </NavLink>

                {item.children && (
                  <ul className="nav__menu">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <Link to={child.to}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__actions">
          <a href={CONTACT.phoneHref} className="nav__phone">
            <Phone size={16} aria-hidden="true" />
            <span>{CONTACT.phone}</span>
          </a>
          <Link to="/contact#quote" className="btn btn--primary btn--sm">
            Get a quote
          </Link>
        </div>

        <button
          className="nav__toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="mnav" id="mobile-navigation" aria-label="Mobile navigation">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink to={item.to} end={item.end} className="mnav__link">
                  {item.label}
                </NavLink>
                {item.children && item.label !== "Projects" && (
                  <ul className="mnav__sub">
                    {item.children.slice(item.label === "About" ? 1 : 0).map((child) => (
                      <li key={child.to}>
                        <Link to={child.to}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mnav__actions">
            <Link to="/contact#quote" className="btn btn--primary btn--block">
              Get a quote
            </Link>
            <a href={CONTACT.phoneHref} className="btn btn--outline btn--block">
              Call {CONTACT.phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
