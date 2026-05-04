"use client";
import { useSettingsStore, useAudioStore } from "@/store";
import { useWishlistStore } from "@/store/wishlist";
import { useBookmarkStore } from "@/store/bookmarks";
import type { Verse } from "@/features/reader/services/quran-data";
import { AudioButton } from "./AudioButton";
import { Bookmark, Copy, MoreHorizontal, Heart } from "lucide-react";
import { cn } from "@/utils";
import { useState, useEffect } from "react";
import { ShareModal } from "@/components/ui/ShareModal";

interface AyahCardProps {
  verse: Verse;
  surahId: number;
  globalVerseId: number;
  surahName?: string;
}

export function AyahCard({ verse, surahId, globalVerseId, surahName }: AyahCardProps) {
  const { font } = useSettingsStore();
  const { currentAyahId } = useAudioStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { toggleBookmark, isBookmarked } = useBookmarkStore();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [bmAnimating, setBmAnimating] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Hydration-safe checks
  useEffect(() => {
    setSaved(isInWishlist(verse.verse_key));
    setBookmarked(isBookmarked(verse.verse_key));
  }, [isInWishlist, isBookmarked, verse.verse_key]);

  const isPlaying = currentAyahId === globalVerseId;
  // translation is now a plain string (merged from parallel API call)
  const cleanTranslation = verse.translation?.replace(/<[^>]*>/g, "") ?? "";

  const fontFamilyMap: Record<string, string> = {
    kfgq: "'KFGQPC Uthmanic Script HAFS', serif",
    amiri: "var(--font-amiri-quran), var(--font-amiri), serif",
    scheherazade: "var(--font-scheherazade), serif",
    hafs: "'KFGQPC Uthmanic Script HAFS', serif",
  };

  const arabicStyle = {
    fontFamily: fontFamilyMap[font.arabicFont] ?? fontFamilyMap.kfgq,
    fontSize: `${font.arabicFontSize}px`,
    lineHeight: "2.0",
  };

  const transStyle = {
    fontSize: `${font.translationFontSize}px`,
    lineHeight: "1.7",
  };

  const handleCopy = async () => {
    const text = `${verse.text_uthmani}\n\n${cleanTranslation}\n\n[${verse.verse_key}]`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleWishlist = () => {
    setAnimating(true);
    toggleItem({
      id: globalVerseId,
      verse_key: verse.verse_key,
      surah_id: surahId,
      verse_number: verse.verse_number,
      text_uthmani: verse.text_uthmani,
      translation: cleanTranslation,
      surah_name: surahName,
    });
    setSaved(!saved);
    setTimeout(() => setAnimating(false), 400);
  };

  const handleToggleBookmark = () => {
    setBmAnimating(true);
    toggleBookmark({
      id: globalVerseId,
      verse_key: verse.verse_key,
      surah_id: surahId,
      verse_number: verse.verse_number,
      text_uthmani: verse.text_uthmani,
      translation: cleanTranslation,
      surah_name: surahName,
    });
    setBookmarked(!bookmarked);
    setTimeout(() => setBmAnimating(false), 400);
  };

  return (
    <div
      id={`verse-${verse.verse_key}`}
      className={cn(
        "ayah-card group relative border-b border-border/60 py-8 px-6 transition-colors duration-200",
        isPlaying && "bg-accent-green/5 border-l-2 border-l-accent-green"
      )}
    >
      {/* Verse number + action buttons row */}
      <div className="flex items-center justify-between mb-6">
        {/* Verse number badge */}
        <div className="verse-badge text-xs font-semibold" title={`Verse ${verse.verse_number}`}>
          {verse.verse_number}
        </div>

        {/* Action buttons bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg transition-all duration-300">
          <AudioButton
            verseKey={verse.verse_key}
            verseId={globalVerseId}
            surahId={surahId}
            className="hover:scale-110 active:scale-95 transition-transform"
          />
          
          <div className="w-px h-4 bg-white/10 mx-0.5 hidden sm:block" />

          <button
            onClick={handleCopy}
            title="Copy verse"
            className="flex items-center justify-center w-9 h-9 rounded-xl text-text-secondary hover:text-accent-green hover:bg-accent-green/10 transition-all duration-300 active:scale-90"
          >
            {copied ? (
              <span className="text-accent-green text-[10px] font-bold animate-in zoom-in">✓</span>
            ) : (
              <Copy size={16} />
            )}
          </button>

          <button
            onClick={handleToggleWishlist}
            title={saved ? "Remove from saved" : "Save to wishlist"}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-500 group/heart active:scale-90",
              saved
                ? "text-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                : "text-text-secondary hover:text-red-400 hover:bg-red-500/5",
              animating && "animate-ping"
            )}
          >
            <Heart
              size={16}
              className={cn(
                "transition-all duration-300",
                saved ? "fill-current scale-110" : "group-hover/heart:scale-110",
                !saved && "animate-breath"
              )}
            />
          </button>

          <button
            onClick={handleToggleBookmark}
            title={bookmarked ? "Remove bookmark" : "Bookmark this reading position"}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-500 group/bm active:scale-90",
              bookmarked
                ? "text-accent-green bg-accent-green/10 shadow-[0_0_15px_rgba(66,128,56,0.2)]"
                : "text-text-secondary hover:text-accent-green hover:bg-accent-green/5"
            )}
          >
            <Bookmark 
              size={16} 
              className={cn(
                "transition-all duration-300",
                bookmarked ? "fill-current scale-110" : "group-hover/bm:scale-110",
                !bookmarked && "animate-breath"
              )}
            />
          </button>

          <button
            onClick={() => setShowShare(true)}
            title="Share verse"
            className="flex items-center justify-center w-9 h-9 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300 active:scale-90"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        shareUrl={typeof window !== "undefined" ? `${window.location.origin}/reading/${surahId}#verse-${verse.verse_key}` : ""}
        title={`Read Ayah ${verse.verse_key} from Surah ${surahName || surahId} on Quran Guide`}
      />

      {/* Arabic Text */}
      <p
        className="text-text-arabic text-right leading-loose mb-6 direction-rtl"
        style={arabicStyle}
        dir="rtl"
        lang="ar"
      >
        {verse.text_uthmani}
      </p>

      {/* English Translation */}
      {font.showTranslation && (
        <p
          className="text-text-secondary leading-relaxed"
          style={transStyle}
        >
          {cleanTranslation}
        </p>
      )}
    </div>
  );
}
