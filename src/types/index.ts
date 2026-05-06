

export interface Surah {
  id: number;
  name: string;           
  transliteration: string; 
  translation: string;    
  type: "Meccan" | "Medinan";
  total_verses: number;
  pages: [number, number]; 
}

export interface Ayah {
  id: number;             
  surah_id: number;
  verse_number: number;   
  arabic_text: string;    
  translation: string;    
  audio_url?: string;     
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

export type ArabicFont =
  | "kfgq"
  | "amiri"
  | "scheherazade"
  | "hafs";

export interface FontSettings {
  arabicFont: ArabicFont;
  arabicFontSize: number;    
  translationFontSize: number; 
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

export type PlaybackState = "idle" | "loading" | "playing" | "paused" | "error";

export interface AudioState {
  currentAyahId: number | null;
  currentSurahId: number | null;
  playbackState: PlaybackState;
  duration: number;
  currentTime: number;
  reciter: string;
}

export interface SidebarState {
  surahSidebarOpen: boolean;
  settingsPanelOpen: boolean;
  activeTab: "surah" | "juz" | "page";
  settingsTab: "translation" | "reading";
}
