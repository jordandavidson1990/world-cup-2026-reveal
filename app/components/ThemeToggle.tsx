"use client";

export default function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
}) {
  return (
    <button onClick={onToggle}>
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
