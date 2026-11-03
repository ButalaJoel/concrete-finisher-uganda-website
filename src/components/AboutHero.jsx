import PageHero from "./PageHero";
import heroImage from "../assets/about/epoxy-installation.jpg";

function AboutHero() {
  return (
    <PageHero
      image={heroImage}
      crumb={[{ label: "About us" }]}
      title="Concrete finishing specialists"
      intro="We prepare, install and finish concrete floors for industrial, commercial and residential clients across Uganda."
    />
  );
}

export default AboutHero;
