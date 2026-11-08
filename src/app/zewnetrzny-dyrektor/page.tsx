import { permanentRedirect } from "next/navigation";

/** Legacy URL kept for external links and bookmarks. */
export default function LegacyFractionalDirectorPage() {
  permanentRedirect("/partner-w-rozwoju-biznesu");
}
