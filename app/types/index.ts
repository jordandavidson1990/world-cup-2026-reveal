export type TeamStatus = "active" | "eliminated";

export type Team = {
  code: string;
  name: string;
  status: TeamStatus;
};

export type Entrant = {
  id: string;
  name: string;
  teamCodes: string[];
};

export type TeamTournamentStats = {
  points: number;
  goalsFor: number;
  goalsAgainst: number;
};

export type Fixture = {
  id: string;
  round: "R32" | "R16" | "QF" | "SF" | "F";
  home: string;
  away: string;
  kickoffUtc?: string;
  status: "scheduled" | "live" | "finished";
};

export type EntrantResult = {
  entrant: Entrant;
  activeTeams: Team[];
  eliminatedTeams: Team[];
  isEliminated: boolean;
};
