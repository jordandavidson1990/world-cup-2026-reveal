import { NextResponse } from "next/server";
import { fallbackFixtures, fallbackTeams } from "../../data/sweep";
import { Fixture, Team, TeamTournamentStats } from "../../types";

export const dynamic = "force-dynamic";

const FOOTBALL_DATA_TEAMS_URL =
  "https://api.football-data.org/v4/competitions/WC/teams";
const FOOTBALL_DATA_MATCHES_URL =
  "https://api.football-data.org/v4/competitions/WC/matches";

type ApiTeam = {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
};

type ApiMatch = {
  id: number;
  status: string;
  stage?: string;
  utcDate?: string;
  homeTeam: ApiTeam;
  awayTeam: ApiTeam;
  score: {
    fullTime: { home: number | null; away: number | null };
  };
};

type ApiTeamsResponse = {
  teams?: ApiTeam[];
};

type ApiMatchesResponse = {
  matches?: ApiMatch[];
};

function toRound(stage: string | undefined): Fixture["round"] {
  const s = (stage ?? "").toUpperCase();
  if (s.includes("LAST_32") || s.includes("ROUND_OF_32")) return "R32";
  if (s.includes("LAST_16") || s.includes("ROUND_OF_16")) return "R16";
  if (s.includes("QUARTER")) return "QF";
  if (s.includes("SEMI")) return "SF";
  return "F";
}

function codeOf(team?: ApiTeam): string {
  return String(
    team?.tla ?? team?.shortName ?? team?.name ?? "TBD",
  ).toUpperCase();
}

function buildDefaultStats(teams: Team[]): Record<string, TeamTournamentStats> {
  return teams.reduce<Record<string, TeamTournamentStats>>((acc, t) => {
    acc[t.code] = { points: 0, goalsFor: 0, goalsAgainst: 0 };
    return acc;
  }, {});
}

function deriveTeamStatsFromFinishedMatches(
  matches: ApiMatch[],
): Record<string, TeamTournamentStats> {
  const stats: Record<string, TeamTournamentStats> = {};

  const ensure = (code: string) => {
    if (!stats[code]) {
      stats[code] = { points: 0, goalsFor: 0, goalsAgainst: 0 };
    }
    return stats[code];
  };

  for (const m of matches) {
    const homeGoals = m.score?.fullTime?.home;
    const awayGoals = m.score?.fullTime?.away;

    // only use matches with final numeric scores
    if (homeGoals === null || awayGoals === null) continue;

    const homeCode = codeOf(m.homeTeam);
    const awayCode = codeOf(m.awayTeam);

    const home = ensure(homeCode);
    const away = ensure(awayCode);

    // GF / GA
    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;

    // points: 3 win, 1 draw, 0 loss
    if (homeGoals > awayGoals) {
      home.points += 3;
    } else if (awayGoals > homeGoals) {
      away.points += 3;
    } else {
      home.points += 1;
      away.points += 1;
    }
  }

  return stats;
}

function mergeStats(
  base: Record<string, TeamTournamentStats>,
  incoming: Record<string, TeamTournamentStats>,
) {
  const out = { ...base };
  for (const [code, s] of Object.entries(incoming)) {
    out[code] = {
      points: Number(s.points ?? 0),
      goalsFor: Number(s.goalsFor ?? 0),
      goalsAgainst: Number(s.goalsAgainst ?? 0),
    };
  }
  return out;
}

export async function GET() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      source: "fallback",
      warning: "No FOOTBALL_DATA_API_KEY set. Using fallback data.",
      teams: fallbackTeams,
      fixtures: fallbackFixtures,
      teamStats: buildDefaultStats(fallbackTeams),
    });
  }

  try {
    const [teamsRes, matchesRes] = await Promise.all([
      fetch(FOOTBALL_DATA_TEAMS_URL, {
        headers: { "X-Auth-Token": apiKey },
        cache: "no-store",
      }),
      fetch(FOOTBALL_DATA_MATCHES_URL, {
        headers: { "X-Auth-Token": apiKey },
        cache: "no-store",
      }),
    ]);

    if (!teamsRes.ok || !matchesRes.ok) {
      return NextResponse.json({
        source: "fallback",
        warning: `football-data API error (${teamsRes.status}/${matchesRes.status}). Using fallback data.`,
        teams: fallbackTeams,
        fixtures: fallbackFixtures,
        teamStats: buildDefaultStats(fallbackTeams),
      });
    }

    const teamsJson = (await teamsRes.json()) as ApiTeamsResponse;
    const matchesJson = (await matchesRes.json()) as ApiMatchesResponse;

    const teams: Team[] = (teamsJson.teams ?? []).map((t) => ({
      code: codeOf(t),
      name: t.name ?? "Unknown Team",
      status: "active",
    }));

    const allMatches = matchesJson.matches ?? [];

    const fixtures: Fixture[] = allMatches
      .filter((m) => m.status !== "FINISHED")
      .map((m, i) => ({
        id: String(m.id ?? i),
        round: toRound(m.stage),
        home: codeOf(m.homeTeam),
        away: codeOf(m.awayTeam),
        kickoffUtc: m.utcDate ?? undefined,
        status:
          m.status === "IN_PLAY" || m.status === "PAUSED"
            ? "live"
            : m.status === "FINISHED"
              ? "finished"
              : "scheduled",
      }));

    const finishedMatches = allMatches.filter((m) => {
      const h = m.score?.fullTime?.home;
      const a = m.score?.fullTime?.away;
      return h !== null && a !== null;
    });

    const derivedStats = deriveTeamStatsFromFinishedMatches(finishedMatches);

    const fallbackStatusMap = new Map(
      fallbackTeams.map((t) => [t.code, t.status]),
    );
    const mergedTeams =
      teams.length > 0
        ? teams.map((t) => ({
            ...t,
            status: fallbackStatusMap.get(t.code) ?? t.status,
          }))
        : fallbackTeams;

    const defaultStats = buildDefaultStats(mergedTeams);
    const teamStats = mergeStats(defaultStats, derivedStats);

    return NextResponse.json({
      source: "api",
      teams: mergedTeams,
      fixtures: fixtures.length > 0 ? fixtures : fallbackFixtures,
      teamStats,
    });
  } catch {
    return NextResponse.json({
      source: "fallback",
      warning: "Network error calling football-data API. Using fallback data.",
      teams: fallbackTeams,
      fixtures: fallbackFixtures,
      teamStats: buildDefaultStats(fallbackTeams),
    });
  }
}
