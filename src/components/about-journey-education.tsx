"use client";

import { LazyMotion, domAnimation, m as motion, type Variants } from "framer-motion";
import { BodyText, Card, FloatingPanel, MutedText, SectionHeading, Tag } from "@/components/ui";
import { portfolio } from "@/data/portfolio";
import { useMotionEnabled } from "@/hooks/use-motion-enabled";

const reveal: Variants = {
  visible: {
    opacity: [0.96, 1],
    y: [6, 0],
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
  still: { opacity: 1, y: 0, transition: { duration: 0 } },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.06 } },
  still: { transition: { staggerChildren: 0 } },
};

export function AboutJourneyEducation() {
  const motionEnabled = useMotionEnabled();

  return (
    <LazyMotion features={domAnimation} strict>
    <div className="about-journey-education">
      <section className="editorial-section about-section" id="about" aria-labelledby="about-heading">
        <div className="section-index" data-reveal="left">
          <p className="ds-eyebrow">About</p>
          <span>02 <i /> Context</span>
        </div>
        <motion.div
          className="about-copy"
          variants={stagger}
          initial={false}
          animate={motionEnabled ? undefined : "still"}
          whileInView={motionEnabled ? "visible" : undefined}
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.div variants={reveal}>
            <SectionHeading id="about-heading" className="about-heading">
              {portfolio.about.heading}
            </SectionHeading>
          </motion.div>
          <motion.div variants={reveal}>
            <BodyText className="about-introduction">{portfolio.about.introduction}</BodyText>
          </motion.div>
        </motion.div>
      </section>

      <section className="editorial-section journey-section" aria-label="Then, now and next">
        <div className="journey-heading" data-reveal="right">
          <p className="ds-eyebrow">Then / Now / Next</p>
        </div>
        <motion.ol
          className="journey-grid"
          variants={stagger}
          initial={false}
          animate={motionEnabled ? undefined : "still"}
          whileInView={motionEnabled ? "visible" : undefined}
          viewport={{ once: true, amount: 0.2 }}
        >
          {portfolio.journey.map((step, index) => (
            <motion.li className={`journey-item journey-item-${step.label.toLowerCase()}`} variants={reveal} key={step.label}>
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
            </motion.li>
          ))}
        </motion.ol>
      </section>

      <section className="editorial-section education-section" id="education" aria-labelledby="education-heading">
        <div className="education-heading-row">
          <div className="section-index" data-reveal="left">
            <p className="ds-eyebrow">Education</p>
            <span>03 <i /> Learning</span>
          </div>
          <SectionHeading id="education-heading" className="education-heading">Education</SectionHeading>
        </div>

        <motion.div
          className="education-grid"
          variants={stagger}
          initial={false}
          animate={motionEnabled ? undefined : "still"}
          whileInView={motionEnabled ? "visible" : undefined}
          viewport={{ once: true, amount: 0.18 }}
        >
          {portfolio.education.map((item, index) => (
            <motion.div className={index === 0 ? "education-primary-wrap" : "education-secondary-wrap"} variants={reveal} key={item.qualification}>
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
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
    </LazyMotion>
  );
}
