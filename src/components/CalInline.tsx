"use client";

import Cal from "@calcom/embed-react";

interface CalInlineProps {
  calLink: string;
}

export function CalInline({ calLink }: CalInlineProps) {
  return (
    <Cal
      calLink={calLink}
      calOrigin="https://app.cal.com"
      config={{ layout: "month_view" }}
      className="min-h-[560px] w-full [&_iframe]:min-h-[560px] [&_iframe]:w-full"
    />
  );
}
