import type { MetadataRoute } from "next"

const BASE = "https://snacc.fyi"
const API_URL = process.env.SNACC_API_URL ?? "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, priority: 1 },
    { url: `${BASE}/download`, lastModified: now, priority: 0.8 },
  ]

  try {
    const res = await fetch(`${API_URL}/api/v1/pages`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const json = (await res.json()) as { data: { slug: string }[] }
      for (const page of json.data ?? []) {
        entries.push({ url: `${BASE}/${page.slug}`, lastModified: now, priority: 0.5 })
      }
    }
  } catch {
    // backend unreachable at build — ship the static entries only
  }

  return entries
}
