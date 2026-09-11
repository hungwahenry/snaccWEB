import { snaccPath, userPath } from "@/features/admin/shell/routes"
import type { ModerationScan } from "../types"

/** Where a review's content can be looked at: the snacc, else the person. */
export function scanTarget(scan: ModerationScan): string | null {
  if (scan.target.snacc_id) return snaccPath(scan.target.snacc_id)
  if (scan.target.user_id) return userPath(scan.target.user_id)
  return null
}

/** Whether what was done matches what the rules decided. Enforcement off makes them differ. */
export function isEnforced(scan: ModerationScan): boolean {
  return scan.applied === scan.verdict
}

/** The category that decided it and its score, or null when none did. */
export function scanScore(scan: ModerationScan): string | null {
  if (!scan.category) return null

  return scan.score === null
    ? scan.category
    : `${scan.category} ${scan.score.toFixed(3)}`
}

export function latencyLabel(ms: number | null): string {
  return ms ? `${ms} ms` : "—"
}
