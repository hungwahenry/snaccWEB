"use client"

import { BadgeCheckIcon } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { PREMIUM_PATH } from "@/features/premium/routes"
import { cn } from "@/lib/utils"

/**
 * The one way a limit offers Premium. Presentational: whoever renders it has already decided that
 * this account would gain something, so there is no second answer to that question here.
 *
 * Wraps whatever already marks the limit — a character countdown, a photo count — rather than
 * sitting beside it, so nothing is added to a row that has no room for it.
 */
export function PremiumNudge({
  show,
  label,
  children,
  className,
}: {
  show: boolean
  label?: string
  children?: ReactNode
  className?: string
}) {
  if (!show) return <>{children}</>

  return (
    <Link
      href={PREMIUM_PATH}
      aria-label={`${label ?? "Limit reached"}. Opens Premium.`}
      className={cn(
        "flex shrink items-center gap-1 self-center rounded-full bg-premium/15 py-0.5 pr-2 pl-1.5 transition-opacity hover:opacity-80",
        className
      )}
    >
      <BadgeCheckIcon className="size-[13px] shrink-0 text-premium" />
      {children ?? (
        <span className="shrink truncate text-[11px] leading-4 font-semibold text-premium">
          {label}
        </span>
      )}
    </Link>
  )
}
