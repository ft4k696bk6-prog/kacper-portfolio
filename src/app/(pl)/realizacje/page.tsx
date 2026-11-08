import { permanentRedirect } from "next/navigation";

/** Backwards compatible legacy index; case studies is the canonical catalog. */
export default function OldRealizationsIndex() {
  permanentRedirect("/case-studies");
}
