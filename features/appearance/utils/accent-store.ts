import { accentOf, type Accent } from "./accents"

const STORAGE_KEY = "snacc_accent"
const listeners = new Set<() => void>()

export function subscribeAccent(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function readAccent(): Accent {
  try {
    return accentOf(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return accentOf(null)
  }
}

export function writeAccent(accent: Accent): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, accent.key)
  } catch {
    // Storage refused the write; the colour lasts for this visit only.
  }
  listeners.forEach((listener) => listener())
}
