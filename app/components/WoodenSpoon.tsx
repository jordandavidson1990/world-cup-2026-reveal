import { Entrant, TeamTournamentStats } from "../types";
import { entrants } from "../data/sweep";

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

function codeToFlagEmoji(code: string): string {
  const c = (code || "").toUpperCase();

  const special: Record<string, string> = {
    ENG: "🏴",
    SCO: "🏴",
    TUR: "🇹🇷",
    KOR: "🇰🇷",
    CIV: "🇨🇮",
    CPV: "🇨🇻",
    COD: "🇨🇩",
    CUW: "🇨🇼",
    BIH: "🇧🇦",
    IRN: "🇮🇷",
    KSA: "🇸🇦",
    UZB: "🇺🇿",
    JOR: "🇯🇴",
    QAT: "🇶🇦",
    PAR: "🇵🇾",
    MAR: "🇲🇦",
  };
  if (special[c]) return special[c];

  const fifaToIso2: Record<string, string> = {
    ARG: "AR",
    AUS: "AU",
    AUT: "AT",
    ALG: "DZ",
    BEL: "BE",
    BRA: "BR",
    CAN: "CA",
    COL: "CO",
    CRO: "HR",
    CZE: "CZ",
    ECU: "EC",
    EGY: "EG",
    FRA: "FR",
    GER: "DE",
    GHA: "GH",
    HAI: "HT",
    IRQ: "IQ",
    JPN: "JP",
    MEX: "MX",
    NED: "NL",
    NOR: "NO",
    NZL: "NZ",
    PAN: "PA",
    POR: "PT",
    RSA: "ZA",
    SEN: "SN",
    ESP: "ES",
    SUI: "CH",
    SWE: "SE",
    TUN: "TN",
    URU: "UY",
    USA: "US",
  };

  const iso2 = c.length === 2 ? c : fifaToIso2[c];
  if (!iso2 || iso2.length !== 2) return "🏳️";

  const A = 0x1f1e6;
  const first = iso2.charCodeAt(0) - 65 + A;
  const second = iso2.charCodeAt(1) - 65 + A;

  if (
    first < 0x1f1e6 ||
    first > 0x1f1ff ||
    second < 0x1f1e6 ||
    second > 0x1f1ff
  ) {
    return "🏳️";
  }

  return String.fromCodePoint(first, second);
}

function buildOwnerMap(allEntrants: Entrant[]) {
  const ownerMap = new Map<string, string[]>();

  for (const e of allEntrants) {
    for (const code of e.teamCodes) {
      const key = code.toUpperCase();
      const existing = ownerMap.get(key) ?? [];
      existing.push(e.name);
      ownerMap.set(key, existing);
    }
  }

  return ownerMap;
}

function buildWorstTableRows(
  teamStats: Record<string, TeamTournamentStats>,
  teamNames: Record<string, string>,
  ownerMap: Map<string, string[]>,
): Row[] {
  const rows: Row[] = Object.keys(teamStats).map((code) => {
    const raw = teamStats[code] ?? { points: 0, goalsFor: 0, goalsAgainst: 0 };
    const points = toNum(raw.points);
    const goalsFor = toNum(raw.goalsFor);
    const goalsAgainst = toNum(raw.goalsAgainst);
    const goalDifference = goalsFor - goalsAgainst;

    return {
      code,
      name: teamNames[code] ?? code,
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

  const loserTeamRows =
    loser?.teamCodes.map((code) => {
      const stat = teamStats[code] ?? {
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
      return {
        code,
        name: teamNames[code] ?? code,
        owners: ownerMap.get(code.toUpperCase()) ?? [],
        points: toNum(stat.points),
        goalsFor: toNum(stat.goalsFor),
        goalsAgainst: toNum(stat.goalsAgainst),
        goalDifference: toNum(stat.goalsFor) - toNum(stat.goalsAgainst),
      };
    }) ?? [];

  const totalPTS = loserTeamRows.reduce((s, r) => s + r.points, 0);
  const totalGF = loserTeamRows.reduce((s, r) => s + r.goalsFor, 0);
  const totalGA = loserTeamRows.reduce((s, r) => s + r.goalsAgainst, 0);
  const totalGD = totalGF - totalGA;

  return (
    <div className="card card-lg">
      <h3 className="fun-title">🥄 Wooden Spoon</h3>
      <p className="fun-subtitle">
        Ranking is worst-to-best by: Points → Goal Difference → Goals For
      </p>

      {loser ? (
        <>
          <div style={{ marginTop: 14 }}>
            <h2>{loser.name}</h2>
            <p className="fun-subtitle" style={{ marginTop: 6 }}>
              Aggregate: {totalPTS} pts • GD {totalGD} • GF {totalGF} • GA{" "}
              {totalGA}
            </p>
          </div>

          <ul className="spaced-list" style={{ marginTop: 12 }}>
            {loserTeamRows.map((r) => (
              <li key={r.code}>
                {codeToFlagEmoji(r.code)} <strong>{r.name}</strong> (
                {r.owners.join(", ") || "—"}) — {r.points} pts, GD{" "}
                {r.goalDifference}, GF {r.goalsFor}, GA {r.goalsAgainst}
              </li>
            ))}
          </ul>
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
