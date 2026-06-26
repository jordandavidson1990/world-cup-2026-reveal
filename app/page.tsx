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
import WoodenSpoonReveal from "./components/WoodenSpoonReveal";
import Controls from "./components/Controls";
import { codeToFlagEmoji } from "./utils/codeToFlagEmoji";

export default function Page() {
  const [started, setStarted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { teams, fixtures, teamStats, warning } = useWorldCupData();

  const results = deriveEntrantResults(entrants, teams);
  const woodenSpoon = getWoodenSpoonWinner(entrants, teamStats);

  // IMPORTANT: uppercase normalized keys
  const teamNameMap = useMemo(
    () =>
      teams.reduce<Record<string, string>>((acc, t) => {
        const key = String(t.code ?? "")
          .trim()
          .toUpperCase();
        if (key) acc[key] = t.name;
        return acc;
      }, {}),
    [teams]
  );

  const {
    stage,
    current,
    remaining,
    woodenRevealIndex,
    nextReveal,
    prevReveal,
    reset,
  } = usePresentationFlow(results);

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
            <li>🥁 Wooden spoon bottom-10 reveal</li>
            <li>🥄 Full wooden spoon table + winner</li>
          </ul>

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
            <ul className="spaced-list" style={{ marginTop: 16 }}>
              {remaining.map((r) => (
                <li key={r.entrant.id}>
                  <strong>{r.entrant.name}</strong>:{" "}
                  {r.activeTeams
                    .map((t) => ` ${t.name} ${codeToFlagEmoji(t.code)}`)
                    .join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}

        {stage === "fixtures" && (
          <FixturesBoard fixtures={fixtures} teams={teams} />
        )}

        {stage === "wooden-spoon-reveal" && (
          <WoodenSpoonReveal
            teamStats={teamStats}
            revealIndex={woodenRevealIndex}
            teamNames={teamNameMap}
          />
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
