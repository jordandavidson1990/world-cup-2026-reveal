import { Stage } from "../hooks/usePresentationFlow";

const labels: Record<Stage, string> = {
  eliminated: "💔 Who’s Out?",
  remaining: "✨ Who’s Still active?",
  fixtures: "🗓️ What’s Next?",
  "wooden-spoon-reveal": "🥁 Wooden Spoon Countdown",
  "wooden-spoon": "🥄 Wooden Spoon Winner",
};

export default function StageHeader({ stage }: { stage: Stage }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <h2 className="fun-title">{labels[stage]}</h2>
    </div>
  );
}
