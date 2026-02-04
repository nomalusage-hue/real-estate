const rateCache: Record<string, { rate: number; timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function convertToUSD(amount: number, currency: string): Promise<number | null> {
  if (!amount || !currency || currency === "USD") return amount;

  const now = Date.now();
  const cached = rateCache[currency];

  if (!cached || now - cached.timestamp > CACHE_TTL) {
    try {
      const res = await fetch(`/api/exchange?base=${currency}`);
      const data = await res.json();
      rateCache[currency] = { rate: data?.rates?.USD ?? 0, timestamp: now };
    } catch {
      return null;
    }
  }

  return amount * rateCache[currency].rate;
}