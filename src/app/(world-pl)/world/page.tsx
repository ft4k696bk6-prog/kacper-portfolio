import { World } from "@/components/world/World";
import { worldMetadata, WorldStructuredData } from "@/components/world/WorldDocument";

export const metadata = worldMetadata("pl");
export const viewport = { themeColor: "#121512" };

export default function WorldPage() {
  return <><WorldStructuredData locale="pl" /><World locale="pl" /></>;
}
