"use client";

import React from "react";

interface MusicButtonProps {
  isPlaying: boolean;
  onToggleMusic: (e: React.MouseEvent) => void;
}

const MusicButton: React.FC<MusicButtonProps> = ({
  isPlaying,
  onToggleMusic,
}) => {
  return (
    <button
      onClick={onToggleMusic}
      style={{
        background: "color-mix(in srgb, var(--primary) 6%, var(--card, #fff))",
        border: "1px solid var(--border)",
        borderRadius: "50%",
        width: 40,
        height: 40,
        cursor: "pointer",
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        transition: "transform 0.1s ease",
        position: "relative",
        zIndex: 20,
      }}
      title={isPlaying ? "Mute Music" : "Play Music"}
    >
      {isPlaying ? "🎵" : "🔇"}
    </button>
  );
};

export default MusicButton;
