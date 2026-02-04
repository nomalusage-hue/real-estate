import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const base = (searchParams.get("base") || "IDR").toUpperCase();

    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);

    if (!res.ok) {
      throw new Error("Exchange API request failed");
    }

    const data = await res.json();

    if (data.result !== "success") {
      throw new Error("Exchange API returned an error");
    }

    return NextResponse.json({
      rates: data.rates,
      base: data.base_code,
      last_update: data.time_last_update_utc,
      next_update: data.time_next_update_utc,
      provider: data.provider,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to fetch exchange rate.",
        message:
          "Currency conversion is approximate and based on current exchange rates.",
      },
      { status: 500 },
    );
  }
}
