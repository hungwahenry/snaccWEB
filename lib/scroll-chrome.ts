const TRAVEL = 24
const NEAR_TOP = 40

export interface ChromeScroll {
  lastY: number | null
  travel: number
  hidden: boolean
}

export const RESTING_CHROME: ChromeScroll = {
  lastY: null,
  travel: 0,
  hidden: false,
}

export function nextChrome(state: ChromeScroll, y: number): ChromeScroll {
  if (y <= NEAR_TOP) return { lastY: y, travel: 0, hidden: false }
  if (state.lastY === null) return { ...state, lastY: y }

  const delta = y - state.lastY
  if (delta === 0) return state

  const travel =
    Math.sign(delta) === Math.sign(state.travel) ? state.travel + delta : delta
  const hidden =
    travel >= TRAVEL ? true : travel <= -TRAVEL ? false : state.hidden

  return { lastY: y, travel, hidden }
}
