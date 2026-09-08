"use client"

import { useCallback, useEffect, useRef } from "react"
import { recordViews } from "@/features/views/api"

const FLUSH_INTERVAL_MS = 5000
const MAX_PER_FLUSH = 50
const MIN_DWELL_MS = 1000
const MAX_DWELL_MS = 300_000
const VISIBLE_SHARE = 0.6

export function useViewTracker() {
  const observer = useRef<IntersectionObserver | null>(null)
  const ids = useRef<Map<Element, string>>(new Map())
  const visible = useRef<Set<string>>(new Set())
  const since = useRef<Map<string, number>>(new Map())
  const pending = useRef<Map<string, number>>(new Map())
  const sent = useRef<Map<string, number>>(new Map())

  const bank = useCallback((id: string, now: number) => {
    const start = since.current.get(id)
    if (start === undefined) return

    since.current.delete(id)
    const watched = now - start
    if (watched <= 0) return

    const banked = pending.current.get(id) ?? 0
    const room = MAX_DWELL_MS - ((sent.current.get(id) ?? 0) + banked)
    if (room <= 0) return

    pending.current.set(id, banked + Math.min(watched, room))
  }, [])

  const flush = useCallback(
    (final = false) => {
      if (final) {
        const now = Date.now()
        for (const id of [...since.current.keys()]) bank(id, now)
      }

      const dwellMs: Record<string, number> = {}
      for (const [id, ms] of pending.current) {
        if (Object.keys(dwellMs).length >= MAX_PER_FLUSH) break
        const unreported = !sent.current.has(id)
        if (!final && !unreported && ms < MIN_DWELL_MS) continue
        dwellMs[id] = ms
      }

      const list = Object.keys(dwellMs)
      if (list.length === 0) return

      for (const id of list) {
        pending.current.delete(id)
        sent.current.set(id, (sent.current.get(id) ?? 0) + dwellMs[id])
      }

      void recordViews(list, { source: "feed", dwellMs }).catch(() => undefined)
    },
    [bank]
  )

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const now = Date.now()
        for (const entry of entries) {
          const id = ids.current.get(entry.target)
          if (!id) continue

          if (entry.isIntersecting) {
            visible.current.add(id)
            if (!since.current.has(id)) since.current.set(id, now)
            if (!pending.current.has(id) && !sent.current.has(id))
              pending.current.set(id, 0)
          } else {
            visible.current.delete(id)
            bank(id, now)
          }
        }
      },
      { threshold: VISIBLE_SHARE }
    )

    const interval = setInterval(() => flush(), FLUSH_INTERVAL_MS)
    const onVisibility = () => {
      if (document.visibilityState !== "visible") {
        flush(true)
        return
      }
      const now = Date.now()
      for (const id of visible.current) since.current.set(id, now)
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisibility)
      observer.current?.disconnect()
      observer.current = null
      flush(true)
    }
  }, [bank, flush])

  const ref = useCallback(
    (id: string) => (node: HTMLElement | null) => {
      if (!node) return
      ids.current.set(node, id)
      observer.current?.observe(node)
      return () => {
        ids.current.delete(node)
        observer.current?.unobserve(node)
        bank(id, Date.now())
      }
    },
    [bank]
  )

  return { ref }
}
