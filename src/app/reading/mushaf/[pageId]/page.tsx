import { MushafPageView } from "@/features/reader/components/MushafPageView";
import { getPageVerses, generatePageParams } from "@/features/reader/services/quran-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ pageId: string }>;
}

export async function generateStaticParams() {
  return generatePageParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageId } = await params;
  const num = Number(pageId);
  return {
    title: `Page ${num} | Quran Mushaf`,
    description: `Read Quran Page ${num} in Uthmani Mushaf script`,
  };
}

export default async function MushafPage({ params }: Props) {
  const { pageId } = await params;
  const pageNum = Number(pageId);

  if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) notFound();

  // Fetch current page and next page in parallel for double spread
  const [leftVerses, rightVerses] = await Promise.all([
    getPageVerses(pageNum),
    pageNum > 1 ? getPageVerses(pageNum - 1) : Promise.resolve([]),
  ]);

  if (!leftVerses.length) notFound();

  return (
    <MushafPageView
      currentPageNum={pageNum}
      leftVerses={pageNum > 1 ? rightVerses : leftVerses}
      rightVerses={pageNum > 1 ? leftVerses : leftVerses}
      leftPageNum={pageNum > 1 ? pageNum - 1 : pageNum}
      rightPageNum={pageNum}
    />
  );
}
