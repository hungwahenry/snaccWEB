"use client"

import { SegmentedControl } from "@/components/ui/segmented-control"
import { RANGES } from "../routes"

const OPTIONS = RANGES.map((range) => ({
  value: range.days,
  label: range.label,
}))

export function RangePicker({
  days,
  onChange,
}: {
  days: number
  onChange: (days: number) => void
}) {
  return (
    <SegmentedControl
      label="Time range"
      value={days}
      options={OPTIONS}
      onChange={onChange}
    />
  )
}
