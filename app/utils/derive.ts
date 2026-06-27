import { Entrant, EntrantResult, Team, TeamTournamentStats } from "../types";

export const deriveEntrantResults = (
  entrants: Entrant[],
  teams: Team[]
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
  teamStats: Record<string, TeamTournamentStats>
): Entrant | null => {
  if (entrants.length === 0) return null;

  const ranked = entrants.map((entrant) => {
    // Find the single worst-performing team this entrant holds
    const worstTeam = entrant.teamCodes.reduce(
      (worst, code) => {
        const stats = teamStats[code] ?? {
          points: 0,
          goalsFor: 0,
          goalsAgainst: 0,
        };
        const gd = stats.goalsFor - stats.goalsAgainst;

        // Same comparison logic as the final sort — pick whichever is worse
        if (stats.points < worst.points)
          return { code, ...stats, goalDifference: gd };
        if (stats.points > worst.points) return worst;

        if (gd < worst.goalDifference)
          return { code, ...stats, goalDifference: gd };
        if (gd > worst.goalDifference) return worst;

        if (stats.goalsFor < worst.goalsFor)
          return { code, ...stats, goalDifference: gd };
        return worst;
      },
      {
        code: entrant.teamCodes[0],
        points: Infinity,
        goalsFor: Infinity,
        goalsAgainst: 0,
        goalDifference: Infinity,
      }
    );

    return { entrant, ...worstTeam };
  });

  console.log("Wooden spoon ranking (worst single team):", ranked);

  ranked.sort((a, b) => {
    if (a.points !== b.points) return a.points - b.points;
    if (a.goalDifference !== b.goalDifference)
      return a.goalDifference - b.goalDifference;
    if (a.goalsFor !== b.goalsFor) return a.goalsFor - b.goalsFor;
    return a.entrant.name.localeCompare(b.entrant.name);
  });

  return ranked[0].entrant;
};
