import { EntrantResult } from "../types";
import { codeToFlagEmoji } from "../utils/codeToFlagEmoji";

export default function RevealCard({
  result,
}: {
  result: EntrantResult | null;
  mode: "eliminated" | "remaining";
}) {
  if (!result) {
    return <div className="card card-lg">No one to reveal in this stage.</div>;
  }

  const isEliminated = result.isEliminated;

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
          background: isEliminated ? "var(--danger)" : "var(--success)",
        }}
      />

      {/* Eyebrow */}
      <p
        style={{
          margin: 0,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        Eliminated reveal
      </p>

      {/* Name */}
      <h2
        className="fun-title"
        style={{
          marginTop: 10,
          fontSize: "clamp(2rem, 5vw, 3.2rem)",
          lineHeight: 1,
          letterSpacing: "0.04em",
        }}
      >
        {result.entrant.name}
      </h2>

      {/* Status badge */}
      <div style={{ marginTop: 14 }}>
        <span
          className={`badge ${isEliminated ? "badge-out" : "badge-in"}`}
          style={{ fontSize: 13, padding: "7px 16px" }}
        >
          {isEliminated ? "💀 Eliminated" : "✅ Still In"}
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          margin: "24px 0",
          height: 1,
          background: "var(--border)",
        }}
      />

      {/* Eliminated teams */}
      {result.eliminatedTeams.length > 0 && (
        <div>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Teams knocked out
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {result.eliminatedTeams.map((t) => (
              <div
                key={t.code}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background:
                    "color-mix(in srgb, var(--danger) 6%, var(--card))",
                }}
              >
                <span style={{ fontSize: 22, lineHeight: 1 }}>
                  {codeToFlagEmoji(t.code)}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    letterSpacing: "0.02em",
                  }}
                >
                  {t.name}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--danger)",
                    fontWeight: 700,
                  }}
                >
                  Out
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.eliminatedTeams.length === 0 && (
        <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
          No teams eliminated yet.
        </p>
      )}
    </div>
  );
}
