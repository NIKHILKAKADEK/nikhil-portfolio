import { ArrowUpRight, Download } from "lucide-react";
import { ButtonLink, type ButtonLinkProps } from "@/components/ui";
import { portfolio } from "@/data/portfolio";

interface ResumeLinkProps extends Omit<ButtonLinkProps, "href" | "children" | "target" | "rel" | "download"> {
  placement?: "nav" | "hero" | "contact";
}

export function ResumeLink({ placement = "nav", className = "", ...props }: ResumeLinkProps) {
  const { resume, personal } = portfolio;
  if (!resume.available) {
    return <span className={`resume-pending ${className}`} aria-disabled="true">{resume.pendingLabel}</span>;
  }

  const download = placement === "contact";
  const label = download ? resume.downloadLabel : placement === "hero" ? resume.heroLabel : resume.navLabel;
  const Icon = download ? Download : ArrowUpRight;

  return (
    <ButtonLink
      {...props}
      className={className}
      href={resume.href}
      download={download ? resume.downloadName : undefined}
      target={download ? undefined : "_blank"}
      rel={download ? undefined : "noopener noreferrer"}
      aria-label={`${label}: ${personal.name} (PDF${download ? "" : ", opens in a new tab"})`}
    >
      {label} <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
    </ButtonLink>
  );
}
