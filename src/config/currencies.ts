import rawCurrencies from "./currencies.json";

export type Currency = {
  code: string;
  label: string;
  symbol: string;
  priority?: boolean;
};

export const CURRENCIES: Currency[] = rawCurrencies;