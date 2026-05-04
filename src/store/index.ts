import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppSettings, SidebarState, PlaybackState } from "@/types";

export type AppTheme = "dark" | "light" | "sepia" | "green" | "red";

// ============================================================
// Default Settings
// ============================================================
const defaultSettings: AppSettings = {
  font: {
    arabicFont: "kfgq",
    arabicFontSize: 32,
    translationFontSize: 16,
    showTranslation: true,
    showTransliteration: false,
    translationLang: "en", // Default to English
  },
  reading: {
    mushafStyle: "madani",
    wordByWord: false,
    autoScroll: false,
  },
  theme: "green" as AppTheme,
};

// ============================================================
// Settings Store — persisted to localStorage
// ============================================================
interface SettingsStore extends AppSettings {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  updateFontSettings: (updates: Partial<AppSettings["font"]>) => void;
  updateReadingSettings: (updates: Partial<AppSettings["reading"]>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      theme: "green" as AppTheme,
      setTheme: (theme) => set({ theme }),
      updateFontSettings: (updates) =>
        set((state) => ({ font: { ...state.font, ...updates } })),
      updateReadingSettings: (updates) =>
        set((state) => ({ reading: { ...state.reading, ...updates } })),
      resetSettings: () => set(defaultSettings),
    }),
    { name: "quran-settings" }
  )
);

// ============================================================
// Audio Store
// ============================================================
interface AudioStore {
  currentAyahId: number | null;
  currentSurahId: number | null;
  currentVerseKey: string | null;   // e.g. "1:1"
  playbackState: PlaybackState;
  duration: number;
  currentTime: number;
  reciter: string;
  // Actions
  startPlaying: (ayahId: number, surahId: number, verseKey: string) => void;
  setPaused: () => void;
  setStopped: () => void;
  setPlaybackState: (state: PlaybackState) => void;
  setProgress: (currentTime: number, duration: number) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  currentAyahId: null,
  currentSurahId: null,
  currentVerseKey: null,
  playbackState: "idle",
  duration: 0,
  currentTime: 0,
  reciter: "ar.alafasy",
  startPlaying: (ayahId, surahId, verseKey) =>
    set({ currentAyahId: ayahId, currentSurahId: surahId, currentVerseKey: verseKey, playbackState: "loading" }),
  setPaused: () => set({ playbackState: "paused" }),
  setStopped: () =>
    set({ currentAyahId: null, currentSurahId: null, currentVerseKey: null, playbackState: "idle", currentTime: 0, duration: 0 }),
  setPlaybackState: (state) => set({ playbackState: state }),
  setProgress: (currentTime, duration) => set({ currentTime, duration }),
}));

// Backwards compat alias (used in AudioButton)
export const setPlaying = (ayahId: number, surahId: number, verseKey: string) =>
  useAudioStore.getState().startPlaying(ayahId, surahId, verseKey);

// ============================================================
// UI / Sidebar Store
// ============================================================
interface UIStore extends SidebarState {
  searchOpen: boolean;
  toggleSurahSidebar: () => void;
  toggleSettingsPanel: () => void;
  setActiveTab: (tab: SidebarState["activeTab"]) => void;
  setSettingsTab: (tab: SidebarState["settingsTab"]) => void;
  openSearch: () => void;
  closeSearch: () => void;
  closeSurahSidebar: () => void;
  closeSettingsPanel: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  surahSidebarOpen: true,
  settingsPanelOpen: false,
  activeTab: "surah",
  settingsTab: "translation",
  searchOpen: false,
  toggleSurahSidebar: () =>
    set((s) => ({ surahSidebarOpen: !s.surahSidebarOpen })),
  toggleSettingsPanel: () =>
    set((s) => ({ settingsPanelOpen: !s.settingsPanelOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSettingsTab: (tab) => set({ settingsTab: tab }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  closeSurahSidebar: () => set({ surahSidebarOpen: false }),
  closeSettingsPanel: () => set({ settingsPanelOpen: false }),
}));
