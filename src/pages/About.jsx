import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import AboutHero from "../components/AboutHero";
import CompanyStory from "../components/CompanyStory";
import VisionMission from "../components/VisionMission";
import WhyChooseUs from "../components/WhyChooseUs";
import AboutCTA from "../components/AboutCTA";
import CompanyStats from "../components/CompanyStats";
import "../styles/AboutPage.css";

function About() {
  return (
    <div className="about-page">
      <Navbar />

      <AboutHero />
      <CompanyStory />
      <VisionMission />
      <CompanyStats />
      <WhyChooseUs />
      <AboutCTA />

      <Footer />
    </div>
  );
}

export default About;