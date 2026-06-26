"use client";

import { useMemo, useState } from "react";
import { EntrantResult } from "../types";

export type Stage =
  | "eliminated"
  | "remaining"
  | "fixtures"
  | "wooden-spoon-reveal"
  | "wooden-spoon";

const WOODEN_REVEAL_COUNT = 10;

export const usePresentationFlow = (results: EntrantResult[]) => {
  const [stage, setStage] = useState<Stage>("eliminated");
  const [revealIndex, setRevealIndex] = useState(0);
  const [woodenRevealIndex, setWoodenRevealIndex] = useState(0); // 0..9 (reveals #10 -> #1)

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

  const currentList =
    stage === "eliminated"
      ? eliminated
      : stage === "remaining"
        ? remaining
        : [];

  const current = currentList[revealIndex] ?? null;

  const nextReveal = () => {
    if (stage === "eliminated") {
      if (revealIndex < eliminated.length - 1) {
        setRevealIndex((i) => i + 1);
        return;
      }
      setStage("remaining");
      setRevealIndex(0);
      return;
    }

    if (stage === "remaining") {
      setStage("fixtures");
      setRevealIndex(0);
      return;
    }

    if (stage === "fixtures") {
      setStage("wooden-spoon-reveal");
      setWoodenRevealIndex(0);
      return;
    }

    if (stage === "wooden-spoon-reveal") {
      if (woodenRevealIndex < WOODEN_REVEAL_COUNT - 1) {
        setWoodenRevealIndex((i) => i + 1);
        return;
      }
      setStage("wooden-spoon");
      return;
    }
  };

  const prevReveal = () => {
    if (stage === "eliminated") {
      if (revealIndex > 0) setRevealIndex((i) => i - 1);
      return;
    }

    if (stage === "remaining") {
      setStage("eliminated");
      setRevealIndex(Math.max(eliminated.length - 1, 0));
      return;
    }

    if (stage === "fixtures") {
      setStage("remaining");
      setRevealIndex(0);
      return;
    }

    if (stage === "wooden-spoon-reveal") {
      if (woodenRevealIndex > 0) {
        setWoodenRevealIndex((i) => i - 1);
      } else {
        setStage("fixtures");
      }
      return;
    }

    if (stage === "wooden-spoon") {
      setStage("wooden-spoon-reveal");
      setWoodenRevealIndex(WOODEN_REVEAL_COUNT - 1);
    }
  };

  const reset = () => {
    setStage("eliminated");
    setRevealIndex(0);
    setWoodenRevealIndex(0);
  };

  return {
    stage,
    current,
    remaining,
    revealIndex,
    woodenRevealIndex,
    nextReveal,
    prevReveal,
    reset,
  };
};
