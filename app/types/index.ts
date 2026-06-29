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
  round: "GG" | "R32" | "R16" | "QF" | "SF" | "3R" | "F";
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

export type Theme = "light" | "dark";

export type Row = {
  code: string;
  name: string;
  owners: string[];
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};
