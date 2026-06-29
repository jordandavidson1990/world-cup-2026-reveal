"use client";

import { useMemo, useState } from "react";
import { entrants } from "./data/sweep";
import { deriveEntrantResults, getWoodenSpoonWinner } from "./utils/derive";
import { usePresentationFlow } from "./hooks/usePresentationFlow";
import { useTheme } from "./hooks/useTheme";
import { useWorldCupData } from "./hooks/useWorldCupData";
import ThemeToggle from "./components/ThemeToggle";
import RevealCard from "./components/RevealCard";
import FixturesBoard from "./components/FixturesBoard";
import WoodenSpoon from "./components/WoodenSpoon";
import WoodenSpoonReveal from "./components/WoodenSpoonReveal/WoodenSpoonReveal";
import Controls from "./components/Controls";
import RemainingList from "./components/RemainingList";
import StartScreen from "./components/StartScreen";

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
      <StartScreen
        theme={theme}
        onToggle={toggleTheme}
        onStart={() => setStarted(true)}
      />
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

      <div style={{ marginTop: 16 }}>
        {stage === "eliminated" && (
          <RevealCard result={current} mode="eliminated" />
        )}

        {stage === "remaining" && <RemainingList remaining={remaining} />}

        {stage === "fixtures" && (
          <FixturesBoard fixtures={fixtures} teams={teams} />
        )}

        {stage === "wooden-spoon-reveal" && (
          <WoodenSpoonReveal
            teamStats={teamStats}
            revealIndex={woodenRevealIndex}
            teamNames={teamNameMap}
            theme={theme}
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
