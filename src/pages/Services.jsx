import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import ServicesHero from "../components/ServicesHero";
import ServicesGrid from "../components/ServicesGrid";
import ServicesBenefits from "../components/ServicesBenefits";
import ServiceProcess from "../components/ServiceProcess";
import IndustriesSection from "../components/IndustriesSection";
import ServicesFAQ from "../components/ServicesFAQ";
import ServicesCTA from "../components/ServicesCTA";

function Services() {
  return (
    <>
      <Navbar />

      <ServicesHero />
      <ServicesGrid />
      <ServicesBenefits />
      <ServiceProcess />
      <IndustriesSection />
      <ServicesFAQ />
      <ServicesCTA />

      <Footer />
    </>
  );
}

export default Services;