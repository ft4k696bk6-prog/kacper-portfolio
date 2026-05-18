import type { NextConfig } from "next";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://challenges.cloudflare.com https://app.cal.com https://cal.com;
  script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com https://app.cal.com https://cal.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://app.cal.com https://cal.com;
  connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://challenges.cloudflare.com https://app.cal.com https://cal.com;
  frame-src https://www.googletagmanager.com https://challenges.cloudflare.com https://app.cal.com https://cal.com;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\n/g, " ").trim();

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
