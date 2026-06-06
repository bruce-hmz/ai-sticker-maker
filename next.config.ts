import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.sensecoreapi-oss.cn" },
    ],
  },
  turbopack: {
    root: import.meta.dirname,
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: [
              "</.well-known/api-catalog>; rel=\"api-catalog\"",
              "</llms.txt>; rel=\"service-doc\"; type=\"text/markdown\"",
              "</.well-known/agents.md>; rel=\"describedby\"; type=\"text/markdown\"",
              "</.well-known/agent-skills/index.json>; rel=\"service-desc\"; type=\"application/json\"",
            ].join(", "),
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://adservice.google.com https://*.googleadservices.com https://ep1.adtrafficquality.google; img-src 'self' https://*.sensecoreapi-oss.cn https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net data: blob:; connect-src 'self' https://*.sensecoreapi-oss.cn https://www.google-analytics.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://adservice.google.com https://*.doubleclick.net https://ep1.adtrafficquality.google https://*.googleadservices.com; style-src 'self' 'unsafe-inline'; frame-src https://googleads.g.doubleclick.net https://td.doubleclick.net https://*.googlesyndication.com https://*.doubleclick.net;",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/thumbnails/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/examples/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/screenshots/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/.well-known/api-catalog",
        headers: [
          {
            key: "Content-Type",
            value: "application/linkset+json",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
