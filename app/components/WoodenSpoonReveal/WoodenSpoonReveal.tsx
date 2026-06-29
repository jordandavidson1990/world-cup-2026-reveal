// Sub-component Imports
import { RevealHeader } from "./RevealHeader";
import { RevealRow, RowData } from "./RevealRow";
import { RevealFooter } from "./RevealFooter";
import { TeamTournamentStats, Theme } from "@/app/types";
import { buildOwnerMap } from "@/app/utils/buildOwnerMap";
import { buildWorstRows } from "@/app/utils/reveal";
import { tTheme } from "@/app/utils/theme";
import { entrants } from "@/app/data/sweep";

type Props = {
  teamStats: Record<string, TeamTournamentStats>;
  revealIndex: number;
  teamNames?: Record<string, string>;
  theme: Theme;
};

const REVEAL_COUNT = 10;

const WoodenSpoonReveal = ({
  teamStats,
  revealIndex,
  teamNames = {},
  theme,
}: Props) => {
  const isDark = theme === "dark";
  const ownerMap = buildOwnerMap(entrants);
  const rows = buildWorstRows(teamStats, teamNames, ownerMap);

  const bottomN = rows.slice(0, Math.min(REVEAL_COUNT, rows.length));
  const total = bottomN.length;

  const safeRevealIndex = Math.max(0, revealIndex);
  const shownCount = Math.min(safeRevealIndex, total);

  const revealedRows =
    shownCount > 0
      ? Array.from({ length: shownCount }, (_, i) => ({
          row: bottomN[total - 1 - i] as RowData,
          rank: total - i,
        })).reverse()
      : [];

  const hasMore = shownCount < total;
  const nextRank = total - shownCount;
  const t = tTheme(isDark);

  return (
    <div
      style={{
        background: t.shell,
        border: t.shellBorder,
        color: isDark ? "#e8e4dc" : "var(--fg)",
        padding: "28px 24px 32px",
        borderRadius: 16,
        fontFamily: "'Inter', sans-serif",
        boxShadow: isDark
          ? "0 0 0 1px #1e1e1e, 0 24px 48px rgba(0,0,0,0.6)"
          : "0 12px 32px rgba(0,0,0,0.09)",
      }}
    >
      {/* CSS Keyframes Injection */}
      <style>{`
        @keyframes spoonEntrance {
          0% { transform: scale(0.93); opacity: 0; filter: brightness(1.8); }
          60% { transform: scale(1.03); filter: brightness(1.1); }
          100% { transform: scale(1); opacity: 1; filter: brightness(1); }
        }
        @keyframes rowEntrance {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .spoon-winner-card {
          animation: spoonEntrance 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .standard-reveal-card {
          animation: rowEntrance 0.35s cubic-bezier(0.215, 0.610, 0.355, 1) forwards;
        }
      `}</style>

      <RevealHeader total={total} t={t} />

      {/* Render Stack List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {revealedRows.length === 0 ? (
          <p
            style={{
              fontSize: 13,
              color: t.empty,
              textAlign: "center",
              padding: "24px 0",
              letterSpacing: "0.06em",
              margin: 0,
            }}
          >
            Awaiting first reveal…
          </p>
        ) : (
          revealedRows.map(({ row, rank }, i) => (
            <RevealRow
              key={row.code}
              row={row}
              rank={rank}
              isNew={i === 0}
              isSpoonWinner={rank === 1}
              isDark={isDark}
              t={t}
            />
          ))
        )}
      </div>

      {revealedRows.length > 0 && (
        <RevealFooter
          hasMore={hasMore}
          nextRank={nextRank}
          winnerName={revealedRows[0]?.row?.name || ""}
          t={t}
        />
      )}
    </div>
  );
};

export default WoodenSpoonReveal;
