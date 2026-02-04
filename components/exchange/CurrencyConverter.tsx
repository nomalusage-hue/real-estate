"use client";

import { CURRENCIES } from "@/src/config/currencies";
import { useEffect, useState } from "react";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("IDR");
  const [rate, setRate] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRate() {
      setError("");
      setRate(null);

      try {
        const res = await fetch(`/api/exchange?base=${from}`);
        const data = await res.json();

        if (!res.ok || !data.rates[to]) {
          throw new Error();
        }

        setRate(data.rates[to]);
      } catch {
        setError("Unable to fetch exchange rate.");
      }
    }

    fetchRate();
  }, [from, to]);

  const converted =
    rate !== null ? (amount * rate).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    }) : "--";

  return (
    <div className="currency-box">
      <h4>Currency Converter</h4>

      <input
        type="number"
        value={amount}
        min="0"
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <div className="select-row">
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} – {c.label}
            </option>
          ))}
        </select>

        <span>→</span>

        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} – {c.label}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <p className="result">
          {converted} {to}
        </p>
      )}

      <p className="note">
        Currency conversion is approximate and based on current exchange rates.
      </p>
    </div>
  );
}
