import type { Score } from "@prisma/client";

export type Badge = {
  label: string;
  className: string;
};

export function listingBadges(score: Score): Badge[] {
  const badges: Badge[] = [];
  if (score.urgencyScore >= 40 || (score.drop7dPct ?? 0) >= 5) {
    badges.push({
      label: "급매 유력",
      className: "bg-rust-soft text-rust",
    });
  }
  if (score.undervalueScore >= 35) {
    badges.push({
      label: "저평가",
      className: "bg-sage-soft text-sage",
    });
  }
  if (score.dropScore >= 40) {
    badges.push({
      label: "급락",
      className: "bg-gold-soft text-gold",
    });
  }
  return badges;
}

export function BadgeRow({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${badge.className}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
