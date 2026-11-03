import "../styles/site.css";

import { useEffect, useState } from "react";

import {
  useParams,
  Link,
} from "react-router-dom";
import { RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchProjectBySlug } from "../utils/projectsApi";


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

  const [notFound, setNotFound] =
    useState(false);

  const [resolvedSlug, setResolvedSlug] = useState("");

  const [retryCount, setRetryCount] = useState(0);
  const isRequestLoading = loading || resolvedSlug !== slug;

  const retryProjectFetch = () => {
    setLoading(true);
    setError("");
    setNotFound(false);
    setProject(null);
    setResolvedSlug("");
    setRetryCount((count) => count + 1);
  };


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
    const controller = new AbortController();

    const fetchProject = async () => {

      try {

        setLoading(true);

        setError("");
        setNotFound(false);
        setProject(null);
        setResolvedSlug("");

        if (!slug) {
          throw new Error("Unable to load this project.");
        }

        const result = await fetchProjectBySlug({
          apiUrl: API_URL,
          slug,
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        if (result.notFound) {
          setNotFound(true);
          setResolvedSlug(slug);
          return;
        }

        setProject(result.data);
        setResolvedSlug(slug);


      } catch (fetchError) {

        if (controller.signal.aborted) {
          return;
        }

        console.error(
          "Project detail error:",
          fetchError
        );

        setError("Unable to load this project. Please try again.");
        setResolvedSlug(slug);

      } finally {

        if (!controller.signal.aborted) {
          setLoading(false);
        }

      }

    };


    fetchProject();

    return () => controller.abort();

  }, [slug, retryCount]);


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

  if (isRequestLoading) {

    return (
      <>
        <div className="site"><Navbar />
        <main className="project-detail-page project-detail-loading" role="status" aria-label="Loading project" aria-busy="true">
          <div className="project-detail-skeleton-hero" aria-hidden="true">
            <div className="project-detail-skeleton-content">
              <span className="project-detail-skeleton-line project-detail-skeleton-label" />
              <span className="project-detail-skeleton-line project-detail-skeleton-title" />
              <span className="project-detail-skeleton-line project-detail-skeleton-copy" />
            </div>
          </div>
          <div className="project-detail-container project-detail-skeleton-info" aria-hidden="true">
            <span className="project-detail-skeleton-line project-detail-skeleton-section-title" />
            <span className="project-detail-skeleton-line project-detail-skeleton-copy" />
          </div>
        </main>
        <Footer /></div>
      </>
    );

  }


  // ======================================================
  // ERROR
  // ======================================================

  if (notFound) {

    return (
      <>
        <div className="site"><Navbar />
        <main className="project-detail-page project-detail-not-found">
          <div className="project-detail-not-found-content">
            <p className="project-detail-not-found-code">404</p>
            <h1>This project is currently unavailable.</h1>
            <p>The project may have been removed or its link may have changed.</p>
            <div className="project-detail-not-found-actions">
              <Link to="/projects">Back to Projects</Link>
              <Link to="/services">Explore Services</Link>
            </div>
          </div>
        </main>
        <Footer /></div>
      </>
    );

  }

  if (error || !project) {
    return (
      <>
        <div className="site"><Navbar />
        <main className="project-detail-page project-detail-load-error">
          <div className="project-detail-container" role="alert">
            <h2>{error || "Unable to load this project."}</h2>
            <button type="button" onClick={retryProjectFetch}>
              <RefreshCw size={17} aria-hidden="true" />
              Retry
            </button>
            <Link to="/projects">Back to Projects</Link>
          </div>
        </main>
        <Footer /></div>
      </>
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

    <>
    <div className="site"><Navbar />
    <main className="project-detail-page">


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
          <Link to="/projects" className="project-detail-back">Back to all projects</Link>

          <div className="project-detail-overlay">

            <div className="project-detail-content">

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

          <h2>
            About this project
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

          <h2>
            Project details
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

          <h2>
            Challenge and solution
          </h2>

          <div className="project-detail-approach-grid">

            <div className="project-detail-approach-card">

              <h3>
                The challenge
              </h3>

              <p>
                {project.challenge}
              </p>

            </div>

            <div className="project-detail-approach-card">

              <h3>
                Our solution
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

              <h2>
                System used
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

          <h2>
            Before and after
          </h2>


          {/* ================= BEFORE ================= */}

          {project.beforeImages &&
            project.beforeImages.length > 0 && (

              <div className="gallery-group">

                <h3 className="gallery-title">
                  Before
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
                  After
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

            <h2>
              More projects
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
                View all projects
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

          <h2>
            Need a floor like this?
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
            Request a site inspection
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
              type="button"
              aria-label="Close image"
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

    </main>
    <Footer /></div>
    </>

  );

}


export default ProjectDetail;