import { EntrantResult } from "../types";

export default function RevealCard({
  result,
  mode,
}: {
  result: EntrantResult | null;
  mode: "eliminated" | "remaining";
}) {
  if (!result) {
    return <div className="card card-lg">No one to reveal in this stage.</div>;
  }

  const title = mode === "eliminated" ? "Eliminated Reveal" : "Still In Reveal";
  const intro =
    mode === "eliminated"
      ? "This one hurts... 😬"
      : "Still alive and kicking! 💪";

  return (
    <div className="card card-lg">
      <p className="fun-subtitle">{title}</p>
      <h3 className="fun-title" style={{ marginTop: 4 }}>
        {result.entrant.name}
      </h3>
      <p style={{ marginTop: 8 }}>
        <span
          className={`badge ${result.isEliminated ? "badge-out" : "badge-in"}`}
        >
          {result.isEliminated ? "Eliminated" : "Still In"}
        </span>
      </p>

      <p className="fun-subtitle" style={{ marginTop: 12 }}>
        {intro}
      </p>

      <div className="reveal-grid" style={{ marginTop: 18 }}>
        <div className="panel-soft">
          <strong>✅ Active Teams</strong>
          <ul className="spaced-list">
            {result.activeTeams.length === 0 ? (
              <li>None left</li>
            ) : (
              result.activeTeams.map((t) => <li key={t.code}>{t.name}</li>)
            )}
          </ul>
        </div>

        <div className="panel-soft">
          <strong>❌ Eliminated Teams</strong>
          <ul className="spaced-list">
            {result.eliminatedTeams.length === 0 ? (
              <li>None yet</li>
            ) : (
              result.eliminatedTeams.map((t) => <li key={t.code}>{t.name}</li>)
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
