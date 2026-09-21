import { configChanged } from "./cache"

const SPREAD_MS = 5_000

export function onConfigChanged(): void {
  window.setTimeout(configChanged, Math.random() * SPREAD_MS)
}
