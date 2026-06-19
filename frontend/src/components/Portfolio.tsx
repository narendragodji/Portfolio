import Navbar from "./navbar/Navbar";
import HeroSection from "./hero-section/herosection";
import AboutSection from "./about-section/AboutSection";
import ExperienceSection from "./experience-section/ExperienceSection";
import SkillsSection from "./skills-section/SkillsSection";
import ProjectsSection from "./projects-section/ProjectsSection";
import ContactSection from "./contact-section/ContactSection";
import SmoothScroll from "./smooth-scroll/SmoothScroll";

export default function Portfolio() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main className="relative">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}
