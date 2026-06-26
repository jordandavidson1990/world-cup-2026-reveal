import { Fixture, Team } from "../types";

const roundEmoji: Record<Fixture["round"], string> = {
  R32: "🔥",
  R16: "⚔️",
  QF: "🎯",
  SF: "🚀",
  F: "🏆",
};

const roundLabel: Record<Fixture["round"], string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-finals",
  SF: "Semi-finals",
  F: "Grand Final",
};

function formatKickoffDate(kickoffUtc?: string) {
  if (!kickoffUtc) return "Date TBC";
  const date = new Date(kickoffUtc);
  if (Number.isNaN(date.getTime())) return "Date TBC";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildTeamNameMap(teams: Team[]) {
  return new Map(teams.map((t) => [t.code.toUpperCase(), t.name]));
}

function toTeamName(codeOrName: string, map: Map<string, string>) {
  if (!codeOrName) return "TBD";
  const upper = codeOrName.toUpperCase();
  return map.get(upper) ?? codeOrName;
}

export default function FixturesBoard({
  fixtures,
  teams,
}: {
  fixtures: Fixture[];
  teams: Team[];
}) {
  const grouped = fixtures.reduce<Record<string, Fixture[]>>((acc, f) => {
    if (!acc[f.round]) acc[f.round] = [];
    acc[f.round].push(f);
    return acc;
  }, {});

  const teamNameMap = buildTeamNameMap(teams);

  return (
    <div className="card card-lg">
      <h3 className="fun-title">🎉 Remaining Fixtures</h3>

      <div style={{ marginTop: 18, display: "grid", gap: 18 }}>
        {Object.entries(grouped).map(([round, items]) => {
          const key = round as Fixture["round"];
          return (
            <div key={round} className="fixture-round-block">
              <h4 className="fixture-round-title">
                {roundEmoji[key]} {roundLabel[key]}
              </h4>

              <ul className="fixture-list">
                {items.map((f) => (
                  <li key={f.id} className="fixture-item">
                    <div className="fixture-teams">
                      <span>{toTeamName(f.home, teamNameMap)}</span>
                      <span className="fixture-vs">vs</span>
                      <span>{toTeamName(f.away, teamNameMap)}</span>
                    </div>
                    <div className="fixture-date">
                      🗓️ {formatKickoffDate(f.kickoffUtc)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
