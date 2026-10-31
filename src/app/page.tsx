import { AboutSection } from "@/components/AboutSection";
import { CyanotypePrint } from "@/components/CyanotypePrint";
import { NewsSection } from "@/components/NewsSection";
import { ResearchSection } from "@/components/ResearchSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { LinesSection, TimelineSection } from "@/components/TimelineSection";
import { education, experience, honors, projects, teachingAndService } from "@/data/cv";
import { profile } from "@/data/profile";

// The page, top to bottom. Reorder, rename or remove sections here.
export default function Home() {
  return (
    <>
      <a className="skip" href="#about">Skip to content</a>
      <div className="page">
        <SiteNav />
        <CyanotypePrint name={profile.name} />
        <main>
          <AboutSection />
          <NewsSection />
          <ResearchSection />
          <TimelineSection id="education" title="Education" entries={education} />
          <TimelineSection id="experience" title="Experience" entries={experience} />
          <TimelineSection id="projects" title="Projects" entries={projects} />
          <TimelineSection id="honors" title="Honors" entries={honors} />
          <LinesSection id="service" title="Teaching & service" lines={teachingAndService} />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
