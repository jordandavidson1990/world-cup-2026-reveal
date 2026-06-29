import { codeToFlagEmoji } from "@/app/utils/codeToFlagEmoji";
import { ThemeTokens } from "@/app/utils/theme";

export type RowData = {
  code: string;
  name: string;
  owners: string[];
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};

type RowProps = {
  row: RowData;
  rank: number;
  isNew: boolean;
  isSpoonWinner: boolean;
  isDark: boolean;
  t: ThemeTokens;
};

export const RevealRow = ({
  row,
  rank,
  isNew,
  isSpoonWinner,
  isDark,
  t,
}: RowProps) => {
  const dynamicClassName = isSpoonWinner
    ? "spoon-winner-card"
    : isNew
    ? "standard-reveal-card"
    : "";

  const cardBg = isSpoonWinner ? t.spoonBg : isNew ? t.goldBg : t.oldBg;
  const cardBorder = isSpoonWinner
    ? t.spoonBorder
    : isNew
    ? t.goldBorder
    : t.oldBorder;
  const cardShadow = isSpoonWinner ? t.spoonShadow : "none";
  const cardOpacity = isNew || isSpoonWinner ? 1 : 0.5;

  return (
    <div
      className={dynamicClassName}
      style={{
        borderRadius: 12,
        padding: isSpoonWinner ? "18px 20px" : "14px 16px",
        display: "grid",
        gridTemplateColumns: isSpoonWinner ? "54px 1fr auto" : "44px 1fr auto",
        gap: "0 14px",
        alignItems: "center",
        border: cardBorder,
        background: cardBg,
        boxShadow: cardShadow,
        opacity: cardOpacity,
        transition: "opacity 0.4s ease, padding 0.3s ease",
        transformOrigin: "center center",
      }}
    >
      {/* Rank Number */}
      <div
        style={{
          fontFamily: "var(--font-display), Impact, sans-serif",
          fontSize: isSpoonWinner ? 40 : isNew ? 32 : 24,
          color: isSpoonWinner ? t.spoonText : isNew ? t.rankNew : t.rankOld,
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        #{rank}
      </div>

      {/* Flag + name + owner */}
      <div>
        {isSpoonWinner && (
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: t.spoonText,
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>🥄</span> Wooden Spoon Winner
          </div>
        )}
        <div
          style={{
            fontSize: isSpoonWinner ? 26 : 22,
            lineHeight: 1,
            marginBottom: 2,
          }}
        >
          {codeToFlagEmoji(row.code)}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display), Impact, sans-serif",
            fontSize: isSpoonWinner ? 26 : 22,
            letterSpacing: "0.05em",
            color: isSpoonWinner
              ? isDark
                ? "#ffffff"
                : t.spoonText
              : isNew
              ? t.nameNew
              : t.nameOld,
            lineHeight: 1.1,
          }}
        >
          {row.name}
        </div>
        <div
          style={{
            fontSize: isSpoonWinner ? 14 : 11,
            fontWeight: isSpoonWinner ? 600 : 400,
            color: isSpoonWinner
              ? isDark
                ? "#b5b0a5"
                : "#555"
              : isNew
              ? t.ownerNew
              : t.ownerOld,
            marginTop: 2,
            letterSpacing: "0.04em",
          }}
        >
          {row.owners.length ? row.owners.join(", ") : "—"}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          textAlign: "right",
          fontSize: 11,
          color: isSpoonWinner
            ? isDark
              ? "#aaa"
              : "#444"
            : isNew
            ? t.statsNew
            : t.statsOld,
          lineHeight: 1.7,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display), Impact, sans-serif",
            fontSize: isSpoonWinner ? 24 : isNew ? 20 : 16,
            color: isSpoonWinner ? t.spoonText : isNew ? t.ptsNew : t.ptsOld,
            letterSpacing: "0.04em",
          }}
        >
          {row.points} pts
        </div>
        <div style={{ fontWeight: isSpoonWinner ? 600 : 400 }}>
          GD{" "}
          {row.goalDifference >= 0
            ? `+${row.goalDifference}`
            : row.goalDifference}
        </div>
        <div>
          {row.goalsFor} — {row.goalsAgainst}
        </div>
      </div>
    </div>
  );
};
