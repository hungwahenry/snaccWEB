"use client"

import { useShareCapture } from "@/hooks/use-share-capture"

export function useReceiptShare() {
  const capture = useShareCapture("snacc-receipt.png")
  return {
    cardRef: capture.cardRef,
    busy: capture.busy,
    onShare: capture.share,
  }
}
