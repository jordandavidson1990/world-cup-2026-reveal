"use client";

import { useMemo, useState } from "react";
import { EntrantResult } from "../types";

export type Stage = "eliminated" | "remaining" | "fixtures" | "wooden-spoon";

export const usePresentationFlow = (results: EntrantResult[]) => {
  const [stage, setStage] = useState<Stage>("eliminated");
  const [revealIndex, setRevealIndex] = useState(0);

  const eliminated = useMemo(
    () =>
      results
        .filter((r) => r.isEliminated)
        .sort((a, b) => a.entrant.name.localeCompare(b.entrant.name)),
    [results],
  );

  const remaining = useMemo(
    () =>
      results
        .filter((r) => !r.isEliminated)
        .sort((a, b) => a.entrant.name.localeCompare(b.entrant.name)),
    [results],
  );

  const listForStage =
    stage === "eliminated"
      ? eliminated
      : stage === "remaining"
        ? remaining
        : [];

  const current = listForStage[revealIndex] ?? null;

  const nextReveal = () => {
    // Remaining players = one click (jump stage, no per-person stepping)
    if (stage === "remaining") {
      setStage("fixtures");
      setRevealIndex(0);
      return;
    }

    if (stage === "eliminated") {
      if (revealIndex < eliminated.length - 1) {
        setRevealIndex((i) => i + 1);
        return;
      }
      setStage("remaining");
      setRevealIndex(0);
      return;
    }

    if (stage === "fixtures") {
      setStage("wooden-spoon");
      return;
    }
  };

  const prevReveal = () => {
    if (stage === "eliminated") {
      if (revealIndex > 0) {
        setRevealIndex((i) => i - 1);
      }
      return;
    }

    if (stage === "remaining") {
      // Go back to last eliminated person
      setStage("eliminated");
      setRevealIndex(Math.max(eliminated.length - 1, 0));
      return;
    }

    if (stage === "fixtures") {
      // Go back to remaining (single-screen stage)
      setStage("remaining");
      setRevealIndex(0);
      return;
    }

    if (stage === "wooden-spoon") {
      setStage("fixtures");
      setRevealIndex(0);
    }
  };

  const reset = () => {
    setStage("eliminated");
    setRevealIndex(0);
  };

  return {
    stage,
    eliminated,
    remaining,
    current,
    revealIndex,
    nextReveal,
    prevReveal,
    reset,
  };
};
