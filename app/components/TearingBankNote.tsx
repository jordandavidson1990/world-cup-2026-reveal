"use client";

import React, { useRef, useState } from "react";

interface TearingBanknoteProps {
  imgSrc?: string;
}

const TearingBanknote: React.FC<TearingBanknoteProps> = ({
  imgSrc = "/mctominay-note.webp",
}) => {
  const [isTorn, setIsTorn] = useState(false);
  const rippingAudioRef = useRef<HTMLAudioElement | null>(null);

  const playRippingSound = () => {
    if (!rippingAudioRef.current) return;

    rippingAudioRef.current.volume = 1.0;
    rippingAudioRef.current.currentTime = 0;
    rippingAudioRef.current
      .play()
      .catch((err) => console.log("Ripping SFX blocked or failed:", err));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <audio ref={rippingAudioRef} src="/ripping.mp3" preload="auto" />
      {/* Note Container - Expanded height slightly to allow room for the pieces to drop and rest */}
      <div
        style={{
          position: "relative",
          width: "500px",
          height: "320px",
          perspective: "1000px",
        }}
      >
        {/* LEFT HALF */}
        <div
          className={isTorn ? "rip-left" : ""}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "50%",
            height: "265px",
            overflow: "hidden",
            transformOrigin: "bottom right",
            boxShadow: "2px 4px 12px rgba(0,0,0,0.15)",
            zIndex: 2,
          }}
        >
          <img
            src={imgSrc}
            alt="Left half of banknote"
            style={{
              width: "200%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Torn Edge Visual */}
          {isTorn && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "6px",
                height: "100%",
                background:
                  "linear-gradient(to bottom, var(--background) 50%, transparent 50%)",
                backgroundSize: "12px 12px",
                opacity: 0.9,
              }}
            />
          )}
        </div>

        {/* RIGHT HALF */}
        <div
          className={isTorn ? "rip-right" : ""}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "50%",
            height: "265px",
            overflow: "hidden",
            transformOrigin: "bottom left",
            boxShadow: "-2px 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1,
          }}
        >
          <img
            src={imgSrc}
            alt="Right half of banknote"
            style={{
              width: "200%",
              height: "100%",
              objectFit: "cover",
              marginLeft: "-100%",
              display: "block",
            }}
          />
        </div>
      </div>

      <button
        onClick={() => {
          playRippingSound();
          setIsTorn(!isTorn);
        }}
        style={{
          background: isTorn ? "var(--border)" : "var(--primary, #000)",
          color: isTorn ? "var(--text)" : "#fff",
          border: "none",
          padding: "10px 24px",
          borderRadius: "20px",
          cursor: "pointer",
          fontWeight: "600",
          transition: "background 0.2s",
        }}
      >
        {isTorn ? "Tape It Back Together 🩹" : "Rip the Cash! ⚡"}
      </button>

      {/* Modified Sticky Keyframes */}
      <style jsx>{`
        .rip-left {
          animation: tearLeft 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.1)
            forwards;
        }
        .rip-right {
          animation: tearRight 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.1)
            forwards;
        }

        @keyframes tearLeft {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          30% {
            transform: translate(-15px, -5px) rotate(-2deg);
          }
          100% {
            /* Kept opacity at 100% and reduced drop distance so it rests visibly */
            transform: translate(-45px, 35px) rotate(-8deg);
          }
        }

        @keyframes tearRight {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -2px) rotate(1deg);
          }
          100% {
            /* Separates out to the right and drops slightly further down for an organic split */
            transform: translate(55px, 45px) rotate(12deg);
          }
        }
      `}</style>
    </div>
  );
};

export default TearingBanknote;
