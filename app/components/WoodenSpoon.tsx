import { Entrant, TeamTournamentStats } from "../types";
import { entrants } from "../data/sweep";
import { getTeamDisplayName } from "../utils/getTeamDisplayName";
import { codeToFlagEmoji } from "../utils/codeToFlagEmoji";
import { buildOwnerMap } from "../utils/buildOwnerMap";

type WoodenSpoonProps = {
  loser: Entrant | null;
  teamStats: Record<string, TeamTournamentStats>;
  teamNames: Record<string, string>;
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

const toNum = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

function buildWorstTableRows(
  teamStats: Record<string, TeamTournamentStats>,
  teamNames: Record<string, string>,
  ownerMap: Map<string, string[]>
): Row[] {
  const rows: Row[] = Object.keys(teamStats).map((code) => {
    const raw = teamStats[code] ?? { points: 0, goalsFor: 0, goalsAgainst: 0 };
    const points = toNum(raw.points);
    const goalsFor = toNum(raw.goalsFor);
    const goalsAgainst = toNum(raw.goalsAgainst);
    const goalDifference = goalsFor - goalsAgainst;

    return {
      code,
      name: getTeamDisplayName(code),
      owners: ownerMap.get(code.toUpperCase()) ?? [],
      points,
      goalsFor,
      goalsAgainst,
      goalDifference,
    };
  });

  // WORST -> BEST
  rows.sort((a, b) => {
    if (a.points !== b.points) return a.points - b.points;
    if (a.goalDifference !== b.goalDifference)
      return a.goalDifference - b.goalDifference;
    if (a.goalsFor !== b.goalsFor) return a.goalsFor - b.goalsFor;
    return a.name.localeCompare(b.name);
  });

  return rows;
}

export default function WoodenSpoon({
  loser,
  teamStats,
  teamNames,
}: WoodenSpoonProps) {
  const ownerMap = buildOwnerMap(entrants);
  const rows = buildWorstTableRows(teamStats, teamNames, ownerMap);

  return (
    <div className="card card-lg">
      {loser ? (
        <>
          <div style={{ marginTop: 14 }}>
            <h2>
              Worst team owner: <b>{loser.name}</b>
            </h2>
          </div>
        </>
      ) : (
        <p style={{ marginTop: 12 }}>No wooden spoon winner yet.</p>
      )}

      <div style={{ marginTop: 22 }}>
        <h4 className="fun-title" style={{ fontSize: "1.05rem" }}>
          Full Tournament Table (Worst → Best)
        </h4>

        <div style={{ overflowX: "auto", marginTop: 10 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 900,
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "color-mix(in srgb, var(--card) 85%, var(--accent) 15%)",
                }}
              >
                <th style={thStyle}>Rank</th>
                <th style={thStyle}>Team</th>
                <th style={thStyle}>Owner</th>
                <th style={thStyle}>Pts</th>
                <th style={thStyle}>GF</th>
                <th style={thStyle}>GA</th>
                <th style={thStyle}>GD</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.code}
                  style={{
                    background:
                      i % 2 === 0
                        ? "transparent"
                        : "color-mix(in srgb, var(--card) 92%, var(--primary) 8%)",
                  }}
                >
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>
                    {codeToFlagEmoji(r.code)} {r.name}
                  </td>
                  <td style={tdStyle}>
                    {r.owners.length ? r.owners.join(", ") : "—"}
                  </td>
                  <td style={tdStyle}>{r.points}</td>
                  <td style={tdStyle}>{r.goalsFor}</td>
                  <td style={tdStyle}>{r.goalsAgainst}</td>
                  <td style={tdStyle}>{r.goalDifference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  fontSize: 13,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  padding: "10px 12px",
  borderBottom: "1px solid var(--border)",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};
