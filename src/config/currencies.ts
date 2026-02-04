// export type Currency = {
//   code: string;
//   label: string;
//   symbol: string;
//   priority?: boolean;
// };

// export const CURRENCIES: Currency[] = [
//   { code: "USD", label: "US Dollar", symbol: "$", priority: true },
//   { code: "EUR", label: "Euro", symbol: "€", priority: true },
//   { code: "IDR", label: "Indonesian Rupiah", symbol: "Rp", priority: true },

//   { code: "GBP", label: "British Pound", symbol: "£" },
//   { code: "AUD", label: "Australian Dollar", symbol: "A$" },
//   { code: "SGD", label: "Singapore Dollar", symbol: "S$" },
//   { code: "JPY", label: "Japanese Yen", symbol: "¥" },
// ];


import rawCurrencies from "./currencies.json";

export type Currency = {
  code: string;
  label: string;
  symbol: string;
  priority?: boolean;
};

export const CURRENCIES: Currency[] = rawCurrencies;