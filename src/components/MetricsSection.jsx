import { Link } from "react-router-dom";
import companyPhoto from "../assets/about/grinding-work.jpg";

const FACTS = [
  { value: "100+", label: "Floors completed for factories, businesses and homes" },
  { value: "8+", label: "Years of concrete finishing experience" },
  { value: "6", label: "Floor systems installed by our own crews" },
  { value: "1", label: "Team responsible from site visit to handover" },
];

// Home page introduction: who we are plus key facts.
function MetricsSection() {
  return (
    <section className="section intro">
      <div className="wrap intro__grid">
        <div className="intro__text">
          <h2 className="h2">A floor is only as good as the preparation under it.</h2>
          <p className="lede">
            Concrete Finisher Uganda prepares, installs and finishes concrete floors
            from start to handover. We grind and repair the slab, apply the right
            system for how the space is used, and check the result before we leave.
          </p>
          <Link to="/about" className="link-arrow">More about us</Link>
        </div>

        <figure className="intro__photo">
          <img src={companyPhoto} alt="Our team grinding a concrete floor" loading="lazy" />
        </figure>

        <dl className="facts">
          {FACTS.map((fact) => (
            <div key={fact.label} className="facts__item">
              <dt>{fact.value}</dt>
              <dd>{fact.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default MetricsSection;
