import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: "https://snacc.fyi/sitemap.xml",
    host: "https://snacc.fyi",
  }
}
