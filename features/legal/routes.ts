import type { LegalKind } from "./types"

export const AGREE_PATH = "/agree"

export function legalPath(kind: LegalKind, country?: string | null): string {
  return country
    ? `/${kind}?country=${encodeURIComponent(country)}`
    : `/${kind}`
}
