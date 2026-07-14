import { useState } from "react";
import { projectsData } from "../data/projectsData";

import { Link, useSearchParams } from "react-router-dom";

import { useEffect } from "react";



function Projects() {

  const [searchParams] = useSearchParams();

  const category =
    searchParams.get("category");

  const [activeFilter, setActiveFilter] =
    useState(category || "All Projects");

    useEffect(() => {
  setActiveFilter(category || "All Projects");
}, [category]);

  const filteredProjects =
    activeFilter === "All Projects"
      ? projectsData
      : projectsData.filter(
          (project) => project.category === activeFilter
        );

  return (
    <>
      {/* HERO SECTION */}
      <section className="projects-page-hero">
        <div className="projects-page-hero-overlay">
          <div className="projects-page-hero-content">
            <p className="section-label">OUR WORK</p>

            <h1>Projects Built to Perform</h1>

            <p>
              Explore flooring, concrete finishing and waterproofing projects
              completed for residential, commercial and industrial spaces.
            </p>
          </div>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="projects-page-intro">
        <p className="section-label">OUR PROJECTS</p>

        <h2>Quality Finishes. Lasting Results.</h2>

        <p>
          Every project is approached with the right preparation, materials and
          application process to deliver durable, professional results.
        </p>
      </section>

      {/* PROJECT FILTERS */}

      <section className="projects-page-gallery">
        <div className="projects-page-filter">
  {[
    "All Projects",
    "Epoxy Flooring",
    "Concrete Polishing",
    "Waterproofing",
    "Decorative Finishes",
  ].map((filter) => (
    <button
      key={filter}
      className={activeFilter === filter ? "active" : ""}
      onClick={() => setActiveFilter(filter)}
    >
      {filter}
    </button>
  ))}
</div>

       {/* PROJECT GRID */}

<div className="projects-page-grid">

  {filteredProjects.map((project) => (

    <Link
  to={`/projects/${project.slug}`}
  className="projects-page-card"
  key={project.id}
>

      {project.image ? (

        <img
          src={project.image}
          alt={project.title}
          className="projects-page-image"
        />

      ) : (

        <div className="projects-page-image-placeholder"></div>

      )}

      <div className="projects-page-card-content">

        <p>{project.service}</p>

        <h3>{project.title}</h3>

        <span>{project.location}</span>

      </div>

    </Link>

  ))}

</div>
      </section>

      {/* CTA SECTION */}
      <section className="projects-page-cta">
        <p className="section-label">START YOUR PROJECT</p>

        <h2>Have a Floor or Surface That Needs Finishing?</h2>

        <p>
          Tell us about your project and our team will recommend the right
          solution for your space.
        </p>

        <Link to="/contact" className="projects-page-cta-button">
          Request a Site Inspection
        </Link>
      </section>
    </>
  );
}

export default Projects;