import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { BodyText, ButtonLink, DisplayHeading } from "@/components/ui";
import { portfolio } from "@/data/portfolio";
import { ResumeLink } from "@/components/resume-link";

export function Hero() {
  const nameWords = portfolio.personal.name.trim().split(/\s+/);

  return (
    <div id="top" className="hero-main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="ds-eyebrow hero-eyebrow">Hello, I’m</p>
          <DisplayHeading id="hero-title" className="hero-title">
            {nameWords.map((word, index) => (
              <span className="hero-title-clip" key={`${word}-${index}`}><span className="hero-title-word" style={{ animationDelay: `${index * 90}ms` }}>{word}</span></span>
            )).flatMap((word, index) => index === 0 ? [word] : [" ", word])}
          </DisplayHeading>
          <p className="hero-role">{portfolio.personal.role}</p>
          <div>
            <BodyText className="hero-description">
              AI &amp; Data Science student building practical, user-focused software across machine learning, cybersecurity, and full-stack development.
            </BodyText>
          </div>
          <div className="hero-actions">
            <ButtonLink href="#work" variant="primary">
              View Projects <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
            </ButtonLink>
            <ResumeLink placement="hero" variant="secondary" />
          </div>
          <a className="hero-scroll" href="#footer">
            <span>Scroll to explore</span><ArrowDown size={14} strokeWidth={1.7} aria-hidden="true" />
          </a>
        </div>

        <div className="hero-stage">
          <Image className="hero-photo" src="/profile.jpeg" alt={`Portrait of ${portfolio.personal.name}`} width={900} height={900} sizes="(max-width: 760px) 320px, 390px" priority />
        </div>
      </section>
    </div>
  );
}
