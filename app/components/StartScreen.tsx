"use client";

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
    { emoji: "🥄", label: "Wooden spoon prize" },
    { emoji: "🍴", label: "Full table" },
  ];

  return (
    <main className="container">
      {/* Top Header Row */}
      <div
        className="row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "3rem",
              letterSpacing: "0.5px",
              margin: 0,
            }}
          >
            🏆 World Cup Sweep
          </h1>
          <p
            className="hero-sub"
            style={{
              opacity: 0.6,
              fontSize: "0.9rem",
              marginTop: 4,
              letterSpacing: "0.05em",
            }}
          >
            2026 SP Live Presentation
          </p>
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
              transition: "transform 0.15s ease",
            }}
            title={isPlaying ? "Mute Music" : "Play Music"}
          >
            {isPlaying ? "🎵" : "🔇"}
          </button>
          <ThemeToggle theme={theme} onToggle={onToggle} />
        </div>
      </div>

      {/* Main Presentation Layout Card */}
      <section
        className="card card-lg"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "36px 32px 32px",
          borderRadius: "16px",
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Sleek Linear Accent Bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(to right, var(--primary), var(--accent, #eab308))",
          }}
        />

        {/* Running Order Status Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              fontWeight: 600,
            }}
          >
            Tonight&apos;s Running Order
          </p>
        </div>

        <h2
          className="fun-title"
          style={{
            marginTop: 14,
            fontSize: "2.2rem",
            lineHeight: 1,
            fontFamily: "var(--font-display)",
          }}
        >
          Welcome 👋
        </h2>

        {/* Divider */}
        <div
          style={{ margin: "24px 0", height: 1, background: "var(--border)" }}
        />

        {/* Steps Stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              className="sleek-step-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 18px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background:
                  "color-mix(in srgb, var(--primary) 3%, var(--card))",
                transition:
                  "transform 0.2s ease, border-color 0.2s, background 0.2s",
                cursor: "default",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  opacity: 0.3,
                  width: "16px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: 20,
                  lineHeight: 1,
                  width: 28,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {step.emoji}
              </span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "-0.1px",
                }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Launch Control */}
        <button
          onClick={onStart}
          style={{
            marginTop: 32,
            width: "100%",
            padding: "16px 24px",
            fontSize: "15px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            borderRadius: "12px",
            border: "none",
            background:
              "linear-gradient(135deg, var(--primary), var(--accent, #000))",
            color: "#fff",
            cursor: "pointer",
            transition: "transform 0.15s ease, filter 0.15s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.08)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Start the Show ▶
        </button>
      </section>

      {/* Micro-interaction Hover Scope */}
      <style jsx global>{`
        .sleek-step-row:hover {
          transform: translateX(3px);
          border-color: var(--text);
          background: color-mix(
            in srgb,
            var(--primary) 6%,
            var(--card)
          ) !important;
        }
      `}</style>
    </main>
  );
};

export default StartScreen;
