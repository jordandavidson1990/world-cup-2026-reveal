import { TeamTournamentStats } from "../types";
import { entrants } from "../data/sweep";
import { codeToFlagEmoji } from "../utils/codeToFlagEmoji";
import { buildOwnerMap } from "../utils/buildOwnerMap";

type Props = {
  teamStats: Record<string, TeamTournamentStats>;
  revealIndex: number; // 0 = show none, then 1..10 reveals rank 10 -> 1
  teamNames?: Record<string, string>;
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
  teamNames: Record<string, string>,
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
  ownerMap: Map<string, string[]>,
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
}: Props) {
  const ownerMap = buildOwnerMap(entrants);
  const rows = buildWorstRows(teamStats, teamNames, ownerMap);

  const bottomN = rows.slice(0, Math.min(REVEAL_COUNT, rows.length));
  const total = bottomN.length;

  const safeRevealIndex = Math.max(0, revealIndex);
  const shownCount = Math.min(safeRevealIndex, total);

  const currentRow = shownCount > 0 ? bottomN[total - shownCount] : null;
  const currentRank = currentRow ? total - shownCount + 1 : null;
  const hasMore = shownCount < total + 1;
  const nextRankNumber = total - shownCount;

  return (
    <div className="card card-lg">
      <h3 className="fun-title">Wooden Spoon Reveal</h3>
      <p className="fun-subtitle">
        Revealing bottom {total} one at a time (rank 10 to rank 1).
      </p>

      <div style={{ marginTop: 16 }}>
        {!currentRow ? (
          <p>No team revealed yet.</p>
        ) : (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "14px 16px",
              background:
                "color-mix(in srgb, var(--card) 94%, var(--primary) 6%)",
            }}
          >
            <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>
              Rank {currentRank}
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 700 }}>
              {codeToFlagEmoji(currentRow.code)} {currentRow.name}
            </p>
            <p style={{ margin: "6px 0 0", opacity: 0.9 }}>
              Owner:{" "}
              {currentRow.owners.length ? currentRow.owners.join(", ") : "—"}
            </p>
            <p style={{ margin: "6px 0 0", opacity: 0.85 }}>
              {currentRow.points} pts • GD {currentRow.goalDifference} • GF{" "}
              {currentRow.goalsFor} • GA {currentRow.goalsAgainst}
            </p>
          </div>
        )}
      </div>

      <p className="fun-subtitle" style={{ marginTop: 14 }}>
        {hasMore
          ? `Next reveal: Rank ${nextRankNumber}`
          : "Next: full wooden spoon table"}
      </p>
    </div>
  );
}
