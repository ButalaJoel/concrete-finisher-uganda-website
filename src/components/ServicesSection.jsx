// ServicesSection.jsx

import epoxyImg from "../assets/services/epoxy.jpg";
import polishingImg from "../assets/services/polishing.jpg";
import stampingImg from "../assets/services/stamping.jpg";
import terrazzoImg from "../assets/services/terrazzo.jpg";
import waterproofingImg from "../assets/services/waterproofing.jpg";
import grindingImg from "../assets/services/grinding.jpg";

import { ArrowRight } from "lucide-react";

function ServicesSection() {
  return (
    <>
      <section className="services-section">

  <div className="services-intro">

    <span className="services-subtitle">
      OUR SERVICES
    </span>

    <h2>
      Professional Flooring
      <br />
      Solutions For Every Need
    </h2>

    <p>
      We provide a wide range of concrete finishing
      services tailored for industrial, commercial
      and residential spaces.
    </p>

    <button className="services-btn">
      EXPLORE SERVICES
      <ArrowRight size={14} />
    </button>

  </div>

  <div className="services-grid">

    <div className="service-card">
      <img src={epoxyImg} alt="Epoxy Flooring" />

      <div className="service-content">
        <h3>EPOXY FLOORING</h3>

        <p>
          Durable, seamless and chemical-resistant
          flooring solutions.
        </p>
      </div>
    </div>

    <div className="service-card">
      <img src={polishingImg} alt="Polishing" />

      <div className="service-content">
        <h3>CONCRETE POLISHING</h3>

        <p>
          High-gloss polished concrete for modern
          and long-lasting floors.
        </p>
      </div>
    </div>

    <div className="service-card">
      <img src={stampingImg} alt="Stamping" />

      <div className="service-content">
        <h3>CONCRETE STAMPING</h3>

        <p>
          Decorative patterns and textures that
          enhance concrete surfaces.
        </p>
      </div>
    </div>

    <div className="service-card">
      <img src={terrazzoImg} alt="Terrazzo" />

      <div className="service-content">
        <h3>TERRAZZO FLOORING</h3>

        <p>
          Elegant terrazzo finishes for commercial
          and residential spaces.
        </p>
      </div>
    </div>

    <div className="service-card">
      <img src={waterproofingImg} alt="Waterproofing" />

      <div className="service-content">
        <h3>WATERPROOFING</h3>

        <p>
          Protect concrete surfaces from moisture
          and water damage.
        </p>
      </div>
    </div>

    <div className="service-card">
      <img src={grindingImg} alt="Grinding" />
      <div className="service-content">
        <h3>GRINDING & SURFACE PREPARATION</h3>

        <p>
          Professional preparation for premium
          flooring installations.
        </p>
      </div>
    </div>

  </div>

</section>

    </>
  );
}

export default ServicesSection;