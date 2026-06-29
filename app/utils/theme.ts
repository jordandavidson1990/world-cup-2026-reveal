export const tTheme = (isDark: boolean) => ({
  shell: isDark ? "#0d0d0d" : "#f8f6f1",
  shellBorder: isDark ? "1px solid #1e1e1e" : "1px solid var(--border)",
  eyebrow: isDark ? "#666" : "#94a3b8",
  headline: isDark ? "#f0ebe0" : "var(--fg)",
  sub: isDark ? "#555" : "#94a3b8",
  gold: isDark ? "#c8a83a" : "#a07820",
  goldBg: isDark ? "rgba(200,168,58,0.06)" : "rgba(160,120,32,0.07)",
  goldBorder: isDark ? "rgba(200,168,58,0.3)" : "rgba(160,120,32,0.35)",

  // Wooden Spoon Master Highlight
  spoonBg: isDark
    ? "linear-gradient(145deg, rgba(234,110,76,0.15), rgba(200,80,50,0.05))"
    : "linear-gradient(145deg, rgba(210,85,50,0.08), rgba(245,240,235,1))",
  spoonBorder: isDark ? "1px solid #ea6e4c" : "1px solid #d25532",
  spoonText: isDark ? "#ff8666" : "#bc3e1b",
  spoonShadow: isDark
    ? "0 0 24px rgba(234,110,76,0.25)"
    : "0 8px 20px rgba(210,85,50,0.12)",

  oldBg: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)",
  oldBorder: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)",
  rankNew: isDark ? "#c8a83a" : "#a07820",
  rankOld: isDark ? "#444" : "#c4bfb0",
  nameNew: isDark ? "#f0ebe0" : "var(--fg)",
  nameOld: isDark ? "#888" : "#94a3b8",
  ownerNew: isDark ? "#888" : "#94a3b8",
  ownerOld: isDark ? "#555" : "#c4bfb0",
  statsNew: isDark ? "#777" : "#64748b",
  statsOld: isDark ? "#444" : "#c4bfb0",
  ptsNew: isDark ? "#c8a83a" : "#a07820",
  ptsOld: isDark ? "#444" : "#c4bfb0",
  divider: isDark
    ? "linear-gradient(to right, transparent, #333 20%, #333 80%, transparent)"
    : "linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)",
  nextColor: isDark ? "#888888" : "#475569",
  empty: isDark ? "#444" : "#94a3b8",
});

export type ThemeTokens = ReturnType<typeof tTheme>;
