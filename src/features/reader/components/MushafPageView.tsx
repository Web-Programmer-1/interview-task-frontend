"use client";
import Link from "next/link";
import { cn } from "@/utils";
import type { PageVerse } from "@/features/reader/services/quran-data";
import { ALQURAN } from "@/features/reader/services/quran-data";
import {
  ChevronLeft, ChevronRight, Maximize2, BookOpen
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSettingsStore } from "@/store";

// Map for fetching translation by language code
const TRANSLATION_MAP: Record<string, string> = {
  en: "en.sahih",
  bn: "bn.bengali",
  hi: "hi.hindi",
  ur: "ur.jalandhry",
  fr: "fr.hamidullah",
  ja: "ja.japanese",
};

interface MushafPageViewProps {
  currentPageNum: number;
  leftVerses: PageVerse[];
  rightVerses: PageVerse[];
  leftPageNum: number;
  rightPageNum: number;
}

// Group verses by surah within a page
function groupBySurah(verses: PageVerse[]) {
  const groups: Map<number, { surahId: number; surahName: string; surahArabic: string; verses: PageVerse[] }> = new Map();
  for (const v of verses) {
    if (!groups.has(v.surah_id)) {
      groups.set(v.surah_id, { surahId: v.surah_id, surahName: v.surah_name, surahArabic: v.surah_arabic, verses: [] });
    }
    groups.get(v.surah_id)!.verses.push(v);
  }
  return Array.from(groups.values());
}

// Convert to Arabic-Indic numerals
function toArabicNum(n: number): string {
  return n.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

// ─────────────────────────────────────────────────────────────
// Surah Banner
// ─────────────────────────────────────────────────────────────
function SurahBanner({ name, arabic, id }: { name: string; arabic: string; id: number }) {
  return (
    <div className="relative flex items-center justify-center my-4">
      {/* Decorative ornamental border */}
      <div
        className="w-[90%] py-3 px-6 flex items-center justify-between rounded-sm"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 20%, rgba(212,175,55,0.3) 50%, rgba(212,175,55,0.15) 80%, transparent 100%)",
          borderTop: "2px solid rgba(212,175,55,0.6)",
          borderBottom: "2px solid rgba(212,175,55,0.6)",
        }}
      >
        <span className="text-[#D4AF37] text-2xl select-none" style={{ fontFamily: "'Amiri', serif" }}>﴾</span>
        <div className="text-center">
          <span
            className="text-xl font-bold text-[#4A3B2C] block drop-shadow-sm"
            style={{ fontFamily: "'Amiri', serif" }}
            lang="ar"
          >
            {arabic}
          </span>
          <span className="text-[10px] text-[#8C7A6B] block mt-1 tracking-widest uppercase font-semibold">
            {name} · Surah {id}
          </span>
        </div>
        <span className="text-[#D4AF37] text-2xl select-none" style={{ fontFamily: "'Amiri', serif" }}>﴿</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bismillah
