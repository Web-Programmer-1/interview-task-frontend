"use client";
import { useAudioStore } from "@/store";
import { Play, Pause, Square, Volume2, VolumeX, Loader2, Music2 } from "lucide-react";
import { cn } from "@/utils";
import { useState } from "react";

export function AudioBar() {
  const {
    currentAyahId, currentSurahId, playbackState,
    duration, currentTime,
    setStopped, setPaused,
  } = useAudioStore();

  const [volume, setVolume] = useState(100);

  const isVisible = currentAyahId !== null;
  const isPlaying = playbackState === "playing";
  const isLoading = playbackState === "loading";
  const isPaused = playbackState === "paused";

  const handlePlayPause = () => {
    if (isPlaying) {
      setPaused();
    } else if (isPaused) {
      useAudioStore.setState({ playbackState: "playing" });
    }
  };

  const handleStop = () => setStopped();

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn(
        "hidden md:flex flex-shrink-0 items-center gap-3 px-4 border-t border-border bg-bg-sidebar",
        "transition-all duration-300 overflow-hidden",
        isVisible ? "h-[60px] opacity-100" : "h-0 border-0 opacity-0"
      )}
    >
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(66,128,56,0.2)", border: "1px solid rgba(66,128,56,0.3)" }}
      >
        {isLoading ? (
          <Loader2 size={14} className="text-accent-green animate-spin" />
        ) : (
          <Music2 size={14} className="text-accent-green" />
        )}
      </div>

      {/* Info */}
      <div className="w-36 flex-shrink-0">
        <p className="text-xs font-medium text-text-primary truncate">
          Ayah {currentAyahId}
        </p>
        <p className="text-[10px] text-text-muted">Surah {currentSurahId} · Al-Afasy</p>
      </div>

      {/* Play / Pause / Stop */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handlePlayPause}
          disabled={isLoading || (!isPlaying && !isPaused)}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center",
            "border border-accent-green text-accent-green",
            "hover:bg-accent-green hover:text-white transition-all",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play size={16} className="ml-0.5" />
          )}
        </button>
        <button
          onClick={handleStop}
          className="w-7 h-7 rounded-full flex items-center justify-center border border-border text-icon hover:text-white hover:border-border-light transition-all"
          title="Stop"
        >
          <Square size={12} />
        </button>
      </div>

      {/* Progress */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-[10px] text-text-muted flex-shrink-0 w-8 text-right">
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 relative h-1.5 rounded-full bg-bg-elevated overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-accent-green rounded-full transition-all duration-100"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] text-text-muted flex-shrink-0 w-8">
          {formatTime(duration)}
        </span>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 flex-shrink-0 w-28">
        <Volume2 size={14} className="text-icon flex-shrink-0" />
        <input
          type="range" min={0} max={100} step={5}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 h-1 accent-accent-green"
        />
      </div>
    </div>
  );
}
