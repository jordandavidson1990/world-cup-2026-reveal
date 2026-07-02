"use client";

import React, { useMemo, useState } from "react";
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
import WelcomeScreen from "./components/WelcomeScreen"; // New Import
import MusicButton from "./components/MusicButton";

type ViewState = "welcome" | "agenda" | "show";

const Page = () => {
  // Swapped boolean for a progressive multi-stage timeline flow
  const [view, setView] = useState<ViewState>("welcome");

  const { theme, toggleTheme } = useTheme();
  const { teams, fixtures, teamStats, warning } = useWorldCupData();

  const {
    audioRef,
    elimAudioRef,
    cheerAudioRef,
    moneyAudioRef,
    isPlaying,
    toggleMusic,
    playSfx,
    playCheer,
    handleSfxTimeUpdate,
    stopAllFades,
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
    if (stage === "eliminated" && nextCurrent) {
      playSfx();
    }
    nextReveal();
  };

  return (
    <>
      {/* Structural Audio Nodes */}
      <audio ref={audioRef} src="/waka-waka.mp3" loop preload="auto" />
      <audio
        ref={elimAudioRef}
        src="/vine-boom.mp3"
        preload="auto"
        onTimeUpdate={handleSfxTimeUpdate}
      />
      <audio ref={cheerAudioRef} src="/cheer.mp3" preload="auto" />
      <audio ref={moneyAudioRef} src="/money.mp3" preload="auto" />

      {/* STAGE 1: SPANISH WELCOME INTRO */}
      {view === "welcome" && (
        <WelcomeScreen
          theme={theme}
          onToggle={toggleTheme}
          isPlaying={isPlaying}
          onToggleMusic={toggleMusic}
          onStart={() => {
            playCheer(); // Fires an upscale cheering sound when Jordan welcomes them
            setView("agenda"); // Marches forward to running order checklist
          }}
        />
      )}

      {/* STAGE 2: RUNNING ORDER CHECKLIST */}
      {view === "agenda" && (
        <StartScreen
          theme={theme}
          onToggle={toggleTheme}
          isPlaying={isPlaying}
          onToggleMusic={toggleMusic}
          onStart={() => {
            playSfx(); // Classic Vine-Boom impact transition into live data
            setView("show"); // Unlocks presentation engine
          }}
        />
      )}

      {/* STAGE 3: THE MAIN SHOW LOOPS */}
      {view === "show" && (
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
              <h1>🏆 World Cup Sweep Night</h1>
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
              setView("welcome"); // Full layout reset loops right back to the splash page
            }}
          />
        </main>
      )}
    </>
  );
};

export default Page;
