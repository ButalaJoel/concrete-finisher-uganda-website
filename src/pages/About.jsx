import SiteShell from "../components/SiteShell";
import AboutHero from "../components/AboutHero";
import CompanyStory from "../components/CompanyStory";
import VisionMission from "../components/VisionMission";
import CompanyStats from "../components/CompanyStats";
import WhyChooseUs from "../components/WhyChooseUs";
import AboutCTA from "../components/AboutCTA";

function About() {
  return (
    <SiteShell>
      <AboutHero />
      <CompanyStory />
      <CompanyStats />
      <VisionMission />
      <WhyChooseUs />
      <AboutCTA />
    </SiteShell>
  );
}

export default About;
