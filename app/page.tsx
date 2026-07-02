"use client";

import React, { useEffect, useMemo, useState } from "react";
import { entrants } from "./data/sweep";
import { deriveEntrantResults, getWoodenSpoonWinner } from "./utils/derive";
import { usePresentationFlow } from "./hooks/usePresentationFlow";
import { useTheme } from "./hooks/useTheme";
import { useWorldCupData } from "./hooks/useWorldCupData";
import { useAudioEngine } from "./hooks/useAudioEngine";

import ThemeToggle from "./components/ThemeToggle";
import RevealCard from "./components/RevealCard";
import FixturesBoard from "./components/FixturesBoard";
import WoodenSpoon from "./components/WoodenSpoon";
import WoodenSpoonReveal from "./components/WoodenSpoonReveal/WoodenSpoonReveal";
import Controls from "./components/Controls";
import RemainingList from "./components/RemainingList";
import StartScreen from "./components/StartScreen";
import MusicButton from "./components/MusicButton";

const Page = () => {
  const [started, setStarted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { teams, fixtures, teamStats, warning } = useWorldCupData();

  const {
    audioRef,
    elimAudioRef,
    isPlaying,
    toggleMusic,
    playSfx,
    handleSfxTimeUpdate,
    stopAllFades,
    playCheer,
    cheerAudioRef,
    moneyAudioRef,
    playMoney,
    playSquidGameEliminationSound,
    squidGameEliminationRef,
  } = useAudioEngine();

  const results = deriveEntrantResults(entrants, teams);
  const woodenSpoon = getWoodenSpoonWinner(entrants, teamStats);

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
    nextCurrent,
  } = usePresentationFlow(results);

  const handleNext = () => {
    if (stage === "eliminated") {
      if (nextCurrent) {
        playSquidGameEliminationSound();
      } else {
        playCheer();
      }
    }
    if (stage === "wooden-spoon-reveal" && woodenRevealIndex !== 10) {
      playSfx();
    }

    nextReveal();
  };

  useEffect(() => {
    if (stage === "wooden-spoon") {
      playMoney();
    }
  }, [stage, playMoney]);

  return (
    <>
      {/* Structural Audio Element Node Links */}
      <audio ref={audioRef} src="/waka-waka.mp3" loop preload="auto" />
      <audio
        ref={elimAudioRef}
        src="/vine-boom.mp3"
        preload="auto"
        onTimeUpdate={handleSfxTimeUpdate}
      />
      <audio ref={cheerAudioRef} src="/cheering.mp3" preload="auto" />
      <audio ref={moneyAudioRef} src="/money.mp3" preload="auto" />
      <audio
        ref={squidGameEliminationRef}
        src="/squid-elimination.mp3"
        preload="auto"
      />

      {!started ? (
        <StartScreen
          theme={theme}
          onToggle={toggleTheme}
          onStart={() => {
            playSquidGameEliminationSound();
            setStarted(true);
          }}
          isPlaying={isPlaying}
          onToggleMusic={toggleMusic}
        />
      ) : (
        <main className="container">
          <div
            className="row"
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "3rem",
                  letterSpacing: "0.5px",
                  margin: 0,
                }}
              >
                🏆 World Cup Sweep Night
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MusicButton isPlaying={isPlaying} onToggleMusic={toggleMusic} />
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>

          <div className="stage-pill">{stage.replace("-", " ")}</div>
          {warning && (
            <p style={{ color: "#f59e0b", marginTop: 10 }}>{warning}</p>
          )}

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
            onNext={handleNext}
            onReset={() => {
              stopAllFades();
              reset();
              setStarted(false);
            }}
          />
        </main>
      )}
    </>
  );
};

export default Page;
