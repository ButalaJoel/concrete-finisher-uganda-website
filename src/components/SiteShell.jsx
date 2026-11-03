import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/site.css";

// Wraps every public page with the navigation, footer and site styles.
function SiteShell({ children, className = "" }) {
  return (
    <div className={`site ${className}`.trim()}>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}

export default SiteShell;
