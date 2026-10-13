"use client"

import { useState } from "react"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { usePendingAction } from "@/features/admin/shell/hooks/use-pending-action"
import type { Option } from "@/features/admin/shell/types"
import type { CampusImportDecision } from "../types"

export function DecisionSelect({
  value,
  options,
  label,
  disabled,
  onChange,
}: {
  value: CampusImportDecision
  options: Option<CampusImportDecision>[]
  label: string
  disabled?: boolean
  onChange: (decision: CampusImportDecision) => Promise<unknown>
}) {
  const [optimistic, setOptimistic] = useState<CampusImportDecision | null>(
    null
  )
  const [pending, run] = usePendingAction(onChange)

  async function choose(next: CampusImportDecision | null) {
    if (next === null || next === value) return
    setOptimistic(next)
    await run(next)
    setOptimistic(null)
  }

  return (
    <OptionSelect
      label={label}
      value={optimistic ?? value}
      onChange={(next) => void choose(next)}
      options={options}
      disabled={disabled || pending}
    />
  )
}
