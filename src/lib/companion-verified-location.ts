import type { CompanionServerContext } from "./companion-scenarios";

type BrowserPosition = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

const MAX_BROWSER_ACCURACY_METERS = 1500;
const MAX_IP_CITY_DISAGREEMENT_METERS = 8000;

function distanceMeters(a: BrowserPosition, b: { latitude: number; longitude: number }): number {
  const radians = Math.PI / 180;
  const latitudeDifference = (b.latitude - a.latitude) * radians;
  const longitudeDifference = (b.longitude - a.longitude) * radians;
  const aLatitude = a.latitude * radians;
  const bLatitude = b.latitude * radians;
  const h =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(aLatitude) * Math.cos(bLatitude) * Math.sin(longitudeDifference / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(Math.min(1, h)), Math.sqrt(Math.max(0, 1 - h)));
}

/**
 * Fail-closed. A cellular/Wi-Fi IP lookup is NEVER adequate evidence of the
 * visitor's city on its own. Only trust it when a browser location that was
 * previously granted permission also agrees closely with the IP lookup.
 *
 * This module does not ask for location, reverse-geocode, persist coordinates
 * or send browser GPS coordinates to a server.
 */
export function verifyCompanionIpCity(
  response: CompanionServerContext | null,
  position: BrowserPosition | null,
): CompanionServerContext | null {
  const candidate = response?.location.candidate;
  const city = candidate?.city?.trim() ?? "";
  if (!response || !candidate || !position || city.length < 2) return null;
  if (!Number.isFinite(position.accuracy) || position.accuracy < 0 || position.accuracy > MAX_BROWSER_ACCURACY_METERS) return null;
  if (![position.latitude, position.longitude, candidate.latitude, candidate.longitude].every(Number.isFinite)) return null;
  if (Math.abs(position.latitude) > 90 || Math.abs(candidate.latitude) > 90 ||
      Math.abs(position.longitude) > 180 || Math.abs(candidate.longitude) > 180) return null;

  // Require a small margin even after accounting for browser location error.
  if (distanceMeters(position, candidate) + position.accuracy > MAX_IP_CITY_DISAGREEMENT_METERS) return null;

  return {
    location: {
      city,
      country: response.location.country,
      approximate: true,
    },
    weather: response.weather,
  };
}
