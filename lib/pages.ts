import "server-only"

const API_URL = process.env.SNACC_API_URL ?? "http://localhost:3000"

export interface PublicPage {
  slug: string
  title: string
  excerpt: string | null
  html: string
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
}

export async function getPublicPage(slug: string): Promise<PublicPage | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/pages/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const json = (await res.json()) as { data: PublicPage }
    return json.data
  } catch {
    return null
  }
}
