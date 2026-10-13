export const VISIBLE_SHARE = 0.6

export const SCREEN_SHARE = 0.5

export const BILLED_SHARE = 0.5

export const BILLED_VIEW_MS = 1000

export const VISIBILITY_STEPS = Array.from(
  { length: 21 },
  (_, step) => step / 20
)

export function isSeen(view: {
  ratio: number
  height: number
  screen: number | null
}): boolean {
  if (view.ratio >= VISIBLE_SHARE) return true
  return (
    view.screen !== null &&
    view.screen > 0 &&
    view.height / view.screen >= SCREEN_SHARE
  )
}
