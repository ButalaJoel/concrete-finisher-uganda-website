import SiteShell from "../components/SiteShell";
import ContactHero from "../components/ContactHero";
import ContactInfo from "../components/ContactInfo";
import ContactForm from "../components/ContactForm";
import ContactMap from "../components/ContactMap";

function Contact() {
  return (
    <SiteShell>
      <ContactHero />
      <section className="section" id="quote">
        <div className="wrap contact-layout">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
      <ContactMap />
    </SiteShell>
  );
}

export default Contact;
