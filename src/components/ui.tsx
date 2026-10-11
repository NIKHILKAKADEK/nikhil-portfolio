import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "quiet";
type TagTone = "default" | "accent";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  asChild?: never;
}

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return <button className={`ds-button ds-button-${variant} ${className}`.trim()} {...props} />;
}

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
}

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  return <a className={`ds-button ds-button-${variant} ${className}`.trim()} {...props} />;
}

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
  children: ReactNode;
}

export function Tag({ className = "", tone = "default", ...props }: TagProps) {
  return <span className={`ds-tag ${tone === "accent" ? "ds-tag-accent" : ""} ${className}`.trim()} {...props} />;
}

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`ds-card ${className}`.trim()} {...props} />;
}

export function FloatingPanel({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`ds-floating-panel ${className}`.trim()} {...props} />;
}

export function DisplayHeading({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={`ds-display ${className}`.trim()} {...props} />;
}

export function SectionHeading({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={`ds-heading ${className}`.trim()} {...props} />;
}

export function BodyText({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`ds-body ${className}`.trim()} {...props} />;
}

export function MutedText({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`ds-muted ${className}`.trim()} {...props} />;
}
