import { Fixture, Team } from "../types";

/**
 * Provider-agnostic server mappers.
 * Adjust field mapping to your chosen provider response shape.
 */

export function mapProviderTeamsToInternal(raw: any[]): Team[] {
  return raw.map((t) => ({
    code: String(t.code ?? t.fifa_code ?? t.id ?? "").toUpperCase(),
    name: t.name ?? t.team_name ?? "Unknown Team",
    status: t.eliminated ? "eliminated" : "active",
  }));
}

export function mapProviderFixturesToInternal(raw: any[]): Fixture[] {
  const toRound = (stage: string): Fixture["round"] => {
    const s = stage.toLowerCase();
    if (s.includes("round of 16") || s.includes("r16")) return "R16";
    if (s.includes("quarter")) return "QF";
    if (s.includes("semi")) return "SF";
    return "F";
  };

  console.log(raw);

  return raw.map((f, i) => ({
    id: String(f.id ?? i),
    round: toRound(String(f.stage_name ?? f.stage ?? "Final")),
    home: String(f.home_team_code ?? f.homeTeam?.code ?? "TBD").toUpperCase(),
    away: String(f.away_team_code ?? f.awayTeam?.code ?? "TBD").toUpperCase(),
    status: (f.status ?? "scheduled") as Fixture["status"],
  }));
}
