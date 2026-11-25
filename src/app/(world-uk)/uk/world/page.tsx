import { World } from "@/components/world/World";
import { worldMetadata, WorldStructuredData } from "@/components/world/WorldDocument";

export const metadata = worldMetadata("uk");
export const viewport = { themeColor: "#121512" };

export default function WorldPage() {
  return <><WorldStructuredData locale="uk" /><World locale="uk" /></>;
}
