import type { MetadataRoute } from "next"
import { absoluteUrl, SITE_URL } from "@/lib/site"

const SIGNED_IN_ONLY = [
  "/home",
  "/messages",
  "/chat",
  "/compose",
  "/clips",
  "/moments",
  "/notifications",
  "/wallet",
  "/earnings",
  "/invite",
  "/insights",
  "/premium",
  "/saved",
  "/score",
  "/search",
  "/settings",
  "/visitors",
  "/follows",
  "/follow-requests",
  "/resnaccs",
  "/eggs",
  "/avatar-editor",
  "/edit-profile",
  "/edit-birthday",
  "/edit-university",
  "/complete-profile",
  "/suspended",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", ...SIGNED_IN_ONLY],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  }
}
