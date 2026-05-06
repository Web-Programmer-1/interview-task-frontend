"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/store";
import { getAudioUrl } from "@/features/reader/services/quran-data";

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentVerseKey, playbackState, setPlaybackState, setStopped, setProgress } =
    useAudioStore();

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
  }, []); 

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
  }, [currentVerseKey]); 

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (playbackState === "paused") {
      audio.pause();
    } else if (playbackState === "playing" && audio.paused && currentVerseKey) {
      audio.play().catch(() => setStopped());
    }
  }, [playbackState]); 

  return null; 
}
