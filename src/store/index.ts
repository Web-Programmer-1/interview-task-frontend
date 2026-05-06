import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppSettings, SidebarState, PlaybackState } from "@/types";

export type AppTheme = "dark" | "light" | "sepia" | "green" | "red";

const defaultSettings: AppSettings = {
  font: {
    arabicFont: "kfgq",
    arabicFontSize: 32,
    translationFontSize: 16,
    showTranslation: true,
    showTransliteration: false,
    translationLang: "en", 
  },
  reading: {
    mushafStyle: "madani",
    wordByWord: false,
    autoScroll: false,
  },
  theme: "green" as AppTheme,
};

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

interface AudioStore {
  currentAyahId: number | null;
  currentSurahId: number | null;
  currentVerseKey: string | null;   
  playbackState: PlaybackState;
  duration: number;
  currentTime: number;
  reciter: string;
  
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

export const setPlaying = (ayahId: number, surahId: number, verseKey: string) =>
  useAudioStore.getState().startPlaying(ayahId, surahId, verseKey);

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
