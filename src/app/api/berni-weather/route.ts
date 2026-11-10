import { NextRequest, NextResponse } from "next/server";
import { classifyBerniWeather } from "@/lib/berni-reactions";

export const runtime = "nodejs";

type MetForecast = {
  properties?: {
    timeseries?: Array<{
      time?: string;
      data?: {
        instant?: { details?: { air_temperature?: number; wind_speed?: number } };
        next_1_hours?: { summary?: { symbol_code?: string } };
        next_6_hours?: { summary?: { symbol_code?: string } };
      };
    }>;
  };
};

export async function GET(request: NextRequest) {
  const rawLatitude = request.nextUrl.searchParams.get("lat") ?? request.headers.get("x-vercel-ip-latitude");
  const rawLongitude = request.nextUrl.searchParams.get("lon") ?? request.headers.get("x-vercel-ip-longitude");
  const latitude = rawLatitude === null ? Number.NaN : Number(rawLatitude);
  const longitude = rawLongitude === null ? Number.NaN : Number(rawLongitude);
  if (
    !Number.isFinite(latitude) || !Number.isFinite(longitude) ||
    latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180
  ) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  // Only coarse ~11km coordinates are sent upstream. No coordinates are stored.
  const lat = (Math.round(latitude * 10) / 10).toFixed(1);
  const lon = (Math.round(longitude * 10) / 10).toFixed(1);

  try {
    const forecastResponse = await fetch(
      "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=" + lat + "&lon=" + lon,
      {
        headers: {
          "User-Agent": "BerniCompanion/1.0 (https://bernecki.dev; contact via website)",
          "Accept": "application/json",
        },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(6500),
      },
    );

    if (!forecastResponse.ok) {
      return NextResponse.json({ error: "Weather unavailable" }, { status: 503 });
    }

    const forecast = (await forecastResponse.json()) as MetForecast;
    const current = forecast.properties?.timeseries?.[0];
    const details = current?.data?.instant?.details;
    const symbol = current?.data?.next_1_hours?.summary?.symbol_code
      ?? current?.data?.next_6_hours?.summary?.symbol_code
      ?? "";

    if (!details || !Number.isFinite(details.air_temperature)) {
      return NextResponse.json({ error: "Weather unavailable" }, { status: 503 });
    }

    return NextResponse.json(
      {
        condition: classifyBerniWeather(symbol, details.wind_speed),
        temperature: details.air_temperature,
        updatedAt: current?.time ?? new Date().toISOString(),
        source: "MET Norway",
        forecast: true,
      },
      { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } },
    );
  } catch {
    return NextResponse.json({ error: "Weather unavailable" }, { status: 503 });
  }
}
