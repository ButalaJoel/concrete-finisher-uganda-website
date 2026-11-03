import SiteShell from "../components/SiteShell";
import ServicesHero from "../components/ServicesHero";
import ServicesGrid from "../components/ServicesGrid";
import ServicesBenefits from "../components/ServicesBenefits";
import ServiceProcess from "../components/ServiceProcess";
import IndustriesSection from "../components/IndustriesSection";
import ServicesFAQ from "../components/ServicesFAQ";
import ServicesCTA from "../components/ServicesCTA";

function Services() {
  return (
    <SiteShell>
      <ServicesHero />
      <section id="services"><ServicesGrid /></section>
      <section id="benefits"><ServicesBenefits /></section>
      <section id="process"><ServiceProcess /></section>
      <section id="industries"><IndustriesSection /></section>
      <section id="faq"><ServicesFAQ /></section>
      <ServicesCTA />
    </SiteShell>
  );
}

export default Services;
