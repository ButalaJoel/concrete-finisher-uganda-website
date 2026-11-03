import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Inner-page header: photo background, breadcrumb, title and intro.
function PageHero({ image, crumb, title, intro, children }) {
  return (
    <section
      className="page-hero"
      style={image ? { "--hero-image": `url(${image})` } : undefined}
    >
      <div className="wrap page-hero__inner">
        {crumb && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            {crumb.map((c) => (
              <span key={c.label}>
                <ChevronRight size={14} aria-hidden="true" />
                {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <h1>{title}</h1>
        {intro && <p className="page-hero__intro">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export default PageHero;
