"use client"

import { DiscoverSections } from "../components/discover-sections"
import { useDiscoverRail } from "../hooks/use-discover-rail"

export function DiscoverRail() {
  const rail = useDiscoverRail()

  return (
    <div className="flex flex-col gap-5 [--gutter:24px]">
      <DiscoverSections {...rail} />
    </div>
  )
}
