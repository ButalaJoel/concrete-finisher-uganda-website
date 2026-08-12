import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Projects() {

  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");


  // ======================================================
  // ACTIVE FILTER
  // ======================================================

  const [activeFilter, setActiveFilter] = useState(
    category || "All Projects"
  );


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


  // ======================================================
  // UPDATE FILTER FROM URL
  // ======================================================

  useEffect(() => {

    setActiveFilter(
      category || "All Projects"
    );

    // Reset pagination when category changes
    setCurrentPage(1);

  }, [category]);


  // ======================================================
  // FETCH PROJECTS FROM API
  // ======================================================

  useEffect(() => {

    const fetchProjects = async () => {

      try {

        setLoading(true);

        setError("");


        // ==================================================
        // BUILD API URL
        // ==================================================

        let url =
          `${API_URL}/api/projects?page=${currentPage}&limit=${projectsPerPage}`;


        // ==================================================
        // ADD CATEGORY FILTER
        // ==================================================

        if (
          activeFilter &&
          activeFilter !== "All Projects"
        ) {

          url +=
            `&category=${encodeURIComponent(
              activeFilter
            )}`;

        }


        // ==================================================
        // FETCH PROJECTS
        // ==================================================

        const response = await fetch(url);


        if (!response.ok) {

          throw new Error(
            "Failed to load projects."
          );

        }


        // ==================================================
        // CONVERT RESPONSE TO JSON
        // ==================================================

        const result =
          await response.json();


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


      } catch (error) {

        console.error(
          "Projects fetch error:",
          error
        );


        setError(
          "Unable to load projects. Please try again."
        );


      } finally {

        setLoading(false);

      }

    };


    fetchProjects();

  }, [currentPage, activeFilter]);


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
    <>

      {/* ==================================================
          HERO SECTION
      ================================================== */}

      <section className="projects-page-hero">

        <div className="projects-page-container">

          <p className="section-label">
            OUR WORK
          </p>

          <h1>
            Projects Built to Perform
          </h1>

          <p>
            Explore flooring, concrete finishing and
            waterproofing projects completed for
            residential, commercial and industrial spaces.
          </p>

        </div>

      </section>


      {/* ==================================================
          INTRO SECTION
      ================================================== */}

      <section className="projects-page-intro">

        <p className="section-label">
          OUR PROJECTS
        </p>

        <h2>
          Quality Finishes. Lasting Results.
        </h2>

        <p>
          Every project is approached with the right
          preparation, materials and application process
          to deliver durable, professional results.
        </p>

      </section>


      {/* ==================================================
          PROJECT GALLERY
      ================================================== */}

      <section className="projects-page-gallery">


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

                setActiveFilter(filter);

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

        {loading && (

          <p>
            Loading projects...
          </p>

        )}


        {/* ==================================================
            ERROR STATE
        ================================================== */}

        {!loading && error && (

          <p>
            {error}
          </p>

        )}


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!loading &&
          !error &&
          projects.length === 0 && (

            <p>
              No projects found.
            </p>

          )}


        {/* ==================================================
            PROJECT GRID
        ================================================== */}

        {!loading &&
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

        {!loading &&
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
                ← Previous
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
                Next →
              </button>

            </div>

          )}

      </section>


      {/* ==================================================
          CTA SECTION
      ================================================== */}

      <section className="projects-page-cta">

        <p className="section-label">
          START YOUR PROJECT
        </p>

        <h2>
          Have a Floor or Surface That Needs Finishing?
        </h2>

        <p>
          Tell us about your project and our team will
          recommend the right solution for your space.
        </p>

        <Link
          to="/contact"
          className="projects-page-cta-button"
        >
          Request a Site Inspection
        </Link>

      </section>

    </>
  );
}

export default Projects;