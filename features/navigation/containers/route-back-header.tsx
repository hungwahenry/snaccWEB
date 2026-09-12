"use client"

import type { ReactNode } from "react"
import { useBack } from "@/hooks/use-back"
import { BackHeader } from "../components/back-header"

export function RouteBackHeader({
  title,
  subtitle,
  right,
  fallback,
  floating,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
  fallback?: string
  floating?: boolean
}) {
  const back = useBack(fallback)

  return (
    <BackHeader
      title={title}
      subtitle={subtitle}
      right={right}
      floating={floating}
      onBack={back}
    />
  )
}
