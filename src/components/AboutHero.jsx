import heroImage from "../assets/about/epoxy-installation.jpg";

function AboutHero() {
  return (
    <section
      className="about-hero"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(12,10,8,0.80),
            rgba(12,10,8,0.80)
          ),
          url(${heroImage})
        `,
      }}
    >
      <div className="container">

        <p className="about-subtitle">
          ABOUT CONCRETE FINISHER UGANDA
        </p>

        <h1>
          Professional Concrete Finishing Specialists
        </h1>

        <p>
          Delivering durable flooring systems,
          epoxy solutions and premium concrete
          finishes across Uganda.
        </p>

      </div>
    </section>
  );
}

export default AboutHero;