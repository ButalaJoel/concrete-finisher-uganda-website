import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, FolderOpen, RefreshCw } from "lucide-react";
import projectsHeroImage from "../assets/projects/darling-namanve/after-3.jpg";
import { fetchProjectsPage } from "../utils/projectsApi";
import SiteShell from "../components/SiteShell";
import PageHero from "../components/PageHero";
import CtaBand from "../components/CtaBand";

const API_URL = import.meta.env.VITE_API_URL;

function Projects() {

  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category");
  const activeFilter = category || "All Projects";


  // ======================================================
  // PROJECTS
  // ======================================================

  const [projects, setProjects] = useState([]);


  // ======================================================
  // LOADING
  // ======================================================

  const [loading, setLoading] = useState(true);


  // ======================================================
  // ERROR
  // ======================================================

  const [error, setError] = useState("");

  const [retryCount, setRetryCount] = useState(0);

  // ======================================================
  // PAGINATION
  // ======================================================

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);


  // ======================================================
  // PROJECTS PER PAGE
  //
  // Desktop:
  // 3 projects per page
  // ======================================================

  const projectsPerPage = 3;

  const requestKey = `${currentPage}:${activeFilter}:${retryCount}`;
  const [completedRequestKey, setCompletedRequestKey] = useState("");
  const isRequestLoading = loading || completedRequestKey !== requestKey;


  // ======================================================
  // FETCH PROJECTS FROM API
  // ======================================================

  useEffect(() => {

    const controller = new AbortController();

    const fetchProjects = async () => {

      try {

        setLoading(true);

        setError("");
        setProjects([]);


        // ==================================================
        // BUILD API URL
        // ==================================================

        const result = await fetchProjectsPage({
          apiUrl: API_URL,
          page: currentPage,
          limit: projectsPerPage,
          category: activeFilter,
          signal: controller.signal,
        });

        // ==================================================
        // STORE PROJECTS
        // ==================================================

        setProjects(
          result.data || []
        );


        // ==================================================
        // STORE PAGINATION INFORMATION
        // ==================================================

        setTotalPages(
          result.pagination?.totalPages || 1
        );


      } catch (fetchError) {

        if (controller.signal.aborted) {
          return;
        }

        console.error(
          "Projects fetch error:",
          fetchError
        );


        setProjects([]);
        setError("Unable to load projects. Please try again.");


      } finally {

        if (!controller.signal.aborted) {
          setLoading(false);
          setCompletedRequestKey(requestKey);
        }

      }

    };


    fetchProjects();

    return () => controller.abort();

  }, [currentPage, activeFilter, retryCount, requestKey]);


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
  // CHANGE PAGE
  // ======================================================

  const handlePageChange = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {

      return;

    }


    setCurrentPage(page);


    // Scroll back to the projects grid
    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };


  return (
    <SiteShell>
      <PageHero
        image={projectsHeroImage}
        crumb={[{ label: "Projects" }]}
        title="Projects built to perform"
        intro="Floors we've prepared and finished for factories, businesses and homes. Open a project to see it before and after."
      />

      <section className="section projects-page-gallery">
        <div className="wrap">


        {/* ==================================================
            PROJECT FILTERS
        ================================================== */}

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
              className={
                activeFilter === filter
                  ? "active"
                  : ""
              }
              onClick={() => {
                const nextSearchParams = new URLSearchParams(searchParams);
                if (filter === "All Projects") {
                  nextSearchParams.delete("category");
                } else {
                  nextSearchParams.set("category", filter);
                }
                setSearchParams(nextSearchParams);
                setCurrentPage(1);
              }}
            >
              {filter}
            </button>

          ))}

        </div>


        {/* ==================================================
            LOADING STATE
        ================================================== */}

        {isRequestLoading && (
          <div
            className="projects-page-grid projects-skeleton-grid"
            role="status"
            aria-label="Loading projects"
            aria-busy="true"
          >
            {Array.from({ length: projectsPerPage }, (_, index) => (
              <div className="projects-page-card project-skeleton-card" key={index} aria-hidden="true">
                <div className="projects-page-image project-skeleton-image" />
                <div className="projects-page-card-content project-skeleton-content">
                  <span className="project-skeleton-line project-skeleton-service" />
                  <span className="project-skeleton-line project-skeleton-title" />
                  <span className="project-skeleton-line project-skeleton-location" />
                </div>
              </div>
            ))}
          </div>
        )}


        {/* ==================================================
            ERROR STATE
        ================================================== */}

        {!isRequestLoading && error && (
          <div className="projects-state projects-error-state" role="alert">
            <AlertCircle size={34} aria-hidden="true" />
            <h2>We couldn&apos;t load our projects.</h2>
            <p>{error}</p>
            <button type="button" onClick={() => setRetryCount((count) => count + 1)}>
              <RefreshCw size={17} aria-hidden="true" />
              Retry
            </button>
          </div>
        )}


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!isRequestLoading &&
          !error &&
          projects.length === 0 && (

            <div className="projects-state projects-empty-state">
              <FolderOpen size={38} aria-hidden="true" />
              <h2>
                {activeFilter === "All Projects"
                  ? "Our projects are coming soon."
                  : "No projects found for this category."}
              </h2>
              <p>
                {activeFilter === "All Projects"
                  ? "We're updating our portfolio with recent concrete finishing projects. Please check back soon."
                  : "Try another project category, or explore our services and contact us about your project."}
              </p>
              <div className="projects-state-actions">
                <Link to="/services">Explore Services</Link>
                <Link to="/contact">Contact Us</Link>
              </div>
            </div>

          )}


        {/* ==================================================
            PROJECT GRID
        ================================================== */}

        {!isRequestLoading &&
          !error &&
          projects.length > 0 && (

            <div className="projects-page-grid">

              {projects.map((project) => (

                <Link
                  to={`/projects/${project.slug}`}
                  className="projects-page-card"
                  key={project._id}
                >

                  {/* ========================================
                      PROJECT IMAGE
                  ======================================== */}

                  {project.heroImage ? (

                    <img
                      src={getImageUrl(
                        project.heroImage
                      )}
                      alt={project.title}
                      className="projects-page-image"
                      loading="lazy"
                    />

                  ) : (

                    <div className="projects-page-image-placeholder">
                    </div>

                  )}


                  {/* ========================================
                      PROJECT INFORMATION
                  ======================================== */}

                  <div className="projects-page-card-content">

                    <p>
                      {project.service}
                    </p>

                    <h3>
                      {project.title}
                    </h3>

                    <span>
                      {project.location}
                    </span>

                  </div>

                </Link>

              ))}

            </div>

          )}


        {/* ==================================================
            PAGINATION
        ================================================== */}

        {!isRequestLoading &&
          !error &&
          totalPages > 1 && (

            <div className="projects-pagination">


              {/* ==========================================
                  PREVIOUS BUTTON
              ========================================== */}

              <button
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
                disabled={
                  currentPage === 1
                }
              >
                Previous
              </button>


              {/* ==========================================
                  PAGE NUMBERS
              ========================================== */}

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (

                <button
                  key={page}
                  onClick={() =>
                    handlePageChange(page)
                  }
                  className={
                    currentPage === page
                      ? "active"
                      : ""
                  }
                >
                  {page}
                </button>

              ))}


              {/* ==========================================
                  NEXT BUTTON
              ========================================== */}

              <button
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }
                disabled={
                  currentPage === totalPages
                }
              >
                Next
              </button>

            </div>

          )}

        </div>
      </section>


      <CtaBand />
    </SiteShell>
  );
}

export default Projects;
