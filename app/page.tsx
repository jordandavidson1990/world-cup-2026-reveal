"use client";

import { useMemo, useState } from "react";
import { entrants } from "./data/sweep";
import { deriveEntrantResults, getWoodenSpoonWinner } from "./utils/derive";
import { usePresentationFlow } from "./hooks/usePresentationFlow";
import { useTheme } from "./hooks/useTheme";
import { useWorldCupData } from "./hooks/useWorldCupData";
import ThemeToggle from "./components/ThemeToggle";
import StageHeader from "./components/StageHeader";
import RevealCard from "./components/RevealCard";
import FixturesBoard from "./components/FixturesBoard";
import WoodenSpoon from "./components/WoodenSpoon";
import Controls from "./components/Controls";

export default function Page() {
  const [started, setStarted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { teams, fixtures, teamStats, loading, source, warning } =
    useWorldCupData();

  const results = deriveEntrantResults(entrants, teams);
  const woodenSpoon = getWoodenSpoonWinner(entrants, teamStats);

  const teamNameMap = useMemo(
    () =>
      teams.reduce<Record<string, string>>((acc, t) => {
        acc[t.code] = t.name;
        return acc;
      }, {}),
    [teams],
  );

  const { stage, current, remaining, nextReveal, prevReveal, reset } =
    usePresentationFlow(results);

  if (!started) {
    return (
      <main className="container">
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <h1>🏆 World Cup Sweep Night</h1>
            <p className="hero-sub">
              Big reveals, big drama, and one unlucky wooden spoon.
            </p>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        <section className="card card-lg" style={{ marginTop: 20 }}>
          <h2 className="fun-title">Welcome 👋</h2>
          <p className="fun-subtitle" style={{ marginTop: 8 }}>
            Tonight’s running order:
          </p>

          <ul className="spaced-list" style={{ marginTop: 14 }}>
            <li>💔 Eliminated players first</li>
            <li>✨ Remaining players in one click</li>
            <li>🗓️ Remaining fixtures and dates</li>
            <li>🥄 Wooden spoon winner (lowest goals, then GD)</li>
          </ul>

          <p style={{ marginTop: 16 }}>
            Data source: <strong>{loading ? "loading..." : source}</strong>
          </p>
          {warning ? (
            <p style={{ color: "#f59e0b", marginTop: 8 }}>{warning}</p>
          ) : null}

          <button onClick={() => setStarted(true)} style={{ marginTop: 18 }}>
            Start the show ▶
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          <h1>🏆 World Cup Sweep Night</h1>
          <p className="hero-sub">Let the drama unfold...</p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <div className="stage-pill">{stage.replace("-", " ")}</div>
      {warning ? (
        <p style={{ color: "#f59e0b", marginTop: 10 }}>{warning}</p>
      ) : null}

      <div style={{ marginTop: 18 }}>
        <StageHeader stage={stage} />
      </div>

      <div style={{ marginTop: 16 }}>
        {stage === "eliminated" && (
          <RevealCard result={current} mode="eliminated" />
        )}

        {stage === "remaining" && (
          <div className="card card-lg">
            <h3 className="fun-title">✨ Still In The Hunt</h3>
            <p className="fun-subtitle">One screen, all remaining players.</p>

            <ul className="spaced-list" style={{ marginTop: 16 }}>
              {remaining.map((r) => (
                <li key={r.entrant.id}>
                  <strong>{r.entrant.name}</strong> —{" "}
                  {r.activeTeams.map((t) => t.name).join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}

        {stage === "fixtures" && (
          <FixturesBoard fixtures={fixtures} teams={teams} />
        )}

        {stage === "wooden-spoon" && (
          <WoodenSpoon
            loser={woodenSpoon}
            teamStats={teamStats}
            teamNames={teamNameMap}
          />
        )}
      </div>

      <Controls
        onPrev={prevReveal}
        onNext={nextReveal}
        onReset={() => {
          reset();
          setStarted(false);
        }}
      />
    </main>
  );
}
