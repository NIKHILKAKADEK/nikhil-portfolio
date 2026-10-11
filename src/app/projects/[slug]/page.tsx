import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study";
import { Footer } from "@/components/footer";
import { portfolio } from "@/data/portfolio";
import { pageMetadata } from "@/lib/seo";

type RouteParams = { slug: string };

export function generateStaticParams() {
  return portfolio.projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolio.projects.find((item) => item.id === slug);
  if (!project) notFound();
  return pageMetadata(`${project.title} | ${portfolio.personal.name}`, project.description, project.caseStudy);
}

export default async function ProjectPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const project = portfolio.projects.find((item) => item.id === slug);
  if (!project) notFound();
  return <><CaseStudy project={project} /><Footer /></>;
}
