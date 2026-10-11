import { BodyText, Card, FloatingPanel, MutedText, SectionHeading, Tag } from "@/components/ui";
import { portfolio } from "@/data/portfolio";

export function AboutJourneyEducation() {
  return (
    <div className="about-journey-education">
      <section className="editorial-section about-section" id="about" aria-labelledby="about-heading">
        <div className="section-index">
          <p className="ds-eyebrow">About</p>
          <span>02 <i /> Context</span>
        </div>
        <div
          className="about-copy"
        >
          <div>
            <SectionHeading id="about-heading" className="about-heading">
              {portfolio.about.heading}
            </SectionHeading>
          </div>
          <div>
            <BodyText className="about-introduction">{portfolio.about.introduction}</BodyText>
          </div>
        </div>
      </section>

      <section className="editorial-section journey-section" aria-label="Then, now and next">
        <div className="journey-heading">
          <p className="ds-eyebrow">Then / Now / Next</p>
        </div>
        <ol
          className="journey-grid"
        >
          {portfolio.journey.map((step, index) => (
            <li className={`journey-item journey-item-${step.label.toLowerCase()}`} key={step.label}>
              <span className="journey-node" aria-hidden="true" />
              <FloatingPanel className="journey-card">
                <div className="journey-card-top">
                  <span className="journey-index">0{index + 1} <i /> 03</span>
                </div>
                <h3>{step.label}</h3>
                <p className="journey-description">{step.description}</p>
                {step.details && (
                  <div className="journey-tags" role="group" aria-label="Current project areas">
                    {step.details.map((detail) => <Tag key={detail}>{detail}</Tag>)}
                  </div>
                )}
              </FloatingPanel>
            </li>
          ))}
        </ol>
      </section>

      <section className="editorial-section education-section" id="education" aria-labelledby="education-heading">
        <div className="education-heading-row">
          <div className="section-index">
            <p className="ds-eyebrow">Education</p>
            <span>03 <i /> Learning</span>
          </div>
          <SectionHeading id="education-heading" className="education-heading">Education</SectionHeading>
        </div>

        <div
          className="education-grid"
        >
          {portfolio.education.map((item, index) => (
            <div className={index === 0 ? "education-primary-wrap" : "education-secondary-wrap"} key={item.qualification}>
              <Card className={index === 0 ? "education-card education-card-primary" : "education-card education-card-secondary"}>
                <div className="education-card-top">
                  <span className="ds-eyebrow">{item.qualification}</span>
                  <span className="education-period">{item.period}</span>
                </div>
                {index === 0 ? (
                  <div className="education-primary-content">
                    <div>
                      <h3>{item.qualification}</h3>
                      {item.institution && <MutedText className="education-institution">{item.institution}</MutedText>}
                    </div>
                    {item.result && (
                      <div className="education-result education-result-primary">
                        <span>{item.resultLabel}</span>
                        <strong>{item.result}</strong>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <h3 className="education-secondary-title">{item.qualification}</h3>
                    {item.result && <strong className="education-secondary-result">{item.result}</strong>}
                  </>
                )}
              </Card>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
