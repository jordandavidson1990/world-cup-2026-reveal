import React from "react";
import ThemeToggle from "./ThemeToggle";

type Props = {
  theme: "light" | "dark";
  onToggle: () => void;
  onStart: () => void;
  isPlaying: boolean;
  onToggleMusic: () => void;
};

export const StartScreen = ({
  theme,
  onToggle,
  onStart,
  isPlaying,
  onToggleMusic,
}: Props) => {
  const steps = [
    { emoji: "💔", label: "Eliminated players" },
    { emoji: "✨", label: "Remaining players" },
    { emoji: "🗓️", label: "Fixtures & dates" },
    { emoji: "🥁", label: "Wooden spoon countdown" },
    { emoji: "🍴", label: "Full table" },
  ];

  return (
    <main className="container">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          <h1>🏆 World Cup Sweep Night</h1>
          <p className="hero-sub">2026 SP World Cup Sweepstake Update</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              transition: "transform 0.1s ease",
            }}
            title={isPlaying ? "Mute Music" : "Play Music"}
          >
            {isPlaying ? "🎵" : "🔇"}
          </button>
          <ThemeToggle theme={theme} onToggle={onToggle} />
        </div>
      </div>

      <section
        className="card card-lg"
        style={{
          marginTop: 24,
          position: "relative",
          overflow: "hidden",
          padding: "36px 32px 32px",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(to right, var(--primary), var(--accent))",
          }}
        />

        {/* Header */}
        <p
          style={{
            margin: 0,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Tonight&apos;s running order
        </p>
        <h2
          className="fun-title"
          style={{
            marginTop: 10,
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            lineHeight: 1,
          }}
        >
          Welcome 👋
        </h2>

        {/* Divider */}
        <div
          style={{ margin: "24px 0", height: 1, background: "var(--border)" }}
        />

        {/* Steps Stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background:
                  "color-mix(in srgb, var(--primary) 4%, var(--card))",
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  lineHeight: 1,
                  width: 32,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {step.emoji}
              </span>
              <span style={{ fontWeight: 700, fontSize: 15 }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          style={{
            marginTop: 28,
            width: "100%",
            padding: "14px 24px",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            borderRadius: 12,
            border: "none",
            background:
              "linear-gradient(135deg, var(--primary), var(--accent))",
            color: "#fff",
            cursor: "pointer",
            transition: "opacity 0.2s ease, transform 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Start the show ▶
        </button>
      </section>
    </main>
  );
};

export default StartScreen;
