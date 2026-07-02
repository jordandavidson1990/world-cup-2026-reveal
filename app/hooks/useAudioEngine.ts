"use client";

import { useState, useRef, RefObject } from "react";

export const useAudioEngine = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const elimAudioRef = useRef<HTMLAudioElement | null>(null);
  const cheerAudioRef = useRef<HTMLAudioElement | null>(null);
  const moneyAudioRef = useRef<HTMLAudioElement | null>(null);
  const squidGameEliminationRef = useRef<HTMLAudioElement | null>(null);

  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const triggerSound = (
    ref: RefObject<HTMLAudioElement | null>,
    debugName = "SFX"
  ) => {
    const audio = ref.current;
    if (!audio) return;

    audio.volume = 1.0;
    audio.currentTime = 0;
    audio
      .play()
      .catch((err) => console.log(`${debugName} SFX blocked or failed:`, err));
  };

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

  const stopAllFades = () => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
  };

  const playSfx = () => {
    stopAllFades();
    triggerSound(elimAudioRef, "Elimination");
  };

  const playCheer = () => triggerSound(cheerAudioRef, "Cheer");
  const playMoney = () => triggerSound(moneyAudioRef, "Money");

  const handleSfxTimeUpdate = () => {
    const audio = elimAudioRef.current;
    if (!audio || audio.paused) return;

    const fadeWindow = 0.3;

    if (
      audio.duration &&
      audio.duration > fadeWindow &&
      audio.currentTime > audio.duration - fadeWindow &&
      audio.volume > 0.95
    ) {
      stopAllFades();

      let currentVolume = 1.0;
      fadeIntervalRef.current = setInterval(() => {
        currentVolume -= 0.1;
        if (currentVolume <= 0) {
          audio.volume = 0;
          audio.pause();
          stopAllFades();
        } else {
          audio.volume = currentVolume;
        }
      }, 30);
    }
  };

  const playSquidGameEliminationSound = () => {
    triggerSound(squidGameEliminationRef, "Elimination");
  };

  return {
    audioRef,
    elimAudioRef,
    cheerAudioRef,
    moneyAudioRef,
    isPlaying,
    toggleMusic,
    playSfx,
    playCheer,
    playMoney,
    handleSfxTimeUpdate,
    stopAllFades,
    playSquidGameEliminationSound,
    squidGameEliminationRef,
  };
};
