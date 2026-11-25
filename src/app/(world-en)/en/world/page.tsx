import { World } from "@/components/world/World";
import { worldMetadata, WorldStructuredData } from "@/components/world/WorldDocument";

export const metadata = worldMetadata("en");
export const viewport = { themeColor: "#121512" };

export default function WorldPage() {
  return <><WorldStructuredData locale="en" /><World locale="en" /></>;
}
