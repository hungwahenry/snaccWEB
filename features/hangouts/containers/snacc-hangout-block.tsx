"use client"

import { HangoutBlock } from "../components/block/hangout-block"
import { useHangoutBlock } from "../hooks/block/use-hangout-block"
import type { SnaccHangout } from "../types"

export function SnaccHangoutBlock({
  snaccId,
  hangout,
  mine,
  disabled = false,
  readOnly = false,
  linkToSnaccs = true,
}: {
  snaccId: string
  hangout: SnaccHangout
  mine: boolean
  disabled?: boolean
  readOnly?: boolean
  linkToSnaccs?: boolean
}) {
  const block = useHangoutBlock(snaccId, hangout, mine, readOnly)
  return (
    <HangoutBlock
      hangout={hangout}
      block={block}
      disabled={disabled}
      linkToSnaccs={linkToSnaccs}
    />
  )
}
