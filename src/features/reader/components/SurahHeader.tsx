"use client";
import type { SurahMeta } from "@/features/reader/services/quran-data";
import { useSettingsStore } from "@/store";

interface SurahHeaderProps {
  surah: SurahMeta;
}

export function SurahHeader({ surah }: SurahHeaderProps) {
  const { font } = useSettingsStore();

  const revelationLabel =
    surah.revelation_place === "makkah" ? "Meccan" : "Medinan";

  const fontFamilyMap: Record<string, string> = {
    kfgq: "'KFGQPC Uthmanic Script HAFS', serif",
    amiri: "var(--font-amiri-quran), var(--font-amiri), serif",
    scheherazade: "var(--font-scheherazade), serif",
  };
  const bismillahFont = fontFamilyMap[font.arabicFont] ?? fontFamilyMap.kfgq;

  return (
    <div className="relative mb-2">
      {/* Banner card */}
      <div
        className="mx-6 my-6 rounded-2xl overflow-hidden relative shadow-sm"
        style={{
          background: "linear-gradient(135deg, var(--bg-card) 0%, var(--color-accent-muted) 100%)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-accent-green-muted opacity-50" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-accent-green-muted opacity-50" />

        <div className="relative z-10 flex flex-col items-center py-10 px-6 text-center">
          {/* Arabic Surah Name */}
          <h1
            className="text-5xl font-bold text-text-primary mb-3"
            style={{ fontFamily: "'Amiri Quran', 'Amiri', serif" }}
            lang="ar"
            dir="rtl"
          >
            {surah.name_arabic}
          </h1>

          {/* English name */}
          <p className="text-accent-green-light text-lg font-semibold mb-1 tracking-wide">
            {surah.name_simple}
          </p>
          <p className="text-text-muted text-sm mb-6">
            {surah.translated_name?.name}
          </p>

          {/* Divider */}
          <div
            className="w-32 h-px mb-6"
            style={{ background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)" }}
          />

          {/* Stats row */}
          <div className="flex items-center gap-8 text-sm">
            <div className="flex flex-col items-center gap-1">
              <span className="text-text-muted text-xs uppercase tracking-widest">Surah</span>
              <span className="text-text-primary font-semibold">{String(surah.id).padStart(3, "0")}</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-text-muted text-xs uppercase tracking-widest">Verses</span>
              <span className="text-text-primary font-semibold">{surah.verses_count}</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-text-muted text-xs uppercase tracking-widest">Revelation</span>
              <span
                className="font-semibold text-xs px-2 py-0.5 rounded-full text-accent-green"
                style={{
                  background: "var(--color-accent-muted)",
                }}
              >
                {revelationLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bismillah (all surahs except Al-Tawbah #9) */}
      {surah.bismillah_pre && (
        <div className="text-center py-4 px-6 mb-2">
          <p
            className="text-text-arabic"
            style={{ 
              fontFamily: bismillahFont,
              fontSize: `${Math.max(28, font.arabicFontSize * 0.9)}px` // Scale relative to reading font
            }}
            dir="rtl"
            lang="ar"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}
    </div>
  );
}
