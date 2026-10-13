import "server-only"
import type { LegalDocument, LegalKind } from "../types"

const API_URL = process.env.SNACC_API_URL ?? "http://localhost:3000"

export async function getLegalDocument(
  kind: LegalKind,
  country: string | null
): Promise<LegalDocument | null> {
  const query = country ? `?country=${encodeURIComponent(country)}` : ""
  try {
    const res = await fetch(
      `${API_URL}/api/v1/legal/documents/${kind}${query}`,
      {
        next: { revalidate: 300 },
      }
    )
    if (!res.ok) return null
    return ((await res.json()) as { data: LegalDocument }).data
  } catch {
    return null
  }
}
