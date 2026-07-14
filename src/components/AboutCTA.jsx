import { Link } from "react-router-dom";

function AboutCTA() {
  return (
    <section className="about-cta">

      <h2>
        Let's Build Floors That Last
      </h2>

      <p>
        From epoxy flooring to polished concrete,
        our experienced team is ready to transform
        your residential, commercial or industrial
        space.
      </p>

      <Link
  to="/contact"
  className="about-cta-btn"
>
  GET A FREE QUOTE
</Link>

    </section>
  );
}

export default AboutCTA;