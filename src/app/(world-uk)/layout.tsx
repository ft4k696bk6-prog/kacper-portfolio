import type { ReactNode } from "react";
import { WorldDocument } from "@/components/world/WorldDocument";

export default function Layout({ children }: { children: ReactNode }) {
  return <WorldDocument locale="uk">{children}</WorldDocument>;
}