// ─────────────────────────────────────────────────────────────
function Bismillah({ font }: { font: any }) {
  const fontFamilyMap: Record<string, string> = {
    kfgq: "'KFGQPC Uthmanic Script HAFS', serif",
    amiri: "var(--font-amiri-quran), var(--font-amiri), serif",
    scheherazade: "var(--font-scheherazade), serif",
    hafs: "'KFGQPC Uthmanic Script HAFS', serif",
  };

  return (
    <div className="text-center py-3 my-3">
      <p
        className="text-[#4A3B2C]"
        style={{
          fontFamily: fontFamilyMap[font.arabicFont] ?? fontFamilyMap.kfgq,
          fontSize: `${Math.max(20, font.arabicFontSize * 0.8)}px`,
        }}
        lang="ar"
        dir="rtl"
      >
        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Quran Page Images
// ─────────────────────────────────────────────────────────────
const QURAN_PAGE_IMAGES = [
  "quran_page_01_Al_Fatihah.png",
  "quran_page_02_Al_Baqarah.png",
  "quran_page_03_Al_Baqarah.png",
  "quran_page_04_Al_Baqarah.png",
  "quran_page_05_Al_Baqarah.png",
  "quran_page_06_Al_Baqarah.png",
  "quran_page_07_Al_Baqarah.png",
  "quran_page_08_Al_Imran.png",
  "quran_page_09_Al_Imran.png",
  "quran_page_10_An_Nisa.png",
  "quran_page_11_Al_Maidah.png",
  "quran_page_12_Al_Anam.png",
  "quran_page_13_Al_Araf.png",
  "quran_page_14_Al_Anfal.png",
  "quran_page_15_At_Tawbah.png",
  "quran_page_16_Yunus.png",
  "quran_page_17_Al_Ikhlas.png",
  "quran_page_18_Al_Falaq.png",
  "quran_page_19_An_Nas.png",
  "quran_page_20_Al_Kawthar.png",
];

// ─────────────────────────────────────────────────────────────
// Mushaf Styles Definitions
// ─────────────────────────────────────────────────────────────
const MUSHAF_STYLES: Record<string, {
  paper: string;
  border: string;
  accent: string;
  frameOpacity: number;
  spineOpacity: number;
}> = {
  hafezi: {
    paper: "linear-gradient(to bottom, #fcfcfc, #f5f5f5)",
    border: "#0f4c5c",
    accent: "#D4AF37",
    frameOpacity: 0.4,
    spineOpacity: 0.15,
  },
  qaloon: {
    paper: "linear-gradient(to bottom, #f0f7ff, #e6f0fa)",
    border: "#2b6cb0",
    accent: "#ecc94b",
    frameOpacity: 0.5,
    spineOpacity: 0.1,
  },
  madani: {
    paper: "linear-gradient(to bottom, #fffaf0, #f8f1e5)",
    border: "#2f5233",
    accent: "#D4AF37",
    frameOpacity: 0.3,
    spineOpacity: 0.2,
  },
  nurani: {
    paper: "linear-gradient(to bottom, #fff5f5, #fed7d7)",
    border: "#9b2c2c",
    accent: "#822727",
    frameOpacity: 0.6,
    spineOpacity: 0.3,
  },
  unicode: {
    paper: "linear-gradient(to bottom, #ffffff, #fafafa)",
    border: "#2d3748",
    accent: "#4a5568",
    frameOpacity: 0.2,
    spineOpacity: 0.1,
  },
};

// ─────────────────────────────────────────────────────────────
// Single Page View (Mockup Style with Real Data)
// ─────────────────────────────────────────────────────────────
function MushafPage({
  pageNum,
  verses,
  isRight,
  font,
  styleId = "madani",
}: {
  pageNum: number;
  verses: PageVerse[];
  isRight?: boolean;
  font: any;
  styleId?: string;
}) {
  const surahGroups = useMemo(() => groupBySurah(verses), [verses]);
  const style = MUSHAF_STYLES[styleId] || MUSHAF_STYLES.madani;
  
  // Get header info from first surah on page
  const mainSurah = surahGroups[0];
  const juzNum = verses[0]?.juz_number ?? 1;

  return (
    <div
      className={cn(
        "flex flex-col relative overflow-hidden transition-all duration-700",
        "w-full md:w-[calc(50%-2px)]",
        isRight ? "origin-left" : "origin-right"
      )}
      style={{
        minHeight: "min(85vh, 900px)",
        borderRadius: isRight === undefined ? "16px" : isRight ? "0 16px 16px 0" : "16px 0 0 16px",
        background: style.paper,
        boxShadow: isRight 
          ? "5px 0 30px rgba(0,0,0,0.1), inset 10px 0 20px rgba(0,0,0,0.05)" 
          : "-5px 0 30px rgba(0,0,0,0.1), inset -10px 0 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      
      {/* Dynamic Ornamental Frame */}
      <div 
        className="absolute inset-4 border-[1px] rounded-lg pointer-events-none z-10 transition-colors duration-500"
        style={{ borderColor: `${style.border}${Math.floor(style.frameOpacity * 255).toString(16).padStart(2, '0')}` }}
      />

      {/* Page Content */}
      <div className="flex-1 flex flex-col relative z-20 px-8 sm:px-12 py-10 overflow-y-auto custom-scrollbar">
        
        {/* Page Header (Juz, Page, Surah) */}
        <div className="flex items-center justify-between mb-8 border-b pb-2 transition-colors duration-500" style={{ borderColor: `${style.accent}33` }}>
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: style.border }}>
            Juz {juzNum}
          </div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: style.accent }}>
            Al-Quran Al-Kareem
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: style.border }}>
            {mainSurah?.surahName}
          </div>
        </div>

        {/* Verses Content */}
        <div className="flex-1 text-center">
          {surahGroups.map((group, gIdx) => (
            <div key={group.surahId} className="mb-8">
              {/* Show Surah Banner if it's the start of a surah on this page */}
              {group.verses[0].verse_number === 1 && (
                <>
                  <SurahBanner name={group.surahName} arabic={group.surahArabic} id={group.surahId} />
                  {group.surahId !== 1 && group.surahId !== 9 && <Bismillah font={font} />}
                </>
              )}

              <div 
                className="text-right leading-[2.8] md:leading-[3.2] select-none transition-colors duration-500"
                style={{ 
                  fontFamily: "'KFGQPC Uthmanic Script HAFS', serif",
                  fontSize: `${font.arabicFontSize * 1.1}px`,
                  wordSpacing: "4px",
                  color: "#2C1E14"
                }}
                dir="rtl"
              >
                {group.verses.map((v) => (
                  <span key={v.verse_key} className="inline group/verse cursor-pointer hover:bg-black/5 transition-colors rounded px-1">
                    {v.text_uthmani}
                    <span className="inline-flex items-center justify-center w-8 h-8 mx-2 text-[12px] font-bold relative -top-1" style={{ color: style.accent }}>
                      <span className="absolute inset-0 flex items-center justify-center opacity-30 select-none">۝</span>
                      <span className="relative z-10 text-[10px]">{toArabicNum(v.verse_number)}</span>
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Page Footer */}
        <div className="mt-auto pt-6 text-center">
          <span className="text-[18px] font-bold" style={{ fontFamily: "'Amiri', serif", color: style.border }}>
            ـ {toArabicNum(pageNum)} ـ
          </span>
        </div>
      </div>

      {/* Binding Shadow */}
      <div className={cn(
        "absolute top-0 bottom-0 w-12 pointer-events-none z-30 transition-opacity duration-500",
        isRight 
          ? "left-0 bg-gradient-to-r from-black/20 via-black/5 to-transparent" 
          : "right-0 bg-gradient-to-l from-black/20 via-black/5 to-transparent"
      )} style={{ opacity: style.spineOpacity * 5 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export function MushafPageView({
  currentPageNum,
  leftVerses,
  rightVerses,
  leftPageNum,
  rightPageNum,
}: MushafPageViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { font, reading } = useSettingsStore();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const prevPage = isMobile ? (currentPageNum > 1 ? currentPageNum - 1 : null) : (currentPageNum > 2 ? currentPageNum - 2 : null);
  const nextPage = isMobile ? (currentPageNum < 604 ? currentPageNum + 1 : null) : (currentPageNum < 604 ? currentPageNum + 2 : null);

  return (
    <div className={cn(
      "flex flex-col min-h-full transition-all duration-300",
      isFullscreen ? "fixed inset-0 z-50 bg-[#1a1a1a]" : "bg-bg-primary/30"
    )}>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-3 md:px-6 py-2 md:py-3 border-b border-border bg-bg-primary/80 backdrop-blur-md flex-shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-2 md:gap-3 text-xs md:sm font-medium">
          <div className="hidden sm:flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent-green/10 text-accent-green">
            <BookOpen size={14} />
          </div>
          <span className="text-text-primary">
            Page <strong className="text-accent-green">{isMobile ? currentPageNum : `${leftPageNum}-${rightPageNum}`}</strong> <span className="text-text-muted font-normal">/ 604</span>
          </span>
        </div>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] md:text-xs border border-border hover:bg-bg-elevated transition-colors text-text-secondary"
        >
          <Maximize2 size={12} />
          <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
        </button>
      </div>

      {/* ── Main Display Area ── */}
      <div 
        className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center"
        style={{ 
          background: isFullscreen ? "#121212" : "radial-gradient(var(--border) 0.5px, transparent 0.5px)",
          backgroundSize: "32px 32px" 
        }}
      >
        <div className="w-full max-w-[1300px]">
          
          {isMobile ? (
            /* Mobile: Single Page */
            <div className="flex justify-center">
              <MushafPage pageNum={currentPageNum} verses={leftVerses} font={font} styleId={reading.mushafStyle} />
            </div>
          ) : (
            /* Desktop: Double Spread */
            <div
              className="relative flex justify-center rounded-2xl mx-auto overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
              style={{
                padding: "8px",
                gap: "2px",
                background: "#2a2118", // Dark leather binding feel
              }}
            >
              {/* Central Spine Binding Overlay */}
              <div
                className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 z-40 bg-black/40 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              />
              
              <MushafPage pageNum={leftPageNum} verses={leftVerses} isRight={false} font={font} styleId={reading.mushafStyle} />
              <MushafPage pageNum={rightPageNum} verses={rightVerses} isRight={true} font={font} styleId={reading.mushafStyle} />
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex items-center justify-center gap-4 md:gap-8 mt-10 pb-8">
            {prevPage !== null ? (
              <Link
                href={`/reading/page/${prevPage}`}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-text-primary hover:bg-accent-green hover:text-white transition-all shadow-lg active:scale-95"
              >
                <ChevronLeft size={18} />
                <span>Previous</span>
              </Link>
            ) : <div className="w-32" />}

            {nextPage !== null ? (
              <Link
                href={`/reading/page/${nextPage}`}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-text-primary hover:bg-accent-green hover:text-white transition-all shadow-lg active:scale-95"
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </Link>
            ) : <div className="w-32" />}
          </div>
        </div>
      </div>
    </div>
  );
}
