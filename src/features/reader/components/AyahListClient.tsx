"use client";
import { useState, useEffect } from "react";
import { useSettingsStore } from "@/store";
import { AyahCard } from "./AyahCard";
import { useGetAyahsBySurahQuery, type Verse } from "@/store/redux/apiSlice";

interface AyahListClientProps {
  initialVerses: Verse[];
  surahId: number;
  surahName: string;
}

const TRANSLATION_MAP: Record<string, string> = {
  en: "en.sahih",
  bn: "bn.bengali",
  hi: "hi.hindi",
  ur: "ur.jalandhry",
  fr: "fr.hamidullah",
  ja: "ja.japanese",
};

export function AyahListClient({ initialVerses, surahId, surahName }: AyahListClientProps) {
  const { font } = useSettingsStore();
  const { data: backendVerses, isLoading: isBackendLoading } = useGetAyahsBySurahQuery(surahId);
  
  const [verses, setVerses] = useState<Verse[]>(initialVerses);
  const [loading, setLoading] = useState(false);

  // Synchronize with backend data when it arrives
  useEffect(() => {
    if (backendVerses) {
      setVerses(backendVerses);
    }
  }, [backendVerses]);

  useEffect(() => {
    // Only fetch external translation if NOT English (assuming backend is English)
    // Or if you want to allow switching. 
    if (font.translationLang === "en" || !TRANSLATION_MAP[font.translationLang]) {
      if (backendVerses) setVerses(backendVerses);
      else setVerses(initialVerses);
      return;
    }

    let isMounted = true;
    const fetchTranslation = async () => {
      setLoading(true);
      try {
        const edition = TRANSLATION_MAP[font.translationLang];
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/${edition}`);
        const data = await res.json();
        
        if (data.data?.ayahs && isMounted) {
          const transAyahs = data.data.ayahs;
          // Merge new translation text into our verses
          const sourceVerses = backendVerses || initialVerses;
          const updatedVerses = sourceVerses.map((v, i) => ({
            ...v,
            translation: transAyahs[i]?.text ?? "",
          }));
          setVerses(updatedVerses);
        }
      } catch (error) {
        console.error("Failed to fetch translation:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTranslation();

    return () => {
      isMounted = false;
    };
  }, [font.translationLang, surahId, initialVerses, backendVerses]);

  const showLoading = loading || isBackendLoading;

  return (
    <div className={showLoading ? "opacity-50 transition-opacity duration-300 pointer-events-none" : "transition-opacity duration-300"}>
      {verses.map((verse) => (
        <AyahCard
          key={verse.id}
          verse={verse}
          surahId={surahId}
          globalVerseId={verse.id}
          surahName={surahName}
        />
      ))}
    </div>
  );
}
