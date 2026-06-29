import { ThemeTokens } from "@/app/utils/theme";

type RevealHeaderProps = {
  total: number;
  t: ThemeTokens;
};

export const RevealHeader = ({ total, t }: RevealHeaderProps) => {
  return (
    <>
      <p
        style={{
          margin: "0 0 6px",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: t.eyebrow,
        }}
      >
        Sweep · Wooden Spoon
      </p>
      <h3
        style={{
          margin: "0 0 4px",
          fontFamily: "var(--font-display), Impact, sans-serif",
          fontSize: 42,
          letterSpacing: "0.04em",
          color: t.headline,
          lineHeight: 1,
        }}
      >
        Bottom {total}
      </h3>
      <p
        style={{
          margin: "0 0 28px",
          fontSize: 12,
          color: t.sub,
          letterSpacing: "0.06em",
        }}
      >
        Revealed worst to least worst
      </p>
    </>
  );
};
