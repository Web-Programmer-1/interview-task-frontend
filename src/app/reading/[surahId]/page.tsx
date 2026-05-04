import { getSurahMeta, getSurahVerses, generateSurahParams } from "@/features/reader/services/quran-data";
import { SurahHeader } from "@/features/reader/components/SurahHeader";
import { AyahListClient } from "@/features/reader/components/AyahListClient";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ surahId: string }>;
}

// SSG: pre-render all 114 surah pages at build time
export async function generateStaticParams() {
  return generateSurahParams();
}

// Dynamic SEO metadata per surah
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { surahId } = await params;
  const id = Number(surahId);
  if (isNaN(id) || id < 1 || id > 114) return { title: "Not Found" };

  const surah = await getSurahMeta(id);
  return {
    title: `${surah.name_simple} (${surah.name_arabic}) | Surah ${id}`,
    description: `Read Surah ${surah.name_simple} — ${surah.name_arabic}. ${surah.translated_name?.name}. ${surah.verses_count} verses. ${surah.revelation_place === "makkah" ? "Meccan" : "Medinan"} surah.`,
  };
}

export default async function SurahPage({ params }: Props) {
  const { surahId } = await params;
  const id = Number(surahId);

  if (isNaN(id) || id < 1 || id > 114) notFound();

  const [surah, verses] = await Promise.all([
    getSurahMeta(id),
    getSurahVerses(id),
  ]);

  // Calculate global verse offset for audio URLs
  // We use verse_key "surahId:verseNum" directly
  const prevId = id > 1 ? id - 1 : null;
  const nextId = id < 114 ? id + 1 : null;

  return (
    <article className="max-w-3xl mx-auto">
      {/* Surah Header Banner */}
      <SurahHeader surah={surah} />

      {/* Ayah List */}
      <AyahListClient initialVerses={verses} surahId={id} surahName={surah.name_simple} />

      {/* Navigation: Prev / Next Surah */}
      <div className="flex items-center justify-between gap-4 p-6 border-t border-border">
        {prevId ? (
          <Link
            href={`/reading/${prevId}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg-card text-text-secondary hover:text-white hover:border-border-light hover:bg-bg-hover transition-all text-sm group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Surah {prevId}</span>
          </Link>
        ) : <div />}

        {nextId && (
          <Link
            href={`/reading/${nextId}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg-card text-text-secondary hover:text-white hover:border-border-light hover:bg-bg-hover transition-all text-sm group"
          >
            <span>Surah {nextId}</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </article>
  );
}
