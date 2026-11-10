import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ForecastPoint = {
  time?: string;
  data?: {
    instant?: { details?: { air_temperature?: number; wind_speed?: number } };
    next_1_hours?: { summary?: { symbol_code?: string } };
  };
};

function safeCity(value: string | null): string | null {
  if (!value) return null;
  try {
    const city = Array.from(decodeURIComponent(value)).filter((character) => character >= " " && character !== "<" && character !== ">").join("").trim();
    // Browser copy must never present a placeholder, IP address or garbage as a town.
    if (city.length < 2 || city.length > 72) return null;
    if (!/^[\p{L}\p{M} .'-]+$/u.test(city)) return null;
    if (/^(unknown|none|null|undefined|localhost|not available|n\\/?a)$/i.test(city)) return null;
    return city;
  } catch {
    return null;
  }
}

function readCoordinate(value: string | null, min: number, max: number): number | null {
  if (value === null || value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max
    ? Math.round(number * 10) / 10
    : null;
}

export async function GET(request: NextRequest) {
  const city = safeCity(request.headers.get("x-vercel-ip-city"));
  const country = request.headers.get("x-vercel-ip-country")?.slice(0, 2) || null;
  const lat = readCoordinate(request.headers.get("x-vercel-ip-latitude"), -90, 90);
  const lon = readCoordinate(request.headers.get("x-vercel-ip-longitude"), -180, 180);
  const location = { city, country, approximate: true };
  const responseHeaders = { "Cache-Control": "private, no-store" };

  // Do not ask for precise browser location. A coarse Vercel IP position is optional.
  if (!city || lat === null || lon === null) {
    return NextResponse.json({ location, weather: null }, { headers: responseHeaders });
  }

  try {
    const url = new URL("https://api.met.no/weatherapi/locationforecast/2.0/compact");
    url.searchParams.set("lat", lat.toFixed(1));
    url.searchParams.set("lon", lon.toFixed(1));
    const response = await fetch(url, {
      headers: {
        "User-Agent": "bernecki.dev-companion/1.0 (https://bernecki.dev)",
        Accept: "application/json",
      },
      // MET Norway requires caching and forbids unnecessary repeated calls.
      next: { revalidate: 10800 },
      signal: AbortSignal.timeout(4500),
    });
    if (!response.ok) throw new Error("Forecast unavailable");
    const payload = (await response.json()) as {
      properties?: { timeseries?: ForecastPoint[] };
    };
    const now = Date.now();
    const periods = payload.properties?.timeseries;
    const current = periods?.find((p) => {
      const when = Date.parse(p.time || "");
      return Number.isFinite(when) && when >= now - 3_600_000 && when <= now + 3_600_000;
    });
    const temperature = current?.data?.instant?.details?.air_temperature;
    const windSpeed = current?.data?.instant?.details?.wind_speed;
    const symbol = current?.data?.next_1_hours?.summary?.symbol_code;
    if (typeof temperature !== "number" || !Number.isFinite(temperature)) {
      return NextResponse.json({ location, weather: null }, { headers: responseHeaders });
    }

    return NextResponse.json({
      location,
      weather: {
        temperature: Math.round(temperature),
        windSpeed: typeof windSpeed === "number" && Number.isFinite(windSpeed) ? Math.round(windSpeed) : null,
        symbol: typeof symbol === "string" ? symbol : null,
        approximate: true,
        source: "MET Norway",
        sourceUrl: "https://www.met.no/en",
      },
    }, { headers: responseHeaders });
  } catch {
    return NextResponse.json({ location, weather: null }, { headers: responseHeaders });
  }
}
