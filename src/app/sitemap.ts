import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];
  return ["/", ...portfolio.projects.map(project => project.caseStudy)]
    .map(path => ({ url: new URL(path, siteUrl).href }));
}
