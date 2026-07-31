
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectsSection from "../components/ProjectsSection";
import ServicesSection from "../components/ServicesSection";
import MetricsSection from "../components/MetricsSection";
import HeroSection from "../components/HeroSection";

import "../App.css";

import heroImage from "../assets/hero.png";

import {
ArrowRight, 
} from "lucide-react";
function Home(){
  return (
    <>
    <Navbar />
    <HeroSection />
    <MetricsSection />
    <ServicesSection />
    <ProjectsSection />
    <Footer />
    </>

  );
}

export default Home;