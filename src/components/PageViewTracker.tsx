"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pushToDataLayer } from "@/services/consent";

/**
 * Fires a 'virtual_pageview' event to the GTM dataLayer on every
 * client-side navigation. Renders nothing.
 *
 * Place this component inside the root layout so it covers all routes.
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    pushToDataLayer({
      event: "virtual_pageview",
      page_path: pathname,
      page_title: typeof document !== "undefined" ? document.title : "",
    });
  }, [pathname]);

  return null;
}
