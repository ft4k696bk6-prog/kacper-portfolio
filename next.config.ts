import type { NextConfig } from "next";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' blob: 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://challenges.cloudflare.com https://cdn.jsdelivr.net;
  script-src-elem 'self' blob: 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://s0.wp.com https:;
  connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://challenges.cloudflare.com https://cdn.jsdelivr.net https://tessdata.projectnaptha.com https://huggingface.co https://*.huggingface.co https://*.hf.co https://*.xethub.hf.co;
  worker-src 'self' blob: https://cdn.jsdelivr.net;
  frame-src https://www.googletagmanager.com https://challenges.cloudflare.com;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\n/g, " ").trim();

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(self)" },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "s0.wp.com", pathname: "/mshots/v1/**" }],
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
