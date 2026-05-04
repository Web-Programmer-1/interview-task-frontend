// AlQuran.cloud API — free, no API key needed, returns Arabic + Translation together
export const ALQURAN = "https://api.alquran.cloud/v1";
// Local Backend for metadata and ayahs
export const BACKEND_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const QURAN_COM = BACKEND_API; // Redirect metadata calls to local backend

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface SurahMeta {
  id: number;
  name_arabic: string;
  name_simple: string;
  name_complex: string;
  translated_name: { name: string };
  verses_count: number;
  revelation_place: string;
  page_start: number;
  page_end: number;
  bismillah_pre: boolean;
}

export interface Verse {
  id: number;             // global verse number
  verse_number: number;   // verse within surah
  verse_key: string;      // "1:1"
  text_uthmani: string;   // Arabic text
  translation: string;    // English (Saheeh International)
}

// ─────────────────────────────────────────────────────────────
// All 114 Surahs (from Quran.com — rich metadata)
// ─────────────────────────────────────────────────────────────
export async function getAllSurahs(): Promise<SurahMeta[]> {
  try {
    const res = await fetch(`${BACKEND_API}/surahs`, {
      next: { revalidate: 86400 },
    });
    const data = await res.json();
    
    if (!Array.isArray(data)) {
      console.error("Backend did not return an array for surahs:", data);
      return [];
    }

    // Map camelCase to snake_case for frontend compatibility
    return data.map((s: any) => ({
      id: s.id,
      name_arabic: s.nameArabic,
      name_simple: s.nameSimple,
      name_complex: s.nameComplex,
      translated_name: { name: s.nameTranslation },
      verses_count: s.versesCount,
      revelation_place: s.revelationPlace,
      page_start: s.pageStart,
      page_end: s.pageEnd,
      bismillah_pre: s.bismillahPre
    })) as SurahMeta[];
  } catch (error) {
    console.error("Failed to fetch surahs:", error);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// Single Surah Metadata
// ─────────────────────────────────────────────────────────────
export async function getSurahMeta(id: number): Promise<SurahMeta> {
  const res = await fetch(`${BACKEND_API}/surahs/${id}`, {
    next: { revalidate: 86400 },
  });
  const s = await res.json();
  return {
    id: s.id,
    name_arabic: s.nameArabic,
    name_simple: s.nameSimple,
    name_complex: s.nameComplex,
    translated_name: { name: s.nameTranslation },
    verses_count: s.versesCount,
    revelation_place: s.revelationPlace,
    page_start: s.pageStart,
    page_end: s.pageEnd,
    bismillah_pre: s.bismillahPre
  } as SurahMeta;
}

// ─────────────────────────────────────────────────────────────
// Fetch verses: Arabic + Translation in parallel
// ─────────────────────────────────────────────────────────────
export async function getSurahVerses(surahId: number): Promise<Verse[]> {
  try {
    const res = await fetch(`${BACKEND_API}/surahs/${surahId}/ayahs`, {
      next: { revalidate: 86400 },
    });
    const data = await res.json();
    
    if (!Array.isArray(data)) {
      console.error(`Backend did not return an array for surah ${surahId} verses:`, data);
      return [];
    }
    
    return data.map((a: any) => ({
      id: a.id,
      verse_number: a.verseNumber,
      verse_key: a.verseKey,
      text_uthmani: a.textUthmani,
      translation: a.translation,
    })) as Verse[];
  } catch (error) {
    console.error(`Failed to fetch verses for surah ${surahId}:`, error);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// Search Verses (Quran.com search)
// ─────────────────────────────────────────────────────────────
export async function searchVerses(query: string) {
  if (!query.trim()) return [];
  const res = await fetch(
    `${QURAN_COM}/search?q=${encodeURIComponent(query)}&size=20&page=1&language=en`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return (data.search?.results ?? []) as {
    verse_key: string;
    text: string;
    translations: { text: string; name: string }[];
  }[];
}

// ─────────────────────────────────────────────────────────────
// SSG: generate params for all 114 surah pages
// ─────────────────────────────────────────────────────────────
export function generateSurahParams() {
  return Array.from({ length: 114 }, (_, i) => ({ surahId: String(i + 1) }));
}

// SSG: generate params for all 604 mushaf pages
export function generatePageParams() {
  return Array.from({ length: 604 }, (_, i) => ({ pageId: String(i + 1) }));
}

// ─────────────────────────────────────────────────────────────
// Audio URL — EveryAyah CDN (free, no key)
// ─────────────────────────────────────────────────────────────
export function getAudioUrl(verseKey: string): string {
  const [s, v] = verseKey.split(":").map(Number);
  const key = `${String(s).padStart(3, "0")}${String(v).padStart(3, "0")}`;
  return `https://verses.quran.com/Alafasy/mp3/${key}.mp3`;
}

// ─────────────────────────────────────────────────────────────
// Page Verse — verse info for Mushaf page view
// ─────────────────────────────────────────────────────────────
export interface PageVerse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  translation: string;
  surah_id: number;
  surah_name: string;
  surah_arabic: string;
  juz_number: number;
  page_number: number;
}

// Fetch all verses on a Quran page (page 1-604)
// Uses alquran.cloud API
export async function getPageVerses(pageNum: number): Promise<PageVerse[]> {
  const [arabicRes, transRes] = await Promise.all([
    fetch(`${ALQURAN}/page/${pageNum}/quran-uthmani`, { next: { revalidate: 86400 } }),
    fetch(`${ALQURAN}/page/${pageNum}/en.sahih`, { next: { revalidate: 86400 } }),
  ]);
  
  const [arabicData, transData] = await Promise.all([
    arabicRes.json(),
    transRes.json(),
  ]);
  
  const ayahs = arabicData.data?.ayahs ?? [];
  const transAyahs = transData.data?.ayahs ?? [];
  
  return ayahs.map((a: any, i: number) => ({
    id: a.number,
    verse_number: a.numberInSurah,
    verse_key: `${a.surah.number}:${a.numberInSurah}`,
    text_uthmani: a.text,
    translation: transAyahs[i]?.text ?? "",
    surah_id: a.surah.number,
    surah_name: a.surah.englishName,
    surah_arabic: a.surah.name,
    juz_number: a.juz,
    page_number: a.page,
  }));
}

