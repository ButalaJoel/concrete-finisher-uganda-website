import PageHero from "./PageHero";
import heroImage from "../assets/services/service-hero.jpg";

function ServicesHero() {
  return (
    <PageHero
      image={heroImage}
      crumb={[{ label: "Services" }]}
      title="Concrete flooring systems"
      intro="Durable, high-performance floors for industrial, commercial and residential projects across Uganda."
    />
  );
}

export default ServicesHero;
