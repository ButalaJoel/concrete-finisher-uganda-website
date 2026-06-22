import epoxy from "../assets/services/epoxy.jpg";
import polishing from "../assets/services/polishing.jpg";
import grinding from "../assets/services/grinding.jpg";
import terrazzo from "../assets/services/terrazzo.jpg";
import stamping from "../assets/services/stamping.jpg";
import waterproofing from "../assets/services/waterproofing.jpg";

function ServicesGrid() {
  return (
    <section className="services-grid-section">

      <div className="container">

        <span className="services-page-subtitle">
          WHAT WE OFFER
        </span>

        <h2>
          Complete Flooring Solutions
        </h2>

        <div className="services-page-grid">

          <div className="services-page-card">
            <img src={epoxy} alt="Epoxy Flooring" />
            <h3>Epoxy Flooring</h3>
            <p>
              Durable seamless flooring ideal for
              factories, warehouses and commercial spaces.
            </p>
          </div>

          <div className="services-page-card">
            <img src={polishing} alt="Polished Concrete" />
            <h3>Concrete Polishing</h3>
            <p>
              Modern polished floors with exceptional
              durability and easy maintenance.
            </p>
          </div>

          <div className="services-page-card">
            <img src={grinding} alt="Grinding" />
            <h3>Surface Preparation</h3>
            <p>
              Professional grinding and preparation
              for coatings and repairs.
            </p>
          </div>

          <div className="services-page-card">
            <img src={terrazzo} alt="Terrazzo" />
            <h3>Terrazzo Flooring</h3>
            <p>
              Elegant decorative flooring with
              long-lasting performance.
            </p>
          </div>

          <div className="services-page-card">
            <img src={stamping} alt="Stamping" />
            <h3>Concrete Stamping</h3>
            <p>
              Decorative finishes that replicate
              stone, brick and natural textures.
            </p>
          </div>

          <div className="services-page-card">
            <img src={waterproofing} alt="Waterproofing" />
            <h3>Waterproofing</h3>
            <p>
              Protect structures against moisture,
              leakage and water damage.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default ServicesGrid;