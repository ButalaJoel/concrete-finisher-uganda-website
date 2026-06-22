import heroImage from "../assets/services/service-hero.jpg";

function ServicesHero() {
  return (
    <section
      className="services-hero"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(12,10,8,0.82),
            rgba(12,10,8,0.82)
          ),
          url(${heroImage})
        `,
      }}
    >
      <div className="container">

        <p className="services-subtitle">
          OUR SERVICES
        </p>

        <h1>
          Professional Concrete Flooring Solutions
        </h1>

        <p>
          We provide durable, high-performance flooring
          systems for industrial, commercial and residential
          projects across Uganda.
        </p>

      </div>
    </section>
  );
}

export default ServicesHero;