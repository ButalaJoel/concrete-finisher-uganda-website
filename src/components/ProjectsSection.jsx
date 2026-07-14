// ProjectsSection.jsx

import { Link } from "react-router-dom";

import drivewayImg from "../assets/projects/driveway-stamping.jpg";
import warehouseImg from "../assets/projects/warehouse-epoxy.jpg";
import commercialImg from "../assets/projects/commercial-polishing.jpg";
import grindingProjectImg from "../assets/projects/industrial-grinding.jpg";

import { ArrowRight } from "lucide-react";

function ProjectsSection() {
  return (
    <>
      <section className="projects-strip">

  <div className="projects-left">

    <p className="projects-subtitle">
      OUR PROJECTS
    </p>

    <h2>
      Building With Quality,
      <br />
      Finishing With Pride
    </h2>

    <Link
  to="/projects"
  className="projects-btn"
>
  VIEW ALL PROJECTS
  <ArrowRight size={14} />
</Link>

  </div>

  <div className="projects-gallery">

    <Link
  to="/projects/commercial-floor-coating"
  className="project-item"
>
      <img src={warehouseImg} alt="" />
      <div className="project-overlay">
        <h4>INDUSTRIAL WAREHOUSE</h4>
        <p>EPOXY FLOORING</p>
      </div>
    </Link>

    <Link
  to="/projects/modern-polished-floor"
  className="project-item"
>
      <img src={commercialImg} alt="" />
      <div className="project-overlay">
        <h4>COMMERCIAL BUILDING</h4>
        <p>POLISHED CONCRETE</p>
      </div>
    </Link>

    <Link
  to="/projects/decorative-outdoor-finish"
  className="project-item"
>
      <img src={drivewayImg} alt="" />
      <div className="project-overlay">
        <h4>RESIDENTIAL DRIVEWAY</h4>
        <p>CONCRETE STAMPING</p>
      </div>
   </Link>

    <Link
  to="/projects/concrete-grinding-and-repair"
  className="project-item"
>
      <img src={grindingProjectImg} alt="" />
      <div className="project-overlay">
        <h4>INDUSTRIAL FACILITY</h4>
        <p>CONCRETE GRINDING</p>
      </div>
    </Link>

  </div>

</section>

    </>
  );
}

export default ProjectsSection;