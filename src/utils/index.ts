import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ArabicFont } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAudioUrl(
  globalVerseNumber: number,
  reciter: string = "ar.alafasy"
): string {
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalVerseNumber}.mp3`;
}

export function toGlobalVerseNumber(surahId: number, verseId: number): number {

  return verseId; 
}

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

export function formatSurahNumber(num: number): string {
  return String(num).padStart(3, "0");
}

export function toArabicNumerals(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num)
    .split("")
    .map((d) => arabicNumerals[parseInt(d)] ?? d)
    .join("");
}

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

export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

export function getRevelationColor(type: "Meccan" | "Medinan"): string {
  return type === "Meccan" ? "#7C8B45" : "#4A7C8B";
}
