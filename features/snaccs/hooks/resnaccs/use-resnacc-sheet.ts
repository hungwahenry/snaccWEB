"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { composePath } from "../../routes"
import type { Snacc } from "../../types"
import { useResnacc } from "./use-resnacc"

export function useResnaccSheet() {
  const router = useRouter()
  const [passing, setPassing] = useState<Snacc | null>(null)
  const [open, setOpen] = useState(false)
  const resnacc = useResnacc()

  return {
    onOpen(snacc: Snacc) {
      setPassing(snacc)
      setOpen(true)
    },
    sheet: {
      open,
      onOpenChange: setOpen,
      mine: passing?.my_resnacc ?? false,
      own: passing?.mine ?? false,
      onResnacc() {
        setOpen(false)
        if (!passing) return
        resnacc.mutate(passing, {})
      },
      onQuote() {
        setOpen(false)
        if (passing) router.push(composePath({ resnaccOfId: passing.id }))
      },
    },
  }
}
