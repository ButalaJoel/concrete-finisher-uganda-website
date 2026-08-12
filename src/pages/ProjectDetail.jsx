import "../styles/ProjectDetail.css";

import { useEffect, useState } from "react";

import {
  useParams,
  Link,
} from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL;


function ProjectDetail() {

  const { slug } = useParams();

  const [project, setProject] = useState(null);

  const [relatedProjects, setRelatedProjects] =
    useState([]);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ======================================================
  // IMAGE URL HELPER
  // ======================================================

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_URL}${image}`;

  };


  // ======================================================
  // FETCH PROJECT
  // ======================================================

  useEffect(() => {

    const fetchProject = async () => {

      try {

        setLoading(true);

        setError("");

        const response = await fetch(
          `${API_URL}/api/projects/${encodeURIComponent(slug)}`
        );

        if (!response.ok) {

          if (response.status === 404) {

            throw new Error(
              "Project not found."
            );

          }

          throw new Error(
            "Unable to load project."
          );

        }

        const result = await response.json();

        setProject(result.data);


      } catch (error) {

        console.error(
          "Project detail error:",
          error
        );

        setError(
          error.message ||
          "Unable to load project."
        );

      } finally {

        setLoading(false);

      }

    };


    if (slug) {
      fetchProject();
    }

  }, [slug]);


  // ======================================================
  // FETCH RELATED PROJECTS
  // ======================================================

  useEffect(() => {

    const fetchRelatedProjects = async () => {

      try {

        const response = await fetch(
          `${API_URL}/api/projects`
        );

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        setRelatedProjects(
          result.data || []
        );

      } catch (error) {

        console.error(
          "Related projects error:",
          error
        );

      }

    };

    fetchRelatedProjects();

  }, []);


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (
      <div className="project-detail-page">

        <div className="project-detail-container">

          <h2>
            Loading project...
          </h2>

        </div>

      </div>
    );

  }


  // ======================================================
  // ERROR
  // ======================================================

  if (error || !project) {

    return (
      <div className="project-detail-page">

        <div className="project-detail-container">

          <h2>
            {error || "Project not found."}
          </h2>

          <Link to="/projects">
            Back to Projects
          </Link>

        </div>

      </div>
    );

  }


  // ======================================================
  // RELATED PROJECTS
  // ======================================================

  const filteredRelatedProjects =
    relatedProjects
      .filter(
        (item) => item._id !== project._id
      )
      .slice(0, 3);


  return (

    <div className="project-detail-page">


      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="project-detail-hero"
        style={{
          backgroundImage: `url(${getImageUrl(
            project.heroImage ||
            project.image
          )})`,
        }}
      >

        <div className="project-detail-container">

          <div className="project-detail-overlay">

            <div className="project-detail-content">

              <p className="section-label">
                PROJECT
              </p>

              <h1>
                {project.title}
              </h1>

              <p>
                {project.shortDescription}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          OVERVIEW
      ================================================== */}

      <section className="project-detail-section project-detail-overview">

        <div className="project-detail-container">

          <p className="section-label">
            PROJECT OVERVIEW
          </p>

          <h2>
            About This Project
          </h2>

          <p>
            {project.overview}
          </p>

        </div>

      </section>


      {/* ==================================================
          PROJECT INFORMATION
      ================================================== */}

      <section className="project-detail-section project-detail-info">

        <div className="project-detail-container">

          <p className="section-label">
            PROJECT INFORMATION
          </p>

          <h2>
            Project Details
          </h2>

          <div className="project-info-grid">

            <div className="project-info-card">
              <span>Client</span>
              <h3>{project.client}</h3>
            </div>

            <div className="project-info-card">
              <span>Location</span>
              <h3>{project.location}</h3>
            </div>

            <div className="project-info-card">
              <span>Industry</span>
              <h3>{project.industry}</h3>
            </div>

            <div className="project-info-card">
              <span>Area</span>
              <h3>{project.surfaceArea}</h3>
            </div>

            <div className="project-info-card">
              <span>Duration</span>
              <h3>{project.completionTime}</h3>
            </div>

            <div className="project-info-card">
              <span>System</span>
              <h3>{project.system}</h3>
            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          CHALLENGE & SOLUTION
      ================================================== */}

      <section className="project-detail-section project-detail-approach">

        <div className="project-detail-container">

          <p className="section-label">
            PROJECT APPROACH
          </p>

          <h2>
            Challenge & Solution
          </h2>

          <div className="project-detail-approach-grid">

            <div className="project-detail-approach-card">

              <h3>
                The Challenge
              </h3>

              <p>
                {project.challenge}
              </p>

            </div>

            <div className="project-detail-approach-card">

              <h3>
                Our Solution
              </h3>

              <p>
                {project.solution}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          PRODUCTS
      ================================================== */}

      {project.products &&
        project.products.length > 0 && (

          <section className="project-detail-section project-detail-products">

            <div className="project-detail-container">

              <p className="section-label">
                PRODUCTS USED
              </p>

              <h2>
                System Used
              </h2>

              <div className="project-detail-products-grid">

                {project.products.map(
                  (product, index) => (

                    <div
                      key={index}
                      className="project-detail-product-card"
                    >

                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        {product.purpose}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          </section>

        )}


      {/* ==================================================
          GALLERY
      ================================================== */}

      <section className="project-detail-section project-detail-gallery">

        <div className="project-detail-container">

          <p className="section-label">
            PROJECT GALLERY
          </p>

          <h2>
            Before & After Installation
          </h2>


          {/* ================= BEFORE ================= */}

          {project.beforeImages &&
            project.beforeImages.length > 0 && (

              <div className="gallery-group">

                <h3 className="gallery-title">
                  Before Installation
                </h3>

                <div className="project-gallery-grid">

                  {project.beforeImages.map(
                    (image, index) => (

                      <div
                        key={index}
                        className="project-gallery-card"
                      >

                        <img
                          src={getImageUrl(image)}
                          alt={`Before ${index + 1}`}
                          className="project-gallery-image"
                          loading="lazy"
                          onClick={() =>
                            setSelectedImage(
                              getImageUrl(image)
                            )
                          }
                        />

                      </div>

                    )
                  )}

                </div>

              </div>

            )}


          {/* ================= AFTER ================= */}

          {project.afterImages &&
            project.afterImages.length > 0 && (

              <div className="gallery-group">

                <h3 className="gallery-title">
                  After Installation
                </h3>

                <div className="project-gallery-grid">

                  {project.afterImages.map(
                    (image, index) => (

                      <div
                        key={index}
                        className="project-gallery-card"
                      >

                        <img
                          src={getImageUrl(image)}
                          alt={`After ${index + 1}`}
                          className="project-gallery-image"
                          loading="lazy"
                          onClick={() =>
                            setSelectedImage(
                              getImageUrl(image)
                            )
                          }
                        />

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

        </div>

      </section>


      {/* ==================================================
          RELATED PROJECTS
      ================================================== */}

      {filteredRelatedProjects.length > 0 && (

        <section className="project-detail-section project-detail-related">

          <div className="project-detail-container">

            <p className="section-label">
              RELATED PROJECTS
            </p>

            <h2>
              More Projects
            </h2>

            <div className="project-detail-related-grid">

              {filteredRelatedProjects.map(
                (item) => (

                  <Link
                    key={item._id}
                    to={`/projects/${item.slug}`}
                    className="project-detail-related-card"
                  >

                    <div className="project-detail-related-image">

                      {item.heroImage ? (

                        <img
                          src={getImageUrl(
                            item.heroImage
                          )}
                          alt={item.title}
                          loading="lazy"
                        />

                      ) : (

                        <div className="project-detail-related-placeholder">
                        </div>

                      )}

                    </div>

                    <div className="project-detail-related-content">

                      <p>
                        {item.category}
                      </p>

                      <h3>
                        {item.title}
                      </h3>

                      <span>
                        {item.location}
                      </span>

                    </div>

                  </Link>

                )
              )}

            </div>

            <div className="project-detail-related-button-wrapper">

              <Link
                to="/projects"
                className="project-detail-button"
              >
                View All Projects
              </Link>

            </div>

          </div>

        </section>

      )}


      {/* ==================================================
          CTA
      ================================================== */}

      <section className="project-detail-section project-detail-cta">

        <div className="project-detail-container">

          <p className="section-label">
            START YOUR PROJECT
          </p>

          <h2>
            Need Professional Concrete Finishing?
          </h2>

          <p>
            Tell us about your project and our specialists
            will recommend the right flooring system for
            your space.
          </p>

          <Link
            to="/contact"
            className="project-detail-button"
          >
            Request A Site Inspection
          </Link>

        </div>

      </section>


      {/* ==================================================
          LIGHTBOX
      ================================================== */}

      {selectedImage && (

        <div
          className="project-lightbox"
          onClick={() =>
            setSelectedImage(null)
          }
        >

          <div
            className="project-lightbox-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="project-lightbox-close"
              onClick={() =>
                setSelectedImage(null)
              }
            >
              &times;
            </button>

            <img
              src={selectedImage}
              alt="Project"
              className="project-lightbox-image"
            />

          </div>

        </div>

      )}

    </div>

  );

}


export default ProjectDetail;