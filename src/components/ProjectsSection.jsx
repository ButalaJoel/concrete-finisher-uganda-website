import { Link } from "react-router-dom";

import warehouseImg from "../assets/projects/warehouse-epoxy.jpg";
import commercialImg from "../assets/projects/commercial-polishing.jpg";
import drivewayImg from "../assets/projects/driveway-stamping.jpg";
import grindingProjectImg from "../assets/projects/industrial-grinding.jpg";

const FEATURED = [
  {
    to: "/projects/commercial-floor-coating",
    image: warehouseImg,
    title: "Industrial warehouse",
    service: "Epoxy flooring",
  },
  {
    to: "/projects/modern-polished-floor",
    image: commercialImg,
    title: "Commercial building",
    service: "Polished concrete",
  },
  {
    to: "/projects/decorative-outdoor-finish",
    image: drivewayImg,
    title: "Residential driveway",
    service: "Concrete stamping",
  },
  {
    to: "/projects/concrete-grinding-and-repair",
    image: grindingProjectImg,
    title: "Industrial facility",
    service: "Concrete grinding",
  },
];

function ProjectsSection() {
  return (
    <section className="section section--dark">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2">Recent work</h2>
          <p className="lede">
            Warehouses, factories, showrooms and homes. Each project page shows the
            floor before and after, and the system we used.
          </p>
          <Link to="/projects" className="link-arrow section-head__link">All projects</Link>
        </div>

        <ul className="work-grid">
          {FEATURED.map((project, index) => (
            <li key={project.to} className={index === 0 ? "work-grid__lead" : undefined}>
              <Link to={project.to} className="work-card">
                <img src={project.image} alt="" loading="lazy" />
                <div className="work-card__caption">
                  <span>{project.service}</span>
                  <h3>{project.title}</h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ProjectsSection;
