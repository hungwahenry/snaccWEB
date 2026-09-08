"use client"

import { useEffect } from "react"
import { recordViews } from "@/features/views/api"

export function useRecordView(snaccId: string | undefined) {
  useEffect(() => {
    if (snaccId)
      void recordViews([snaccId], { source: "detail" }).catch(() => undefined)
  }, [snaccId])
}
