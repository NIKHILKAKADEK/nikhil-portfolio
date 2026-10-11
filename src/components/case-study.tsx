import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { portfolio } from "@/data/portfolio";
import { Card, SectionHeading, Tag } from "@/components/ui";

function ExternalProjectLink({ href, label }: { href: string; label: string }) {
  return <a className="case-study-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`}>
    {label}<ArrowUpRight size={15} aria-hidden="true" />
  </a>;
}

export function CaseStudy({ project }: { project: Project }) {
  const projects = portfolio.projects;
  const index = projects.findIndex((item) => item.id === project.id);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const details = project.caseStudyDetails;

  return (
    <main className="case-study" id="main-content">
      <header className="case-study-hero">
        <Link className="case-back-link" href="/#work"><ArrowLeft size={15} aria-hidden="true" /> Back to Projects</Link>
        <div className="case-hero-copy">
          <p className="case-study-kicker"><span>{project.number}</span><i aria-hidden="true" />{project.category}</p>
          <h1 className="case-title">{project.title}</h1>
          <p className="case-subtitle">{project.subtitle ?? project.heroDescription ?? project.category}</p>
          <p className="case-intro">{project.description}</p>
          <div className="case-link-row">
            {project.github && <ExternalProjectLink href={project.github} label="GitHub" />}
            {project.liveDemo && <ExternalProjectLink href={project.liveDemo} label="Live demo" />}
          </div>
        </div>
        <div className="case-hero-index" aria-hidden="true">{project.number}<span>/ 04</span></div>
      </header>

      <section className="case-section case-editorial-section" aria-labelledby="case-problem">
        <div className="case-section-label"><span>01</span><span>Context</span></div>
        <div className="case-section-main">
          <SectionHeading id="case-problem">The problem</SectionHeading>
          <p className="case-lead">{details.problem}</p>
          <div className="case-idea-block">
            <p className="ds-eyebrow">The idea</p>
            <p>{details.idea}</p>
          </div>
        </div>
      </section>

      <section className="case-section" aria-labelledby="case-flow">
        <div className="case-section-label"><span>02</span><span>System flow</span></div>
        <div className="case-section-main">
          <div className="case-section-heading">
            <SectionHeading id="case-flow">How it works</SectionHeading>
            <p className="case-section-aside">{details.flowNote}</p>
          </div>
          <ol className="case-flow-list">
            {details.flow.map((step, stepIndex) => (
              <li className="case-flow-item" key={step.title}>
                <span className="case-flow-number" aria-hidden="true">{String(stepIndex + 1).padStart(2, "0")}</span>
                <Card className="case-flow-card">
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="case-section" aria-labelledby="case-architecture">
        <div className="case-section-label"><span>03</span><span>System design</span></div>
        <div className="case-section-main">
          <div className="case-section-heading">
            <SectionHeading id="case-architecture">Architecture</SectionHeading>
            <p className="case-section-aside">{details.architectureNote}</p>
          </div>
          <div className="case-architecture-grid">
            {details.architecture.map((item, itemIndex) => (
              <Card className="case-architecture-card" key={item.title}>
                <span className="case-card-index">{String(itemIndex + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section" aria-labelledby="case-stack">
        <div className="case-section-label"><span>04</span><span>Tools</span></div>
        <div className="case-section-main case-stack-main">
          <SectionHeading id="case-stack">Technology stack</SectionHeading>
          <p className="case-stack-note">Technologies listed for this project.</p>
          <ul className="case-tech-list" aria-label="Technologies used">
            {project.technologies.map((technology) => <li key={technology}><Tag>{technology}</Tag></li>)}
          </ul>
        </div>
      </section>

      <section className="case-section" aria-labelledby="case-engineering">
        <div className="case-section-label"><span>05</span><span>Decisions</span></div>
        <div className="case-section-main">
          <div className="case-section-heading">
            <SectionHeading id="case-engineering">Engineering notes</SectionHeading>
            <p className="case-section-aside">Implementation details and constraints supported by the available project information.</p>
          </div>
          <div className="case-engineering-list">
            {details.engineering.map((item) => (
              <article className="case-engineering-item" key={item.title}>
                <h3>{item.title}</h3><p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <nav className="case-project-navigation" aria-label="Project case studies">
        <Link className="case-nav-card case-nav-previous" href={previous.caseStudy}>
          <span><ArrowLeft size={15} aria-hidden="true" /> Previous project</span>
          <strong>{previous.title}</strong>
        </Link>
        <Link className="case-nav-card case-nav-next" href={next.caseStudy}>
          <span>Next project <ArrowRight size={15} aria-hidden="true" /></span>
          <strong>{next.title}</strong>
        </Link>
      </nav>
    </main>
  );
}
