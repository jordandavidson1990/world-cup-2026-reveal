import { ThemeTokens } from "@/app/utils/theme";

type RevealFooterProps = {
  hasMore: boolean;
  nextRank: number;
  winnerName: string;
  t: ThemeTokens;
};

export const RevealFooter = ({
  hasMore,
  nextRank,
  winnerName,
  t,
}: RevealFooterProps) => {
  return (
    <>
      <div style={{ height: 1, background: t.divider, margin: "20px 0" }} />
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: t.nextColor,
          textAlign: "center",
          margin: 0,
        }}
      >
        {hasMore ? (
          <>
            Next reveal · Rank{" "}
            <span style={{ color: t.gold, fontWeight: 500 }}>#{nextRank}</span>
          </>
        ) : (
          <>
            🏆 All revealed ·{" "}
            <span style={{ color: t.spoonText, fontWeight: 700 }}>
              Wooden spoon: {winnerName}
            </span>
          </>
        )}
      </p>
    </>
  );
};
