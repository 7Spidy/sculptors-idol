import { notFound } from "next/navigation";
import { regionBySlug, regions } from "@/lib/content";
import ChapterClient from "./ChapterClient";

export function generateStaticParams() {
  return regions.map((r) => ({ slug: r.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;
  const region = regionBySlug[slug];

  if (!region) return notFound();

  return <ChapterClient region={region} />;
}
