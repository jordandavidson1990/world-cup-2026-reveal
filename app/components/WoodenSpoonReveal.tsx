import { TeamTournamentStats } from "../types";
import { entrants } from "../data/sweep";
import { codeToFlagEmoji } from "../utils/codeToFlagEmoji";
import { buildOwnerMap } from "../utils/buildOwnerMap";

type Theme = "light" | "dark";

type Props = {
  teamStats: Record<string, TeamTournamentStats>;
  revealIndex: number;
  teamNames?: Record<string, string>;
  theme: Theme;
};

type Row = {
  code: string;
  name: string;
  owners: string[];
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};

const REVEAL_COUNT = 10;

const toNum = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

function fullCountryName(
  code: string,
  teamNames: Record<string, string>
): string {
  const key = String(code || "")
    .trim()
    .toUpperCase();
  const name = teamNames[key];
  return name && name.trim().length > 0 ? name : "Unknown country";
}

function buildWorstRows(
  teamStats: Record<string, TeamTournamentStats>,
  teamNames: Record<string, string>,
  ownerMap: Map<string, string[]>
): Row[] {
  const rows: Row[] = Object.keys(teamStats).map((rawCode) => {
    const code = String(rawCode).trim().toUpperCase();
    const raw = teamStats[rawCode] ?? {
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    };

    const points = toNum(raw.points);
    const goalsFor = toNum(raw.goalsFor);
    const goalsAgainst = toNum(raw.goalsAgainst);
    const goalDifference = goalsFor - goalsAgainst;

    return {
      code,
      name: fullCountryName(code, teamNames),
      owners: ownerMap.get(code) ?? [],
      points,
      goalsFor,
      goalsAgainst,
      goalDifference,
    };
  });

  rows.sort((a, b) => {
    if (a.points !== b.points) return a.points - b.points;
    if (a.goalDifference !== b.goalDifference)
      return a.goalDifference - b.goalDifference;
    if (a.goalsFor !== b.goalsFor) return a.goalsFor - b.goalsFor;
    return a.name.localeCompare(b.name);
  });

  return rows;
}

