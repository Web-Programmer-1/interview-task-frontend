"use client";
/**
 * AudioEngine — singleton audio element managed globally.
 * Mounted once in the reading layout. All AudioButtons
 * trigger it via Zustand store actions.
 */
import { useEffect, useRef } from "react";
import { useAudioStore } from "@/store";
import { getAudioUrl } from "@/features/reader/services/quran-data";

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentVerseKey, playbackState, setPlaybackState, setStopped, setProgress } =
    useAudioStore();

  // Init audio element once
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    audio.addEventListener("timeupdate", () => {
      setProgress(audio.currentTime, audio.duration || 0);
    });
    audio.addEventListener("ended", () => setStopped());
    audio.addEventListener("error", () => setStopped());

    return () => {
      audio.pause();
    };
  }, []); // eslint-disable-line

  // React to verseKey changes (new ayah selected)
  useEffect(() => {
    if (!currentVerseKey || !audioRef.current) return;
    const audio = audioRef.current;

    audio.pause();
    audio.src = getAudioUrl(currentVerseKey);
    audio.load();

    const onCanPlay = () => {
      setPlaybackState("playing");
      audio.play().catch(() => setStopped());
    };
    audio.addEventListener("canplay", onCanPlay, { once: true });
  }, [currentVerseKey]); // eslint-disable-line

  // React to pause/resume from AudioBar controls
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (playbackState === "paused") {
      audio.pause();
    } else if (playbackState === "playing" && audio.paused && currentVerseKey) {
      audio.play().catch(() => setStopped());
    }
  }, [playbackState]); // eslint-disable-line

  return null; // No UI, just audio logic
}
