// ============================================================
// Quran App — TypeScript Types
// ============================================================

export interface Surah {
  id: number;
  name: string;           // Arabic name (e.g. الفَاتِحَة)
  transliteration: string; // (e.g. Al-Fatiha)
  translation: string;    // English translation (e.g. The Opening)
  type: "Meccan" | "Medinan";
  total_verses: number;
  pages: [number, number]; // [start_page, end_page]
}

export interface Ayah {
  id: number;             // Global verse number (1–6236)
  surah_id: number;
  verse_number: number;   // Local verse number within surah
  arabic_text: string;    // Arabic text (Unicode)
  translation: string;    // English translation
  audio_url?: string;     // Audio URL from CDN
}

export interface Juz {
  id: number;
  name: string;
  first_verse: { surah: number; verse: number };
  last_verse: { surah: number; verse: number };
  verses_count: number;
}

export interface SearchResult {
  surah_id: number;
  surah_name: string;
  surah_transliteration: string;
  verse_number: number;
  arabic_text: string;
  translation: string;
  match_field: "arabic" | "translation";
}

// ============================================================
// Settings Types
// ============================================================
export type ArabicFont =
  | "kfgq"
  | "amiri"
  | "scheherazade"
  | "hafs";

export interface FontSettings {
  arabicFont: ArabicFont;
  arabicFontSize: number;    // 18–60 (px)
  translationFontSize: number; // 12–24 (px)
  showTranslation: boolean;
  showTransliteration: boolean;
  translationLang: string;
}

export interface ReadingSettings {
  mushafStyle: "unicode" | "hafezi" | "madani" | "nurani" | "qaloon";
  wordByWord: boolean;
  autoScroll: boolean;
}

export interface AppSettings {
  font: FontSettings;
  reading: ReadingSettings;
  theme: "dark" | "light" | "sepia" | "green" | "red";
}

// ============================================================
// Audio Types
// ============================================================
export type PlaybackState = "idle" | "loading" | "playing" | "paused" | "error";

export interface AudioState {
  currentAyahId: number | null;
  currentSurahId: number | null;
  playbackState: PlaybackState;
  duration: number;
  currentTime: number;
  reciter: string;
}

// ============================================================
// UI State Types
// ============================================================
export interface SidebarState {
  surahSidebarOpen: boolean;
  settingsPanelOpen: boolean;
  activeTab: "surah" | "juz" | "page";
  settingsTab: "translation" | "reading";
}
