import { EntrantResult } from "../types";
import { codeToFlagEmoji } from "../utils/codeToFlagEmoji";

export default function RemainingList({
  remaining,
}: {
  remaining: EntrantResult[];
}) {
  return (
    <div
      className="card card-lg"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "32px 28px 28px",
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
          background: "var(--success)",
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
        Still in the tournament
      </p>
      <h2
        className="fun-title"
        style={{
          marginTop: 10,
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          lineHeight: 1,
          letterSpacing: "0.04em",
        }}
      >
        {remaining.length} Players Remaining
      </h2>

      {/* Divider */}
      <div
        style={{ margin: "24px 0", height: 1, background: "var(--border)" }}
      />

      {/* Responsive Grid Layout Wrapper */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {remaining.map((r) => (
          <div
            key={r.entrant.id}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              padding: "18px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "color-mix(in srgb, var(--success) 3%, var(--card))",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            {/* Header Row: Player Name & Status Badge */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  letterSpacing: "0.01em",
                }}
              >
                {r.entrant.name}
              </span>
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--success)",
                  fontWeight: 700,
                }}
              >
                ✓ In
              </span>
            </div>

            {/* Subtle Inner Card Divider */}
            <div
              style={{ height: 1, background: "var(--border)", opacity: 0.5 }}
            />

            {/* Teams Block */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--muted)",
                  fontWeight: 600,
                }}
              >
                Active Teams
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {r.activeTeams.map((t) => (
                  <div
                    key={t.code}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      background: "var(--background)",
                      padding: "4px 10px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span style={{ fontSize: 14 }}>
                      {codeToFlagEmoji(t.code)}
                    </span>
                    <span style={{ fontWeight: 500 }}>{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
