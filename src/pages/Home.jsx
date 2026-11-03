import SiteShell from "../components/SiteShell";
import HeroSection from "../components/HeroSection";
import MetricsSection from "../components/MetricsSection";
import ServicesSection from "../components/ServicesSection";
import ProcessSteps from "../components/ProcessSteps";
import ProjectsSection from "../components/ProjectsSection";
import CtaBand from "../components/CtaBand";

function Home() {
  return (
    <SiteShell className="site--home">
      <HeroSection />
      <MetricsSection />
      <ServicesSection
        title="Floor systems we install"
        intro="Six services, one team. We recommend the system after we've seen the slab and know how the space will be used."
      />
      <ProcessSteps />
      <ProjectsSection />
      <CtaBand />
    </SiteShell>
  );
}

export default Home;
