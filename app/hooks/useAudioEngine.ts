"use client";

import { useState, useRef } from "react";

export const useAudioEngine = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const elimAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMusic = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) =>
          console.error("Background music playback failed:", err)
        );
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playSfx = () => {
    if (!elimAudioRef.current) return;

    // Clear active fades if sounds are triggered concurrently
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    elimAudioRef.current.volume = 1.0;
    elimAudioRef.current.currentTime = 0;
    elimAudioRef.current
      .play()
      .catch((err) => console.log("SFX blocked or failed:", err));
  };

  const handleSfxTimeUpdate = () => {
    const audio = elimAudioRef.current;
    if (!audio || audio.paused) return;

    const fadeWindow = 0.3; // Seconds before tail-end to begin fade out

    if (
      audio.duration &&
      audio.duration > fadeWindow &&
      audio.currentTime > audio.duration - fadeWindow &&
      audio.volume > 0.95
    ) {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

      let currentVolume = 1.0;

      fadeIntervalRef.current = setInterval(() => {
        currentVolume -= 0.1;
        if (currentVolume <= 0) {
          audio.volume = 0;
          audio.pause();
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        } else {
          audio.volume = currentVolume;
        }
      }, 30);
    }
  };

  const stopAllFades = () => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
  };

  return {
    audioRef,
    elimAudioRef,
    isPlaying,
    toggleMusic,
    playSfx,
    handleSfxTimeUpdate,
    stopAllFades,
  };
};
