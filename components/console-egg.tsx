"use client"

import { useEffect } from "react"

const MARK = String.raw`
   ____ ____  ____ ____ ____
  / __// __ \/ __ '/ __// __/
 _\ \ / / / / /_/ / /__/ /__
/___//_/ /_/\__,_/\___/\___/
`

export function ConsoleEgg() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (window.sessionStorage.getItem("snacc:egg")) return
    try {
      window.sessionStorage.setItem("snacc:egg", "1")
    } catch {}

    console.log(
      `%c${MARK}`,
      "color:#ff6b00;font-family:monospace;font-weight:bold"
    )
    console.log(
      "%cCurious, huh? 👀  The tokens live in httpOnly cookies, the API checks everything twice, and the only secret down here is that we think you'd fit right in.",
      "color:#888;font-size:12px"
    )
    console.log(
      "%cBuild with us → hello@snacc.fyi   ·   Found something? security@snacc.fyi",
      "color:#ff6b00;font-size:12px;font-weight:bold"
    )
  }, [])

  return null
}
