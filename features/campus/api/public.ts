import { serverGet } from "@/lib/api/server"
import type { UniversityDetail } from "../types"

export function getPublicCampus(
  slug: string
): Promise<UniversityDetail | null> {
  return serverGet<UniversityDetail>(
    `/universities/${encodeURIComponent(slug)}`
  )
}
