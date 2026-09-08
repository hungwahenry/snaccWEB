"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { momentsPath, NEW_MOMENT_PATH } from "../routes"
import type { TrayEntry } from "../types"
import { trayOrder } from "../utils/queue"
import { useMomentsTray } from "./use-moments-tray"

export function useMomentsStrip() {
  const router = useRouter()
  const enabled = useFlag("moments")
  const { data: entries, isPending } = useMomentsTray()

  const open = useCallback(
    (entry: TrayEntry) => router.push(momentsPath(entry.author.id)),
    [router]
  )
  const compose = useCallback(() => router.push(NEW_MOMENT_PATH), [router])

  const all = entries ?? []

  return {
    show: enabled,
    loading: enabled && isPending,
    mine: all.find((entry) => entry.mine) ?? null,
    others: trayOrder(all).filter((entry) => !entry.mine),
    open,
    compose,
  }
}
