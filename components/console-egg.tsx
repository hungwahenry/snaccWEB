"use client"

import { useEffect } from "react"

const MARK = `
 ███████ ███    ██  █████   ██████  ██████
 ██      ████   ██ ██   ██ ██      ██
 ███████ ██ ██  ██ ███████ ██      ██
      ██ ██  ██ ██ ██   ██ ██      ██
 ███████ ██   ████ ██   ██  ██████  ██████
`

const SEEN = "snacc:egg"

function firstLook(): boolean {
  try {
    if (window.sessionStorage.getItem(SEEN)) return false
    window.sessionStorage.setItem(SEEN, "1")
  } catch {
    // Storage is blocked; say it once per page load instead of once per visit.
  }
  return true
}

export function ConsoleEgg() {
  useEffect(() => {
    if (!firstLook()) return

    console.log(`%c${MARK}`, "color:#ff6b00;font-weight:bold")
    console.log(
      "%cCurious, huh? 👀 You won't find a session token down here — they live in httpOnly cookies the browser won't hand you, and the API checks everything twice anyway.",
      "color:#888;font-size:12px"
    )
    console.log(
      "%cPoke around all you like. If you break something, we'd genuinely love to hear about it.",
      "color:#888;font-size:12px"
    )
    console.log(
      "%c  Build with us  →  hello@snacc.fyi\n  Found a hole    →  security@snacc.fyi",
      "color:#ff6b00;font-size:12px;font-weight:bold"
    )
  }, [])

  return null
}
