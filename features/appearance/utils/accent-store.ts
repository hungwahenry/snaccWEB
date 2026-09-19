import {
  accentOf,
  formatSavedAccent,
  INK,
  NO_ACCENT,
  parseSavedAccent,
  wornBy,
  type Accent,
  type SavedAccent,
} from "./accents"

export const ACCENT_STORAGE_KEY = "snacc_accent"
export const SIGNED_IN_HINT = "snacc_signed_in=1"

const YEAR_S = 60 * 60 * 24 * 365
const listeners = new Set<() => void>()
let worn: Accent | null = null

function readSaved(): SavedAccent {
  try {
    return parseSavedAccent(window.localStorage.getItem(ACCENT_STORAGE_KEY))
  } catch {
    return NO_ACCENT
  }
}

function writeSaved(saved: SavedAccent): void {
  try {
    if (saved.key === INK.key && !saved.owner) {
      window.localStorage.removeItem(ACCENT_STORAGE_KEY)
    } else {
      window.localStorage.setItem(ACCENT_STORAGE_KEY, formatSavedAccent(saved))
    }
  } catch {}
}

function wear(accent: Accent): void {
  if (worn?.key === accent.key) return
  worn = accent
  listeners.forEach((listener) => listener())
}

function signedInHint(): boolean {
  try {
    return document.cookie.includes(SIGNED_IN_HINT)
  } catch {
    return false
  }
}

export function subscribeAccent(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function readAccent(): Accent {
  if (!worn) worn = signedInHint() ? accentOf(readSaved().key) : INK
  return worn
}

export function markSignedIn(): void {
  try {
    if (signedInHint()) return
    document.cookie = `${SIGNED_IN_HINT}; path=/; max-age=${YEAR_S}; samesite=lax`
  } catch {}
}

export function wearAccentFor(userId: string | null): void {
  const saved = readSaved()
  if (userId && saved.owner === null && saved.key !== INK.key) {
    writeSaved({ key: saved.key, owner: userId })
  }
  wear(wornBy(saved, userId))
}

export function pickAccent(accent: Accent, userId: string): void {
  writeSaved({ key: accent.key, owner: userId })
  wear(accent)
}

export function dropAccent(): void {
  writeSaved(NO_ACCENT)
  wear(INK)
}
