
export const ALQURAN = "https://api.alquran.cloud/v1";

// Priority: Environment Variable, then Hardcoded Fallback
export const BACKEND_API = process.env.NEXT_PUBLIC_API_URL || "https://interview-task-backend-nu.vercel.app/api";
export const QURAN_COM = BACKEND_API; 

// Helper to fetch with a timeout and retries to handle backend cold starts
async function fetchWithTimeout(url: string, options: any = {}, timeout = 15000, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      
      if (!response.ok && i < retries && response.status >= 500) {
        console.warn(`Attempt ${i + 1} failed with status ${response.status}. Retrying...`);
        continue; // Retry on server errors
      }
      
      return response;
    } catch (error) {
      clearTimeout(id);
      if (i === retries) throw error;
      console.warn(`Attempt ${i + 1} timed out or failed. Retrying in 1s...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Failed to fetch after retries");
}

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
  id: number;             
  verse_number: number;   
  verse_key: string;      
  text_uthmani: string;   
  translation: string;    
}

export async function getAllSurahs(): Promise<SurahMeta[]> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_API}/surahs`, {
      next: { revalidate: 86400 },
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const data = await res.json();
    
    if (!Array.isArray(data)) {
      console.error("Backend did not return an array for surahs:", data);
      return [];
    }

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

export async function getSurahMeta(id: number): Promise<SurahMeta> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_API}/surahs/${id}`, {
      next: { revalidate: 86400 },
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
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
  } catch (error) {
    console.error(`Failed to fetch surah meta for ${id}:`, error);
    // Return a minimal fallback object to prevent page crash
    return { id, name_simple: "Error loading", name_arabic: "" } as SurahMeta;
  }
}

export async function getSurahVerses(surahId: number): Promise<Verse[]> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_API}/surahs/${surahId}/ayahs`, {
      next: { revalidate: 86400 },
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
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

export async function searchVerses(query: string) {
  if (!query.trim()) return [];
  try {
    const res = await fetchWithTimeout(
      `${QURAN_COM}/search?q=${encodeURIComponent(query)}&size=20&page=1&language=en`,
      { cache: "no-store" }
    );
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return (data.search?.results ?? []) as {
      verse_key: string;
      text: string;
      translations: { text: string; name: string }[];
    }[];
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}

export function generateSurahParams() {
  return Array.from({ length: 114 }, (_, i) => ({ surahId: String(i + 1) }));
}

export function generatePageParams() {
  return Array.from({ length: 604 }, (_, i) => ({ pageId: String(i + 1) }));
}

export function getAudioUrl(verseKey: string): string {
  const [s, v] = verseKey.split(":").map(Number);
  const key = `${String(s).padStart(3, "0")}${String(v).padStart(3, "0")}`;
  return `https://verses.quran.com/Alafasy/mp3/${key}.mp3`;
}

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

