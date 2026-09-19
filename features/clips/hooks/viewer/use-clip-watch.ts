"use client"

import { useEffect, useState } from "react"
import { recordViews } from "@/features/views/api"
import { WatchLedger } from "../../utils/watch-ledger"

const FLUSH_MS = 10_000

function send(ledger: WatchLedger): void {
  const report = ledger.take(Date.now())
  if (report.ids.length === 0) return

  void recordViews(report.ids, {
    source: "clip",
    dwellMs: report.dwellMs,
    watchMs: report.watchMs,
  }).catch(() => undefined)
}

export function useClipWatch(
  currentId: string | null,
  visible: boolean,
  playing: boolean
) {
  const [ledger] = useState(() => new WatchLedger())

  useEffect(() => {
    ledger.show(visible ? currentId : null, Date.now())
    if (!visible) send(ledger)
  }, [ledger, currentId, visible])

  useEffect(() => {
    ledger.playing(playing && visible, Date.now())
  }, [ledger, playing, visible])

  useEffect(() => {
    const timer = setInterval(() => send(ledger), FLUSH_MS)

    return () => {
      clearInterval(timer)
      ledger.show(null, Date.now())
      send(ledger)
    }
  }, [ledger])
}
