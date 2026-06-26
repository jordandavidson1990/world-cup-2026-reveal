"use client";

import { useEffect, useMemo, useState } from "react";
import { fallbackFixtures, fallbackTeams } from "../data/sweep";
import { Fixture, Team, TeamTournamentStats } from "../types";

type WorldCupPayload = {
  source: "api" | "fallback";
  warning?: string;
  teams: Team[];
  fixtures: Fixture[];
  teamStats?: Record<string, TeamTournamentStats>;
};

function buildFallbackStats(
  teams: Team[],
): Record<string, TeamTournamentStats> {
  return teams.reduce<Record<string, TeamTournamentStats>>((acc, t) => {
    acc[t.code] = { points: 0, goalsFor: 0, goalsAgainst: 0 };
    return acc;
  }, {});
}

export function useWorldCupData() {
  const [teams, setTeams] = useState<Team[]>(fallbackTeams);
  const [fixtures, setFixtures] = useState<Fixture[]>(fallbackFixtures);
  const [teamStats, setTeamStats] = useState<
    Record<string, TeamTournamentStats>
  >(buildFallbackStats(fallbackTeams));
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"api" | "fallback">("fallback");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/worldcup", { cache: "no-store" });
        const data: WorldCupPayload = await res.json();

        if (!mounted) return;
        setTeams(data.teams);
        setFixtures(data.fixtures);
        setTeamStats(data.teamStats ?? buildFallbackStats(data.teams));
        setSource(data.source);
        setWarning(data.warning ?? "");
      } catch {
        if (!mounted) return;
        setTeams(fallbackTeams);
        setFixtures(fallbackFixtures);
        setTeamStats(buildFallbackStats(fallbackTeams));
        setSource("fallback");
        setWarning("Could not load API data. Using fallback.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const safeTeamStats = useMemo(() => {
    if (Object.keys(teamStats).length > 0) return teamStats;
    return buildFallbackStats(teams);
  }, [teamStats, teams]);

  return {
    teams,
    fixtures,
    teamStats: safeTeamStats,
    loading,
    source,
    warning,
  };
}
