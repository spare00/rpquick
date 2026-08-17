export function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) {
    return <div className="h-8 w-24 rounded bg-line/60" />;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const w = 96;
  const h = 32;
  const points = values
    .map((value, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - 4 - ((value - min) / span) * (h - 8);
      return `${x},${y}`;
    })
    .join(" ");
  const dropped = values[values.length - 1] < values[0];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-24" aria-hidden>
      <polyline
        fill="none"
        stroke={dropped ? "#c44521" : "#3f6b4e"}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}
