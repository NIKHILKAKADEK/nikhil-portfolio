import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { Card, SectionHeading, Tag } from "@/components/ui";
import { portfolio } from "@/data/portfolio";

export function TechnicalFocus() {
  const skillsById = new Map(portfolio.skillCatalog.map((skill) => [skill.id, skill]));

  return (
    <div className="technical-focus-module">
      <section className="editorial-section technical-focus-section" id="skills" aria-labelledby="technical-focus-heading">
        <div className="technical-focus-intro" data-reveal="up">
          <div className="section-index">
            <p className="ds-eyebrow">{portfolio.technicalFocus.eyebrow}</p>
            <span>{portfolio.technicalFocus.index} <i /> {portfolio.technicalFocus.indexLabel}</span>
          </div>
          <div>
            <SectionHeading id="technical-focus-heading" className="technical-focus-heading">{portfolio.technicalFocus.heading}</SectionHeading>
            <p className="technical-focus-lede">{portfolio.technicalFocus.introduction}</p>
          </div>
        </div>

        <div className="technical-focus-grid">
          {portfolio.technicalFocus.areas.map((area) => {
            const areaSkills = area.skills.map((id) => skillsById.get(id)).filter((skill) => skill !== undefined);
            return (
              <article key={area.number} data-reveal="up" className={`technical-focus-card-wrap ${area.emphasis ? "technical-focus-card-wrap-emphasis" : ""} ${area.supporting ? "technical-focus-card-wrap-supporting" : ""}`}>
                <Card className={`technical-focus-card ${area.emphasis ? "technical-focus-card-emphasis" : ""}`}>
                  <div className="technical-focus-card-heading">
                    <span className="technical-focus-number">{area.number}</span>
                    <span className="technical-focus-label">{area.supporting ? portfolio.technicalFocus.supportingLabel : portfolio.technicalFocus.primaryLabel}</span>
                  </div>
                  <h3>{area.title}</h3>
                  <p className="technical-focus-description">{area.description}</p>

                  {area.proof ? (
                    <div className="focus-proof-layout">
                      <div className="focus-proof-copy">
                        <Link className="focus-proof-link" href={area.proof.href}>
                          <span><strong>{area.proof.title}</strong><small>{area.proof.subtitle}</small></span>
                          <span className="sr-only"> view case study</span>
                          <ArrowUpRight size={18} aria-hidden="true" />
                        </Link>
                        <ul className="focus-tech-list" aria-label={`${area.title} technologies`}>
                          {areaSkills.map((skill) => <li key={skill.id}><Tag>{skill.name}</Tag></li>)}
                        </ul>
                      </div>
                      <ol className="focus-flow focus-flow-security" aria-label={`${area.proof.title} conceptual flow`}>
                        {area.proof.flow.map((stage, index) => (
                          <li key={stage}>
                            <span>{stage}</span>
                            {index < area.proof!.flow.length - 1 && <ArrowDown size={13} aria-hidden="true" />}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <>
                      <ol className="focus-flow" aria-label={`${area.title} conceptual flow`}>
                        {area.flow.map((stage, index) => (
                          <li key={stage}>
                            <span>{stage}</span>
                            {index < area.flow.length - 1 && <ArrowRight size={13} aria-hidden="true" />}
                          </li>
                        ))}
                      </ol>
                      <ul className="focus-tech-list" aria-label={`${area.title} technologies`}>
                        {areaSkills.map((skill) => <li key={skill.id}><Tag>{skill.name}</Tag></li>)}
                      </ul>
                    </>
                  )}
                </Card>
              </article>
            );
          })}
        </div>
      </section>

      <section className="editorial-section credentials-section" id="credentials" aria-labelledby="credentials-heading">
        <div className="credentials-heading-row" data-reveal="up">
          <div className="section-index">
            <p className="ds-eyebrow">{portfolio.credentials.eyebrow}</p>
            <span>{portfolio.credentials.index} <i /> {portfolio.credentials.indexLabel}</span>
          </div>
          <div className="credentials-heading-copy">
            <SectionHeading id="credentials-heading" className="credentials-heading">{portfolio.credentials.heading}</SectionHeading>
            <p>{portfolio.credentials.introduction}</p>
          </div>
        </div>

        <div className="credentials-grid">
          {portfolio.certifications.map((credential, index) => (
            <article key={credential.title} data-reveal="up">
              <Card className="credential-card">
                <div className="credential-card-top">
                  <span className="credential-index">0{index + 1}</span>
                  {credential.score && <span className="credential-score">{portfolio.credentials.scoreLabel} <strong>{credential.score}</strong></span>}
                </div>
                <h3>{credential.title}</h3>
                <p className="credential-issuer">{credential.issuer}</p>
                {credential.description && <p className="credential-description">{credential.description}</p>}
                {credential.skills.length > 0 && (
                  <ul className="credential-skills" aria-label={`${credential.title} topics`}>
                    {credential.skills.map((skill) => <li key={skill}><Tag>{skill}</Tag></li>)}
                  </ul>
                )}
              </Card>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
