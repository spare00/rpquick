import { cn } from "@/lib/cn";

export function ScoreBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "rust" | "sage" | "gold" | "ink";
}) {
  const color = {
    rust: "bg-rust",
    sage: "bg-sage",
    gold: "bg-gold",
    ink: "bg-ink",
  }[tone];
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-display text-sm tabular-nums">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className={cn("h-full rounded-full", color)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
