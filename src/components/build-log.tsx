import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { ButtonLink, Card, SectionHeading } from "@/components/ui";
import { portfolio } from "@/data/portfolio";

export function BuildLog() {
  const { buildLog, achievements } = portfolio;
  const { github } = buildLog;

  return (
    <section className="editorial-section build-log-section" id="build-log" aria-labelledby="build-log-heading">
      <div className="build-log-intro" data-reveal="left">
        <div className="section-index">
          <p className="ds-eyebrow">{buildLog.eyebrow}</p>
          <span>{buildLog.index} <i aria-hidden="true" /> {buildLog.indexLabel}</span>
        </div>
        <SectionHeading id="build-log-heading" className="build-log-heading">{buildLog.heading}</SectionHeading>
      </div>

      <div className="build-log-content" data-reveal="right">
        {achievements.map((achievement) => (
          <article key={achievement.title} aria-labelledby="build-log-achievement-title">
            <Card className="build-log-achievement">
              <p className="ds-eyebrow">{buildLog.achievementLabel}</p>
              <h3 id="build-log-achievement-title">{achievement.title}</h3>
              <p className="build-log-achievement-result">{achievement.result}</p>
            </Card>
          </article>
        ))}

        <div className="build-log-github" role="group" aria-labelledby="build-log-github-heading">
          <div className="build-log-github-heading">
            <Github size={20} strokeWidth={1.6} aria-hidden="true" />
            <h3 id="build-log-github-heading">{github.heading}</h3>
          </div>
          <p className="build-log-github-introduction">{github.introduction}</p>
          <ul className="build-log-repositories" aria-labelledby="build-log-github-heading">
            {github.selectedRepositories.map((repository) => (
              <li key={repository.name}>
                <a href={repository.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${repository.name} repository on GitHub (opens in a new tab)`}>
                  <span>{repository.name}</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <div className="build-log-actions">
            <ButtonLink href={github.profile.href} variant="secondary" target="_blank" rel="noopener noreferrer" aria-label={`${github.ctaLabel}: ${github.profile.label} (opens in a new tab)`}>
              {github.ctaLabel} <ArrowUpRight size={15} aria-hidden="true" />
            </ButtonLink>
            <a className="build-log-more-link" href={github.moreProjects.href} aria-label="View more project repositories in More Experiments">
              {github.moreProjects.label} <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
