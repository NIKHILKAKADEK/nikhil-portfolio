import { ArrowUpRight, Mail } from "lucide-react";
import { ResumeLink } from "@/components/resume-link";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { portfolio } from "@/data/portfolio";

export function Contact() {
  const { contact, personal } = portfolio;

  return (
    <section className="editorial-section contact-section" id="contact" aria-labelledby="contact-heading">
      <div className="contact-layout">
        <div className="section-index" data-reveal="left">
          <p className="ds-eyebrow">{contact.eyebrow}</p>
          <span>{contact.index} <i aria-hidden="true" /> {contact.indexLabel}</span>
        </div>
        <div className="contact-copy" data-reveal="right">
          <SectionHeading className="contact-heading" id="contact-heading">{contact.heading}</SectionHeading>
          <p className="contact-introduction">{contact.introduction}</p>
          <div className="contact-actions">
            <ButtonLink variant="primary" href={contact.email.href} aria-label={`Email ${personal.name} at ${personal.email}`}>
              <Mail size={17} strokeWidth={1.6} aria-hidden="true" /> {contact.email.label}
              <ArrowUpRight size={16} aria-hidden="true" />
            </ButtonLink>
            <ResumeLink placement="contact" variant="secondary" />
          </div>
          <address className="contact-details">
            <div>
              <span className="ds-eyebrow">{contact.locationLabel}</span>
              <p>{personal.location}</p>
            </div>
            <div>
              <span className="ds-eyebrow">{contact.phoneLabel}</span>
              <a className="contact-phone" href={contact.phone.href} aria-label={`Call ${personal.name} at ${personal.phone}`}>{contact.phone.label}</a>
            </div>
          </address>
          <ul className="contact-social-links">
            {contact.socialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${personal.name} on ${link.label} (opens in a new tab)`}>
                  {link.label} <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
