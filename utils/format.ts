export function formatNumber(num: number | undefined): string {
  return new Intl.NumberFormat("en-US").format(num ? num : 0);
}

export function formatUnit(unit:  "m2" | "ft2" | "sqm" | "sqft" | "acre" | "hectare" | undefined): string {
  if (!unit) return "";
  if (unit === "ft2") return `ft²`;
  if (unit === "sqft") return `ft²`;
  if (unit === "sqm") return `m²`;
  if (unit === "m2") return `m²`;
  if (unit === "acre") return `acre`;
  if (unit === "hectare") return `hectare`;
  return "";
}

export function formatArea(value: number|undefined, unit:  "m2" | "ft2" | "sqm" | "sqft" | "acre" | "hectare" | undefined): string {
  return `${formatNumber(value)} ${formatUnit(unit)}`;
}
