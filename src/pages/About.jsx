import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import AboutHero from "../components/AboutHero";
import CompanyStory from "../components/CompanyStory";
import VisionMission from "../components/VisionMission";
import WhyChooseUs from "../components/WhyChooseUs";
import AboutCTA from "../components/AboutCTA";
import CompanyStats from "../components/CompanyStats";

function About() {
  return (
    <>
      <Navbar />

      <AboutHero />
      <CompanyStory />
      <VisionMission />
      <CompanyStats />
      <WhyChooseUs />
      <AboutCTA />

      <Footer />
    </>
  );
}

export default About;