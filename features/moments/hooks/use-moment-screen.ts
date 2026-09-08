"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useReportSheet } from "@/features/reports/hooks/use-report-sheet"
import { profilePath } from "@/features/users/routes"
import { useBack } from "@/hooks/use-back"
import type { TrayEntry } from "../types"
import { nextUnseen, playQueue } from "../utils/queue"
import { useAuthorFlip } from "./use-author-flip"
import { useMomentPlayer } from "./use-moment-player"
import { useMomentViewers } from "./use-moment-viewers"
import { useMomentsTray } from "./use-moments-tray"

export function useMomentScreen(startAuthorId: string) {
  const router = useRouter()
  const back = useBack("/home")
  const closing = useRef(false)

  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    back()
  }, [back])

  const { data: entries } = useMomentsTray()

  // Frozen once, so the order cannot reshuffle underfoot as things are watched. State rather than
  // a ref because it decides what plays, and the tray arrives after the first render.
  const [queue, setQueue] = useState<TrayEntry[] | null>(null)
  if (queue === null && entries !== undefined) setQueue(playQueue(entries))
  const authors = useMemo(() => queue ?? [], [queue])

  const opened = Math.max(
    authors.findIndex((entry) => entry.author.id === startAuthorId),
    0
  )
  const [moved, setMoved] = useState<number | null>(null)
  const at = moved ?? opened
  const authorId = authors[at]?.author.id ?? startAuthorId

  const [backwards, setBackwards] = useState(false)
  const { pageRef, flip } = useAuthorFlip()

  const stepTo = useCallback(
    (to: number) => {
      if (to < 0 || to >= authors.length) return

      flip(to > at ? "forward" : "back", () => {
        setBackwards(to < at)
        setMoved(to)
      })
    },
    [at, authors.length, flip]
  )

  const nextAuthor = useCallback(() => stepTo(at + 1), [at, stepTo])
  const previousAuthor = useCallback(() => stepTo(at - 1), [at, stepTo])

  const advanceAuthor = useCallback(() => {
    const to = nextUnseen(authors, at)
    if (to === -1) {
      close()
      return
    }
    stepTo(to)
  }, [authors, at, close, stepTo])

  const player = useMomentPlayer(authorId, {
    onFinished: advanceAuthor,
    onRewound: previousAuthor,
    enterAtEnd: backwards,
  })
  const current = player.current

  const viewers = useMomentViewers(current?.mine ? current.id : null)
  const report = useReportSheet()

  const { pause, resume, setBackgrounded } = player
  const { open: openReport } = report

  const reportCurrent = useCallback(() => {
    if (!current) return
    pause()
    openReport({ type: "moment", id: current.id })
  }, [current, pause, openReport])

  const openProfile = useCallback(
    (username: string | null) => {
      if (username) router.push(profilePath(username))
    },
    [router]
  )

  useEffect(() => {
    const onVisibility = () =>
      setBackgrounded(document.visibilityState !== "visible")
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [setBackgrounded])

  return {
    close,
    player,
    pageRef,
    nextAuthor,
    previousAuthor,
    reportCurrent,
    openProfile,
    viewers: { items: viewers.data ?? [], loading: viewers.isPending },
    reportSheet: {
      ...report.sheet,
      onOpenChange: (open: boolean) => {
        report.sheet.onOpenChange(open)
        if (!open) resume()
      },
    },
  }
}
