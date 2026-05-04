import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================================
// Wishlist Item — saved verse data
// ============================================================
export interface WishlistItem {
  id: number;               // global verse number
  verse_key: string;         // "1:1"
  surah_id: number;
  verse_number: number;
  text_uthmani: string;      // Arabic text
  translation: string;       // English
  surah_name?: string;       // e.g. "Al-Fatiha"
  savedAt: number;           // timestamp
}

// ============================================================
// Wishlist Store — persisted to localStorage
// ============================================================
interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "savedAt">) => void;
  removeItem: (verseKey: string) => void;
  toggleItem: (item: Omit<WishlistItem, "savedAt">) => void;
  isInWishlist: (verseKey: string) => boolean;
  clearAll: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          // Don't add duplicates
          if (state.items.some((i) => i.verse_key === item.verse_key)) {
            return state;
          }
          return {
            items: [{ ...item, savedAt: Date.now() }, ...state.items],
          };
        }),

      removeItem: (verseKey) =>
        set((state) => ({
          items: state.items.filter((i) => i.verse_key !== verseKey),
        })),

      toggleItem: (item) => {
        const exists = get().items.some((i) => i.verse_key === item.verse_key);
        if (exists) {
          get().removeItem(item.verse_key);
        } else {
          get().addItem(item);
        }
      },

      isInWishlist: (verseKey) =>
        get().items.some((i) => i.verse_key === verseKey),

      clearAll: () => set({ items: [] }),
    }),
    { name: "quran-wishlist" }
  )
);
