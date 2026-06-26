export function codeToFlagEmoji(code: string): string {
  const c = (code || "").toUpperCase();

  const special: Record<string, string> = {
    ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    TUR: "🇹🇷",
    KOR: "🇰🇷",
    CIV: "🇨🇮",
    CPV: "🇨🇻",
    COD: "🇨🇩",
    CUW: "🇨🇼",
    BIH: "🇧🇦",
    IRN: "🇮🇷",
    KSA: "🇸🇦",
    UZB: "🇺🇿",
    JOR: "🇯🇴",
    QAT: "🇶🇦",
    PAR: "🇵🇾",
    MAR: "🇲🇦",
  };
  if (special[c]) return special[c];

  const fifaToIso2: Record<string, string> = {
    ARG: "AR",
    AUS: "AU",
    AUT: "AT",
    ALG: "DZ",
    BEL: "BE",
    BRA: "BR",
    CAN: "CA",
    COL: "CO",
    CRO: "HR",
    CZE: "CZ",
    ECU: "EC",
    EGY: "EG",
    FRA: "FR",
    GER: "DE",
    GHA: "GH",
    HAI: "HT",
    IRQ: "IQ",
    JPN: "JP",
    MEX: "MX",
    NED: "NL",
    NOR: "NO",
    NZL: "NZ",
    PAN: "PA",
    POR: "PT",
    RSA: "ZA",
    SEN: "SN",
    ESP: "ES",
    SUI: "CH",
    SWE: "SE",
    TUN: "TN",
    URU: "UY",
    USA: "US",
  };

  const iso2 = c.length === 2 ? c : fifaToIso2[c];
  if (!iso2 || iso2.length !== 2) return "🏳️";

  const A = 0x1f1e6;
  const first = iso2.charCodeAt(0) - 65 + A;
  const second = iso2.charCodeAt(1) - 65 + A;

  if (
    first < 0x1f1e6 ||
    first > 0x1f1ff ||
    second < 0x1f1e6 ||
    second > 0x1f1ff
  ) {
    return "🏳️";
  }

  return String.fromCodePoint(first, second);
}
