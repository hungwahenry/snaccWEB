"use client"

import { useRouter } from "next/navigation"
import { useGhostWindow } from "@/features/ghost/hooks/use-ghost-window"
import { composePath } from "@/features/snaccs/routes"
import { useBack } from "@/hooks/use-back"
import { useNow } from "@/hooks/use-now"
import { hangoutInfoPath } from "../../routes"
import { canPostFrom } from "../../utils/hangouts"
import { useHangoutPage } from "../info/use-hangout-page"
import { useHangoutSnaccs } from "./use-hangout-snaccs"

const TICK_MS = 60_000

export function useHangoutSnaccsScreen(snaccId: string) {
  const router = useRouter()
  const page = useHangoutPage(snaccId)
  const back = useBack(hangoutInfoPath(snaccId))
  const list = useHangoutSnaccs(snaccId)
  const ghost = useGhostWindow()
  const now = useNow(TICK_MS)
  const { hangout } = page

  return {
    ...page,
    onBack: back,
    list,
    onPost:
      hangout && canPostFrom(hangout, now) && !ghost.active
        ? () => router.push(composePath({ hangoutId: snaccId }))
        : undefined,
  }
}
