import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ArabicFont } from "@/types";

// ============================================================
// Class name utility
// ============================================================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// Audio URL Generator (EveryAyah / Islamic Network CDN)
// ============================================================
export function getAudioUrl(
  globalVerseNumber: number,
  reciter: string = "ar.alafasy"
): string {
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalVerseNumber}.mp3`;
}

// Convert surah + verse to global verse number
export function toGlobalVerseNumber(surahId: number, verseId: number): number {
  // Simple approach: use verse_key format for Islamic Network API
  // The global verse number is precomputed from Quran data
  return verseId; // Will be populated from DB
}

// ============================================================
// Font Family CSS variable mapper
// ============================================================
export function getArabicFontClass(font: ArabicFont): string {
  const fontMap: Record<ArabicFont, string> = {
    kfgq: "font-arabic-kfgq",
    amiri: "font-arabic-amiri",
    scheherazade: "font-arabic-scheherazade",
    hafs: "font-arabic-kfgq",
  };
  return fontMap[font];
}

export function getArabicFontFamily(font: ArabicFont): string {
  const fontMap: Record<ArabicFont, string> = {
    kfgq: "KFGQPC Uthmanic Script HAFS",
    amiri: "Amiri Quran",
    scheherazade: "Scheherazade New",
    hafs: "KFGQPC Uthmanic Script HAFS",
  };
  return fontMap[font];
}

// ============================================================
// Format surah number with leading zero
// ============================================================
export function formatSurahNumber(num: number): string {
  return String(num).padStart(3, "0");
}

// ============================================================
// Format verse number in Arabic-Indic numerals
// ============================================================
export function toArabicNumerals(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num)
    .split("")
    .map((d) => arabicNumerals[parseInt(d)] ?? d)
    .join("");
}

// ============================================================
// Debounce utility
// ============================================================
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ============================================================
// Highlight search match in text
// ============================================================
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

// ============================================================
// Surah revelation type color
// ============================================================
export function getRevelationColor(type: "Meccan" | "Medinan"): string {
  return type === "Meccan" ? "#7C8B45" : "#4A7C8B";
}
