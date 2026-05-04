"use client";
import { useAudioStore } from "@/store";
import { Play, Pause, Loader2 } from "lucide-react";
import { cn } from "@/utils";

interface AudioButtonProps {
  verseKey: string;   // "1:1"
  verseId: number;    // global verse id
  surahId: number;
  className?: string;
}

export function AudioButton({ verseKey, verseId, surahId, className }: AudioButtonProps) {
  const { currentAyahId, playbackState, startPlaying, setPaused, setStopped } = useAudioStore();

  const isThisAyah = currentAyahId === verseId;
  const isPlaying = isThisAyah && playbackState === "playing";
  const isPaused = isThisAyah && playbackState === "paused";
  const isLoading = isThisAyah && playbackState === "loading";

  const handleClick = () => {
    if (isPlaying) {
      // Pause this ayah
      setPaused();
      return;
    }
    if (isPaused) {
      // Resume — set back to playing state (AudioEngine will resume)
      useAudioStore.setState({ playbackState: "playing" });
      return;
    }
    // Stop any current and play this ayah
    startPlaying(verseId, surahId, verseKey);
  };

  return (
    <button
      onClick={handleClick}
      title={isPlaying ? "Pause recitation" : "Play recitation"}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300",
        "relative overflow-hidden group/audio",
        isPlaying 
          ? "bg-accent-green text-white shadow-[0_0_15px_rgba(66,128,56,0.3)] animate-pulse-soft" 
          : "text-text-secondary hover:text-accent-green hover:bg-accent-green/10",
        isLoading && "opacity-80 cursor-wait",
        className
      )}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isPlaying ? (
        <Pause size={16} className="fill-current" />
      ) : (
        <Play size={16} className="ml-0.5 fill-current group-hover/audio:scale-110 transition-transform" />
      )}
    </button>
  );
}
