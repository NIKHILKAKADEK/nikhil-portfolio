import type { Metadata } from "next";
import { portfolio } from "@/data/portfolio";
import { getSiteUrl } from "@/lib/site-url";

export const homeTitle = `${portfolio.personal.name} — AI & Data Science`;
export const homeDescription = portfolio.about.introduction;
export const socialPreviewPath = "/social-preview.png";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const siteUrl = getSiteUrl();
  const pageUrl = siteUrl ? new URL(path, siteUrl).href : undefined;
  const images = siteUrl ? [{
    url: new URL(socialPreviewPath, siteUrl).href,
    width: 1200,
    height: 630,
    alt: `${portfolio.personal.name} — ${portfolio.personal.role}`,
  }] : undefined;

  return {
    title,
    description,
    ...(siteUrl ? { metadataBase: siteUrl, alternates: { canonical: pageUrl } } : {}),
    robots: { index: Boolean(siteUrl), follow: Boolean(siteUrl) },
    openGraph: {
      title, description, type: "website", siteName: homeTitle, locale: "en_IN",
      ...(pageUrl ? { url: pageUrl } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image", title, description,
      ...(images ? { images } : {}),
    },
  };
}

export function personStructuredData() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolio.personal.name,
    description: homeDescription,
    email: portfolio.personal.email,
    telephone: portfolio.personal.phone,
    address: portfolio.personal.location,
    sameAs: portfolio.socialLinks.filter(link => link.href.startsWith("https:")).map(link => link.href),
    ...(siteUrl ? { url: siteUrl.href, "@id": new URL("/#person", siteUrl).href } : {}),
  };
}
