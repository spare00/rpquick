export const PROPERTY_TYPE_LABEL: Record<string, string> = {
  house: "house",
  apartment: "apartment",
  townhouse: "townhouse",
};

export const STATE_LABEL: Record<string, string> = {
  NSW: "NSW",
  VIC: "VIC",
  QLD: "QLD",
  WA: "WA",
  SA: "SA",
};

export function formatAud(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPct(value: number | null | undefined, digits = 1) {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function propertyTypeLabel(type: string) {
  return PROPERTY_TYPE_LABEL[type] ?? type;
}

export function daysBetween(from: Date, to = new Date()) {
  return Math.max(0, Math.round((to.getTime() - from.getTime()) / 86_400_000));
}
