"use client"

import { useCallback, useEffect, useRef } from "react"
import { recordViews } from "@/features/views/api"
import { trackViewFlush } from "@/features/views/utils/flush"
import { VISIBLE_SHARE } from "@/features/views/utils/visible"

const FLUSH_INTERVAL_MS = 5000
const MAX_PER_FLUSH = 50
const MIN_DWELL_MS = 1000
const MAX_DWELL_MS = 300_000

type CardRef = (node: HTMLElement | null) => (() => void) | undefined

interface TrackedRow {
  id: string
  campaignId: string | null
}

/**
 * Counts how long each snacc is actually on screen and reports it in batches, and tells
 * `onVisible` which ones are on screen as that changes.
 */
export function useViewTracker({
  onVisible,
  onPromoted,
}: {
  onVisible?: (ids: string[]) => void
  onPromoted?: (campaignId: string) => void
} = {}) {
  const observer = useRef<IntersectionObserver | null>(null)
  const ids = useRef<Map<Element, TrackedRow>>(new Map())
  const visible = useRef<Set<string>>(new Set())
  const promoted = useRef<Set<string>>(new Set())
  const since = useRef<Map<string, number>>(new Map())
  const pending = useRef<Map<string, number>>(new Map())
  const sent = useRef<Map<string, number>>(new Map())
  const refs = useRef<Map<string, CardRef>>(new Map())
  const visibleChanged = useRef(onVisible)
  const promotedSeen = useRef(onPromoted)

  useEffect(() => {
    visibleChanged.current = onVisible
    promotedSeen.current = onPromoted
  })

  const announce = useCallback(
    () => visibleChanged.current?.([...visible.current]),
    []
  )

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
    async (final = false) => {
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

      await recordViews(list, { source: "feed", dwellMs }).catch(
        () => undefined
      )
    },
    [bank]
  )

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const now = Date.now()
        for (const entry of entries) {
          const row = ids.current.get(entry.target)
          if (!row) continue
          const { id, campaignId } = row

          if (entry.isIntersecting) {
            visible.current.add(id)
            if (campaignId) {
              promotedSeen.current?.(campaignId)
              continue
            }
            if (!since.current.has(id)) since.current.set(id, now)
            if (!pending.current.has(id) && !sent.current.has(id))
              pending.current.set(id, 0)
          } else {
            visible.current.delete(id)
            if (!campaignId) bank(id, now)
          }
        }
        announce()
      },
      { threshold: VISIBLE_SHARE }
    )
    for (const node of ids.current.keys()) observer.current.observe(node)

    const untrack = trackViewFlush(() => flush())
    const interval = setInterval(() => void flush(), FLUSH_INTERVAL_MS)
    const onVisibility = () => {
      if (document.visibilityState !== "visible") {
        void flush(true)
        return
      }
      const now = Date.now()
      for (const id of visible.current) {
        if (!promoted.current.has(id)) since.current.set(id, now)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      untrack()
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisibility)
      observer.current?.disconnect()
      observer.current = null
      void flush(true)
    }
  }, [announce, bank, flush])

  const ref = useCallback(
    (id: string, campaignId: string | null = null): CardRef => {
      const key = campaignId ? `${id}:${campaignId}` : id
      const known = refs.current.get(key)
      if (known) return known

      const attach: CardRef = (node) => {
        if (!node) return
        ids.current.set(node, { id, campaignId })
        if (campaignId) promoted.current.add(id)
        observer.current?.observe(node)
        return () => {
          ids.current.delete(node)
          observer.current?.unobserve(node)
          if (campaignId) promoted.current.delete(id)
          else bank(id, Date.now())
          if (visible.current.delete(id)) announce()
        }
      }
      refs.current.set(key, attach)
      return attach
    },
    [announce, bank]
  )

  return { ref }
}
