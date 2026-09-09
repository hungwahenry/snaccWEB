"use client"

import { useEffect } from "react"

const MARK = `
 ███████ ███    ██  █████   ██████  ██████
 ██      ████   ██ ██   ██ ██      ██
 ███████ ██ ██  ██ ███████ ██      ██
      ██ ██  ██ ██ ██   ██ ██      ██
 ███████ ██   ████ ██   ██  ██████  ██████
`

export function ConsoleEgg() {
  useEffect(() => {
    console.log(`%c${MARK}`, "color:#ff6b00;font-weight:bold")
    console.log(
      "%cCurious one, aren't you? 👀 You won't find a session token down here, they live in httpOnly cookies the browser won't hand you, and the API checks everything twice anyway.",
      "color:#888;font-size:12px"
    )
    console.log(
      "%cPoke around all you like. If you break something, I'd genuinely love to hear about it.",
      "color:#888;font-size:12px"
    )
    console.log(
      "%c  Send me an email  →  henry@snacc.fyi\n  Found a hole    →  security@snacc.fyi",
      "color:#ff6b00;font-size:12px;font-weight:bold"
    )
  }, [])

  return null
}
