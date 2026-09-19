"use client"

import { useEffect } from "react"
import { withUnread } from "../utils/title"

export function useUnreadTitle(count: number): void {
  useEffect(() => {
    const apply = () => {
      const next = withUnread(document.title, count)
      if (next !== document.title) document.title = next
    }

    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      observer.disconnect()
      document.title = withUnread(document.title, 0)
    }
  }, [count])
}
