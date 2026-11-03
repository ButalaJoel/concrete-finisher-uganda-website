import PageHero from "./PageHero";
import heroImage from "../assets/projects/warehouse-epoxy.jpg";

function ContactHero() {
  return (
    <PageHero
      image={heroImage}
      crumb={[{ label: "Contact" }]}
      title="Let's talk about your floor"
      intro="Tell us what you need finished. We'll arrange a site visit and send you a quotation."
    />
  );
}

export default ContactHero;
