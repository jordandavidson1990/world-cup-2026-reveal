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

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {remaining.map((r) => (
          <div
            key={r.entrant.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "color-mix(in srgb, var(--success) 5%, var(--card))",
            }}
          >
            {/* Name */}
            <span
              style={{
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.02em",
                minWidth: 90,
              }}
            >
              {r.entrant.name}
            </span>

            {/* Divider pip */}
            <span
              style={{ color: "var(--border)", fontSize: 18, lineHeight: 1 }}
            >
              ·
            </span>

            {/* Teams */}
            <span
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                flex: 1,
              }}
            >
              {r.activeTeams.map((t) => (
                <span
                  key={t.code}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 14,
                  }}
                >
                  <span style={{ fontSize: 16 }}>
                    {codeToFlagEmoji(t.code)}
                  </span>
                  {t.name}
                </span>
              ))}
            </span>

            {/* Badge */}
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--success)",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ✓ In
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
