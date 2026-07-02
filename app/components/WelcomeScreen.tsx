"use client";

import React from "react";
import ThemeToggle from "./ThemeToggle";

type Props = {
  theme: "light" | "dark";
  onToggle: () => void;
  onStart: () => void;
  isPlaying: boolean;
  onToggleMusic: () => void;
};

export const WelcomeScreen = ({
  theme,
  onToggle,
  onStart,
  isPlaying,
  onToggleMusic,
}: Props) => {
  return (
    <main
      className="container"
      style={{ maxWidth: "600px", margin: "0 auto", padding: "60px 20px" }}
    >
      {/* Structural Controls Header */}
      <div
        className="row"
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <button
          onClick={onToggleMusic}
          style={{
            background: "color-mix(in srgb, var(--primary) 6%, var(--card))",
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
            transition: "transform 0.15s ease",
          }}
          title={isPlaying ? "Mute Music" : "Play Music"}
        >
          {isPlaying ? "🎵" : "🔇"}
        </button>
        <ThemeToggle theme={theme} onToggle={onToggle} />
      </div>

      {/* Main Presentation Showcase Card */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "48px 40px 40px",
          borderRadius: "20px",
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.05)",
          textAlign: "center",
        }}
      >
        {/* Dual Accent Strip (Spanish Crimson & Gold Inspired) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: "linear-gradient(to right, #dc2626 50%, #eab308 50%)",
          }}
        />

        {/* Presenter Overhead Badge */}
        <div
          style={{
            display: "inline-block",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#dc2626",
            background: "color-mix(in srgb, #dc2626 8%, transparent)",
            padding: "6px 16px",
            borderRadius: "30px",
            marginBottom: 28,
          }}
        >
          ¡Hola! Soy Jordan.
        </div>

        {/* Main Broadcast Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
            lineHeight: 1.05,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: "0 auto 24px",
            maxWidth: "90%",
            color: "var(--text)",
          }}
        >
          ¡Bienvenidos a la actualización del sorteo de la Copa del Mundo dos
          mil veintiséis!
        </h1>

        {/* Divider Details */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            margin: "32px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span
            style={{ fontSize: "14px", opacity: 0.2, letterSpacing: "4px" }}
          >
            🏆
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* Dramatic Hook Statement */}
        <p
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            letterSpacing: "-0.3px",
            color: "var(--text)",
            margin: "0 0 36px 0",
            opacity: 0.9,
          }}
        >
          ¡Veamos quién gana...{" "}
          <span style={{ color: "var(--muted)", fontWeight: 400 }}>
            y quién pierde!
          </span>
        </p>

        {/* Presentation Launch Control */}
        <button
          onClick={onStart}
          style={{
            width: "100%",
            padding: "18px 32px",
            fontSize: "15px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            borderRadius: "12px",
            border: "none",
            background: theme === "dark" ? "#ffffff" : "#111827",
            color: theme === "dark" ? "#111827" : "#ffffff",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
            transition:
              "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.15)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Comenzar Sorteo ▶
        </button>
      </section>
    </main>
  );
};

export default WelcomeScreen;
