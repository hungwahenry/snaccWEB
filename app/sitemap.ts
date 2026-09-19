import type { MetadataRoute } from "next"
import { campusPath } from "@/features/campus/routes"
import { absoluteUrl, SITE_URL } from "@/lib/site"

const API_URL = process.env.SNACC_API_URL ?? "http://localhost:3000"
const HOUR_S = 3600
const CAMPUS_PAGE_SIZE = 100
const CAMPUS_PAGE_LIMIT = 20

interface CampusPage {
  items: { slug: string }[]
  page: number
  last_page: number
}

async function read<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1${path}`, {
      next: { revalidate: HOUR_S },
    })
    if (!res.ok) return null
    return ((await res.json()) as { data?: T }).data ?? null
  } catch {
    return null
  }
}

async function campusSlugs(): Promise<string[]> {
  const slugs: string[] = []

  for (let page = 1; page <= CAMPUS_PAGE_LIMIT; page += 1) {
    const list = await read<CampusPage>(
      `/universities?perPage=${CAMPUS_PAGE_SIZE}&page=${page}`
    )
    if (!list) break
    slugs.push(...list.items.map((campus) => campus.slug))
    if (list.page >= list.last_page) break
  }

  return slugs
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const [pages, campuses] = await Promise.all([
    read<{ slug: string }[]>("/pages"),
    campusSlugs(),
  ])

  return [
    { url: SITE_URL, lastModified: now, priority: 1 },
    { url: absoluteUrl("/download"), lastModified: now, priority: 0.8 },
    ...campuses.map((slug) => ({
      url: absoluteUrl(campusPath(slug)),
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
    ...(pages ?? []).map((page) => ({
      url: absoluteUrl(`/${page.slug}`),
      lastModified: now,
      priority: 0.5,
    })),
  ]
}
