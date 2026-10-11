import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { AboutJourneyEducation } from "@/components/about-journey-education";
import { ProjectShowcase } from "@/components/project-showcase";
import { TechnicalFocus } from "@/components/technical-focus";
import { BuildLog } from "@/components/build-log";
import { Contact } from "@/components/contact";
import { ScrollReveal } from "@/components/scroll-reveal";
import { homeTitle, homeDescription, pageMetadata, personStructuredData } from "@/lib/seo";

export const metadata = pageMetadata(homeTitle, homeDescription, "/");

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData()).replace(/</g, "\\u003c") }} />
      <ScrollReveal />
      <Navbar />
      <main id="main-content">
        <Hero />
        <AboutJourneyEducation />
        <ProjectShowcase />
        <TechnicalFocus />
        <BuildLog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
