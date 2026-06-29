import { Row, TeamTournamentStats } from "../types";

export const toNum = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export function fullCountryName(
  code: string,
  teamNames: Record<string, string>
): string {
  const key = String(code || "")
    .trim()
    .toUpperCase();
  const name = teamNames[key];
  return name && name.trim().length > 0 ? name : "Unknown country";
}

export function buildWorstRows(
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
