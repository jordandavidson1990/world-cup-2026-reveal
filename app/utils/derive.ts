import { Entrant, EntrantResult, Team, TeamTournamentStats } from "../types";

export const deriveEntrantResults = (
  entrants: Entrant[],
  teams: Team[],
): EntrantResult[] => {
  const teamMap = new Map(teams.map((t) => [t.code, t]));

  return entrants.map((entrant) => {
    const assigned = entrant.teamCodes
      .map((c) => teamMap.get(c))
      .filter(Boolean) as Team[];

    const activeTeams = assigned.filter((t) => t.status === "active");
    const eliminatedTeams = assigned.filter((t) => t.status === "eliminated");

    return {
      entrant,
      activeTeams,
      eliminatedTeams,
      isEliminated: activeTeams.length === 0,
    };
  });
};

/**
 * Wooden spoon ranking:
 * 1) Lowest aggregate points
 * 2) Lowest aggregate goal difference (GF - GA)
 * 3) Lowest aggregate goals scored (GF)
 * 4) Final stable tie-break: alphabetical entrant name
 */
export const getWoodenSpoonWinner = (
  entrants: Entrant[],
  teamStats: Record<string, TeamTournamentStats>,
): Entrant | null => {
  if (entrants.length === 0) return null;

  const ranked = entrants.map((entrant) => {
    const totals = entrant.teamCodes.reduce(
      (acc, code) => {
        const stats = teamStats[code] ?? {
          points: 0,
          goalsFor: 0,
          goalsAgainst: 0,
        };
        acc.points += stats.points;
        acc.goalsFor += stats.goalsFor;
        acc.goalsAgainst += stats.goalsAgainst;
        return acc;
      },
      { points: 0, goalsFor: 0, goalsAgainst: 0 },
    );

    return {
      entrant,
      points: totals.points,
      goalsFor: totals.goalsFor,
      goalsAgainst: totals.goalsAgainst,
      goalDifference: totals.goalsFor - totals.goalsAgainst,
    };
  });

  console.log("ranked:", ranked);

  ranked.sort((a, b) => {
    // 1) Lowest points loses
    if (a.points !== b.points) return a.points - b.points;

    // 2) Worst GD loses
    if (a.goalDifference !== b.goalDifference) {
      return a.goalDifference - b.goalDifference;
    }

    // 3) Lowest GF loses
    if (a.goalsFor !== b.goalsFor) return a.goalsFor - b.goalsFor;

    // 4) Stable final tie-break
    return a.entrant.name.localeCompare(b.entrant.name);
  });

  return ranked[0].entrant;
};
