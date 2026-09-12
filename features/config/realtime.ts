import { getQueryClient } from "@/lib/query/client"
import { configKeys } from "./utils/keys"

const SPREAD_MS = 5_000

/** Spread out, so every open page does not ask for the new settings in the same instant. */
export function onConfigChanged(): void {
  window.setTimeout(
    () => void getQueryClient().invalidateQueries({ queryKey: configKeys.app() }),
    Math.random() * SPREAD_MS
  )
}
