import { differenceInDays } from "date-fns";
import { propertyTypeKo } from "./format";
import type { ScoreResult } from "./types";

const URGENCY_KEYWORDS: { pattern: RegExp; label: string }[] = [
  { pattern: /must sell/i, label: "must sell" },
  { pattern: /urgent sale/i, label: "urgent sale" },
  { pattern: /motivated vendor/i, label: "motivated vendor" },
  { pattern: /price reduced/i, label: "price reduced" },
  { pattern: /quick sale/i, label: "quick sale" },
  { pattern: /relocated|relocating|interstate/i, label: "relocating" },
  { pattern: /deceased estate/i, label: "deceased estate" },
  { pattern: /vendor wants sold/i, label: "vendor wants sold" },
  { pattern: /must be sold/i, label: "must be sold" },
  { pattern: /third price reduction|multiple reductions/i, label: "multiple reductions" },
  { pattern: /급매/, label: "급매" },
];

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function priceAt(
  snapshots: { price: number; recordedAt: Date }[],
  daysAgo: number,
  now: Date,
) {
  const cutoff = now.getTime() - daysAgo * 86_400_000;
  const eligible = snapshots.filter((s) => s.recordedAt.getTime() <= cutoff);
  if (eligible.length === 0) return snapshots[0]?.price ?? null;
  return eligible[eligible.length - 1].price;
}

function dropPct(from: number | null, to: number) {
  if (from == null || from <= 0 || to >= from) return null;
  return round1(((from - to) / from) * 100);
}

function median(values: number[]) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

export function scoreListing(input: {
  currentPrice: number;
  listedAt: Date;
  headline: string;
  description: string;
  suburb: string;
  propertyType: string;
  beds: number;
  snapshots: { price: number; recordedAt: Date }[];
  comparablePrices: number[];
  now?: Date;
}): ScoreResult {
  const now = input.now ?? new Date();
  const snapshots = [...input.snapshots].sort(
    (a, b) => a.recordedAt.getTime() - b.recordedAt.getTime(),
  );
  const current = input.currentPrice;
  const reasons: string[] = [];

  const p7 = priceAt(snapshots, 7, now);
  const p14 = priceAt(snapshots, 14, now);
  const p30 = priceAt(snapshots, 30, now);
  const drop7dPct = dropPct(p7, current);
  const drop14dPct = dropPct(p14, current);
  const drop30dPct = dropPct(p30, current);

  const s7 = drop7dPct == null ? 0 : clamp((drop7dPct / 10) * 100);
  const s14 = drop14dPct == null ? 0 : clamp((drop14dPct / 15) * 100);
  const s30 = drop30dPct == null ? 0 : clamp((drop30dPct / 20) * 100);
  let dropScore = 0.5 * s7 + 0.3 * s14 + 0.2 * s30;

  let reductionCount = 0;
  let largestSingleDrop = 0;
  let lastDropDaysAgo: number | null = null;
  for (let i = 1; i < snapshots.length; i += 1) {
    const prev = snapshots[i - 1].price;
    const next = snapshots[i].price;
    if (next < prev) {
      reductionCount += 1;
      const pct = ((prev - next) / prev) * 100;
      if (pct > largestSingleDrop) largestSingleDrop = pct;
      lastDropDaysAgo = differenceInDays(now, snapshots[i].recordedAt);
    }
  }

  if (reductionCount >= 2) dropScore = clamp(dropScore + 8);
  if (reductionCount >= 3) dropScore = clamp(dropScore + 10);

  if (drop7dPct && drop7dPct >= 4) {
    reasons.push(`7일 내 가격 ${drop7dPct}% 하락`);
  } else if (drop14dPct && drop14dPct >= 5) {
    reasons.push(`2주 내 가격 ${drop14dPct}% 하락`);
  } else if (drop30dPct && drop30dPct >= 6) {
    reasons.push(`한 달 내 가격 ${drop30dPct}% 하락`);
  }
  if (reductionCount >= 2) {
    reasons.push(`${reductionCount}회 연속 가격 인하`);
  }

  const others = input.comparablePrices.filter((p) => p > 0);
  const compMedian = median(others);
  const compCount = others.length;
  let vsCompPct: number | null = null;
  let undervalueScore = 0;
  if (compMedian && current < compMedian) {
    vsCompPct = round1(((compMedian - current) / compMedian) * 100);
    undervalueScore = clamp((vsCompPct / 20) * 100);
    if (compCount < 3) undervalueScore *= 0.6;
    if (vsCompPct >= 6) {
      reasons.push(
        `동일 지역 ${input.beds}베드 ${propertyTypeKo(input.propertyType)} 중간가 대비 ${vsCompPct}% 저평가 (${compCount}건 비교)`,
      );
    }
  } else if (compMedian) {
    vsCompPct = round1(((compMedian - current) / compMedian) * 100);
  }

  let urgencyScore = 0;
  const blob = `${input.headline}\n${input.description}`;
  const hits = URGENCY_KEYWORDS.filter((k) => k.pattern.test(blob)).map((k) => k.label);
  if (hits.length > 0) {
    urgencyScore += Math.min(45, hits.length * 16);
    reasons.push(`급매 키워드: ${hits.slice(0, 3).join(", ")}`);
  }
  if (largestSingleDrop >= 8) {
    urgencyScore += 30;
    reasons.push(`한 번에 ${round1(largestSingleDrop)}% 인하`);
  } else if (largestSingleDrop >= 5) {
    urgencyScore += 18;
    reasons.push(`한 번에 ${round1(largestSingleDrop)}% 인하`);
  }
  if (lastDropDaysAgo != null && lastDropDaysAgo <= 7) {
    urgencyScore += 20;
  }
  const daysOnMarket = Math.max(0, differenceInDays(now, input.listedAt));
  if (daysOnMarket >= 90) {
    urgencyScore += 16;
    reasons.push(`등록 후 ${daysOnMarket}일 경과`);
  } else if (daysOnMarket >= 45) {
    urgencyScore += 8;
    reasons.push(`등록 후 ${daysOnMarket}일 경과`);
  }
  urgencyScore = clamp(urgencyScore);

  const dealScore = round1(
    0.42 * dropScore + 0.38 * undervalueScore + 0.2 * urgencyScore,
  );

  return {
    dealScore,
    dropScore: round1(dropScore),
    undervalueScore: round1(undervalueScore),
    urgencyScore: round1(urgencyScore),
    drop7dPct,
    drop14dPct,
    drop30dPct,
    vsCompPct,
    compMedian,
    compCount,
    reductionCount,
    daysOnMarket,
    reasons,
  };
}
