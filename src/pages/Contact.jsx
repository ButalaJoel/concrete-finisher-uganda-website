import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import ContactHero from "../components/ContactHero";
import ContactInfo from "../components/ContactInfo";
import ContactForm from "../components/ContactForm";
import ContactMap from "../components/ContactMap";
import ContactReasons from "../components/ContactReasons";

import "../styles/Contact.css";

function Contact() {
  return (
    <>
      <Navbar />

      <ContactHero />

      <ContactInfo />

      <ContactForm />

      <ContactMap />

      <ContactReasons />

      <Footer />
    </>
  );
}

export default Contact;