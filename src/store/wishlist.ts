import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: number;               
  verse_key: string;         
  surah_id: number;
  verse_number: number;
  text_uthmani: string;      
  translation: string;       
  surah_name?: string;       
  savedAt: number;           
}

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