export default function WoodenSpoonReveal({
  teamStats,
  revealIndex,
  teamNames = {},
  theme,
}: Props) {
  const isDark = theme === "dark";
  const ownerMap = buildOwnerMap(entrants);
  const rows = buildWorstRows(teamStats, teamNames, ownerMap);

  const bottomN = rows.slice(0, Math.min(REVEAL_COUNT, rows.length));
  const total = bottomN.length;

  const safeRevealIndex = Math.max(0, revealIndex);
  const shownCount = Math.min(safeRevealIndex, total);

  // i=0 → most recently revealed (top, highlighted)
  const revealedRows =
    shownCount > 0
      ? Array.from({ length: shownCount }, (_, i) => ({
          row: bottomN[total - 1 - i],
          rank: total - i,
        })).reverse()
      : [];

  const hasMore = shownCount < total;
  const nextRank = total - shownCount;

  // Theme-aware tokens
  const t = {
    shell: isDark ? "#0d0d0d" : "#f8f6f1",
    shellBorder: isDark ? "1px solid #1e1e1e" : "1px solid var(--border)",
    eyebrow: isDark ? "#666" : "#94a3b8",
    headline: isDark ? "#f0ebe0" : "var(--fg)",
    sub: isDark ? "#555" : "#94a3b8",
    gold: isDark ? "#c8a83a" : "#a07820",
    goldBg: isDark ? "rgba(200,168,58,0.06)" : "rgba(160,120,32,0.07)",
    goldBorder: isDark ? "rgba(200,168,58,0.3)" : "rgba(160,120,32,0.35)",
    oldBg: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)",
    oldBorder: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)",
    rankNew: isDark ? "#c8a83a" : "#a07820",
    rankOld: isDark ? "#444" : "#c4bfb0",
    nameNew: isDark ? "#f0ebe0" : "var(--fg)",
    nameOld: isDark ? "#888" : "#94a3b8",
    ownerNew: isDark ? "#888" : "#94a3b8",
    ownerOld: isDark ? "#555" : "#c4bfb0",
    statsNew: isDark ? "#777" : "#64748b",
    statsOld: isDark ? "#444" : "#c4bfb0",
    ptsNew: isDark ? "#c8a83a" : "#a07820",
    ptsOld: isDark ? "#444" : "#c4bfb0",
    divider: isDark
      ? "linear-gradient(to right, transparent, #333 20%, #333 80%, transparent)"
      : "linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)",
    nextColor: isDark ? "#444" : "#94a3b8",
    empty: isDark ? "#444" : "#94a3b8",
  };

  return (
    <div
      style={{
        background: t.shell,
        border: t.shellBorder,
        color: isDark ? "#e8e4dc" : "var(--fg)",
        padding: "28px 24px 32px",
        borderRadius: 16,
        fontFamily: "'Inter', sans-serif",
        boxShadow: isDark
          ? "0 0 0 1px #1e1e1e, 0 24px 48px rgba(0,0,0,0.6)"
          : "0 12px 32px rgba(0,0,0,0.09)",
      }}
    >
      {/* Header */}
      <p
        style={{
          margin: "0 0 6px",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: t.eyebrow,
        }}
      >
        Sweep · Wooden Spoon
      </p>
      <h3
        style={{
          margin: "0 0 4px",
          fontFamily: "var(--font-display), Impact, sans-serif",
          fontSize: 42,
          letterSpacing: "0.04em",
          color: t.headline,
          lineHeight: 1,
        }}
      >
        Bottom {total}
      </h3>
      <p
        style={{
          margin: "0 0 28px",
          fontSize: 12,
          color: t.sub,
          letterSpacing: "0.06em",
        }}
      >
        Revealed worst to least worst
      </p>

      {/* Stack */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {revealedRows.length === 0 ? (
          <p
            style={{
              fontSize: 13,
              color: t.empty,
              textAlign: "center",
              padding: "24px 0",
              letterSpacing: "0.06em",
              margin: 0,
            }}
          >
            Awaiting first reveal…
          </p>
        ) : (
          revealedRows.map(({ row, rank }, i) => {
            const isNew = i === 0;
            return (
              <div
                key={row.code}
                style={{
                  borderRadius: 10,
                  padding: "14px 16px",
                  display: "grid",
                  gridTemplateColumns: "44px 1fr auto",
                  gap: "0 14px",
                  alignItems: "center",
                  border: `1px solid ${isNew ? t.goldBorder : t.oldBorder}`,
                  background: isNew ? t.goldBg : t.oldBg,
                  opacity: isNew ? 1 : 0.6,
                  transition: "opacity 0.4s ease",
                }}
              >
                {/* Rank */}
                <div
                  style={{
                    fontFamily: "var(--font-display), Impact, sans-serif",
                    fontSize: isNew ? 32 : 24,
                    color: isNew ? t.rankNew : t.rankOld,
                    lineHeight: 1,
                    textAlign: "center",
                  }}
                >
                  #{rank}
                </div>

                {/* Flag + name + owner */}
                <div>
                  <div style={{ fontSize: 22, lineHeight: 1, marginBottom: 2 }}>
                    {codeToFlagEmoji(row.code)}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display), Impact, sans-serif",
                      fontSize: 22,
                      letterSpacing: "0.05em",
                      color: isNew ? t.nameNew : t.nameOld,
                      lineHeight: 1.1,
                    }}
                  >
                    {row.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: isNew ? t.ownerNew : t.ownerOld,
                      marginTop: 2,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {row.owners.length ? row.owners.join(", ") : "—"}
                  </div>
                </div>

                {/* Stats */}
                <div
                  style={{
                    textAlign: "right",
                    fontSize: 11,
                    color: isNew ? t.statsNew : t.statsOld,
                    lineHeight: 1.7,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display), Impact, sans-serif",
                      fontSize: isNew ? 20 : 16,
                      color: isNew ? t.ptsNew : t.ptsOld,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {row.points} pts
                  </div>
                  <div>
                    GD{" "}
                    {row.goalDifference >= 0
                      ? `+${row.goalDifference}`
                      : row.goalDifference}
                  </div>
                  <div>
                    {row.goalsFor} — {row.goalsAgainst}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {revealedRows.length > 0 && (
        <>
          <div style={{ height: 1, background: t.divider, margin: "20px 0" }} />
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: t.nextColor,
              textAlign: "center",
              margin: 0,
            }}
          >
            {hasMore ? (
              <>
                Next reveal · Rank{" "}
                <span style={{ color: t.gold, fontWeight: 500 }}>
                  #{nextRank}
                </span>
              </>
            ) : (
              <>
                All revealed ·{" "}
                <span style={{ color: t.gold, fontWeight: 500 }}>
                  Wooden spoon: {revealedRows[revealedRows.length - 1].row.name}
                </span>
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
}
