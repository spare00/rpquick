export const FOCUS_LOCATIONS = [
  { suburb: "Rochedale", state: "QLD", postcode: "4123" },
  { suburb: "Rochedale South", state: "QLD", postcode: "4123" },
] as const;

export const FOCUS_LOCATIONS_ENV = FOCUS_LOCATIONS.map(
  (row) => `${row.suburb},${row.state}`,
).join(";");

export function canonicalizeFocusLocation(suburb?: string | null, state?: string | null) {
  const suburbKey = suburb?.trim().toLowerCase();
  const stateKey = state?.trim().toUpperCase();
  return FOCUS_LOCATIONS.find(
    (row) => row.suburb.toLowerCase() === suburbKey && row.state === stateKey,
  );
}

export function isFocusLocation(suburb?: string | null, state?: string | null) {
  return Boolean(canonicalizeFocusLocation(suburb, state));
}
