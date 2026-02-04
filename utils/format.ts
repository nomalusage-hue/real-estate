import { CURRENCIES } from "@/src/config/currencies";

export function formatNumber(num: number | undefined): string {
  return new Intl.NumberFormat("en-US").format(num ? num : 0);
}


export function formatPrice(
  amount: number | undefined, 
  currencyCode: string = 'USD', 
  isMonthly: boolean = false
): string {
  // const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
  
  return isMonthly ? `${formattedAmount}/month` : formattedAmount;
}

export function formatCurrencySymbol(currencyCode: string): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  return currency?.symbol || '$';
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
