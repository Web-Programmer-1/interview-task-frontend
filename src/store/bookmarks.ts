import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BookmarkItem {
  id: number;               // Global verse ID
  verse_key: string;        // "1:1"
  surah_id: number;
  verse_number: number;
  text_uthmani: string;     // First few words or full text
  translation: string;
  surah_name?: string;
  savedAt: number;          // Timestamp
}

interface BookmarkStore {
  items: BookmarkItem[];
  addBookmark: (item: Omit<BookmarkItem, "savedAt">) => void;
  removeBookmark: (verseKey: string) => void;
  toggleBookmark: (item: Omit<BookmarkItem, "savedAt">) => void;
  clearAll: () => void;
  isBookmarked: (verseKey: string) => boolean;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      items: [],
      addBookmark: (item) =>
        set((state) => {
          // Prevent duplicates
          if (state.items.some((i) => i.verse_key === item.verse_key)) {
            return state;
          }
          return {
            items: [{ ...item, savedAt: Date.now() }, ...state.items],
          };
        }),
      removeBookmark: (verseKey) =>
        set((state) => ({
          items: state.items.filter((i) => i.verse_key !== verseKey),
        })),
      toggleBookmark: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.verse_key === item.verse_key);
          if (exists) {
            return {
              items: state.items.filter((i) => i.verse_key !== item.verse_key),
            };
          } else {
            return {
              items: [{ ...item, savedAt: Date.now() }, ...state.items],
            };
          }
        }),
      clearAll: () => set({ items: [] }),
      isBookmarked: (verseKey) => get().items.some((i) => i.verse_key === verseKey),
    }),
    {
      name: "quran-bookmarks",
    }
  )
);
