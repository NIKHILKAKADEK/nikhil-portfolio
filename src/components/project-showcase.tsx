"use client";

import { LazyMotion, domAnimation, m as motion, type Variants } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { BodyText, Card, SectionHeading, Tag } from "@/components/ui";
import { portfolio, type Project } from "@/data/portfolio";
import { useMotionEnabled } from "@/hooks/use-motion-enabled";

const reveal: Variants = {
  visible: { opacity: [0.96, 1], y: [6, 0], transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  still: { opacity: 1, y: 0, transition: { duration: 0 } },
};

function ProjectVisual({ project }: { project: Project }) {
  const isHospital = project.visualType === "hospital-flow";
  const isEmergency = project.visualType === "emergency-flow";
  const isLead = project.visualType === "lead-flow";

  return (
    <div className={`project-visual project-visual-${project.visualType}`} role="img" aria-label={`${project.title} conceptual system diagram: ${project.visualNodes.join(", then ")}`}>
      <div className="project-visual-top" aria-hidden="true">
        <span className="project-visual-kicker">System map</span>
        <span className="project-visual-index">{project.number} / 04</span>
      </div>
      <div className={`project-flow ${isHospital ? "project-flow-hospital" : ""}`} aria-hidden="true">
        {project.visualNodes.map((node, index) => {
          const grouped = isHospital && index < 3;
          const connector = index < project.visualNodes.length - 1;
          const shouldDown = !isHospital;
          return (
            <div className={`project-flow-step ${grouped ? "project-flow-source" : ""} ${isEmergency && index === 3 ? "project-flow-branch" : ""}`} key={node}>
              <span className={`project-flow-node ${index === project.visualNodes.length - 1 ? "project-flow-node-final" : ""}`}>
                {!grouped && <span className="project-flow-dot" />}
                {node}
              </span>
              {connector && (isEmergency && index === 2 ? <span className="project-flow-plus">+</span> : shouldDown ? <ArrowDown className="project-flow-arrow" size={15} /> : <ArrowRight className="project-flow-arrow" size={15} />)}
            </div>
          );
        })}
      </div>
      <span className="project-visual-note" aria-hidden="true">Conceptual flow</span>
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="project-actions">
      <a className="project-case-link" href={project.caseStudy} aria-label={`View Case Study: ${project.title}`}>
        View Case Study <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
      </a>
      {project.github && (
        <a className="project-github-link" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub`}>
          <Github size={16} strokeWidth={1.8} aria-hidden="true" /> GitHub <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

export function ProjectShowcase() {
  const motionEnabled = useMotionEnabled();
  const { projectShowcase, projects } = portfolio;

  return (
    <LazyMotion features={domAnimation} strict>
    <section className="project-showcase" id="work" aria-labelledby="projects-heading">
      <div className="editorial-section projects-intro">
        <motion.div className="projects-intro-copy" variants={reveal} initial={false} animate={motionEnabled ? undefined : "still"} whileInView={motionEnabled ? "visible" : undefined} viewport={{ once: true, amount: 0.4 }}>
          <p className="ds-eyebrow">{projectShowcase.eyebrow}</p>
          <SectionHeading id="projects-heading" className="projects-heading">{projectShowcase.heading}</SectionHeading>
          <BodyText className="projects-introduction">{projectShowcase.introduction}</BodyText>
        </motion.div>
        <span className="projects-intro-index" aria-hidden="true">04 <i /> Work</span>
      </div>

      <div className="projects-list">
        {projects.map((project, index) => {
          const reverse = index % 2 === 1;
          return (
            <motion.article
              className={`editorial-section project-feature ${reverse ? "project-feature-reverse" : ""}`}
              key={project.id}
              variants={reveal}
              initial={false}
              animate={motionEnabled ? undefined : "still"}
              whileInView={motionEnabled ? "visible" : undefined}
              viewport={{ once: true, amount: 0.18 }}
              aria-labelledby={`project-${project.id}-title`}
            >
              <div className="project-copy">
                <p className="project-meta"><span>{project.number}</span><i />{project.category}</p>
                <h3 className="project-title" id={`project-${project.id}-title`}>{project.title}</h3>
                {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
                <p className="project-description">{project.description}</p>
                <ul className="project-technologies" aria-label={`${project.title} technologies`}>
                  {project.technologies.map((technology) => <li key={technology}><Tag>{technology}</Tag></li>)}
                </ul>
                <ProjectLinks project={project} />
              </div>
              <Card className="project-preview"><ProjectVisual project={project} /></Card>
            </motion.article>
          );
        })}
      </div>

      <div className="editorial-section more-projects" id="more-projects" role="region" aria-labelledby="more-projects-heading">
        <div className="more-projects-heading-row">
          <div>
            <p className="ds-eyebrow">Beyond the featured work</p>
            <SectionHeading id="more-projects-heading" className="more-projects-heading">{projectShowcase.moreHeading}</SectionHeading>
          </div>
          <a className="repositories-link" href={portfolio.buildLog.github.profile.href} target="_blank" rel="noopener noreferrer">
            Explore all repositories <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
        <ul className="repository-list">
          {projectShowcase.repositories.map((repository, index) => (
            <li key={repository.name}>
              <a className="repository-row" href={repository.github} target="_blank" rel="noopener noreferrer">
                <span className="repository-index">0{index + 1}</span>
                <span className="repository-name">{repository.name}</span>
                {repository.language && <span className="repository-language">{repository.language}</span>}
                <span className="sr-only"> repository on GitHub</span>
                <ArrowUpRight className="repository-arrow" size={17} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
    </LazyMotion>
  );
}
