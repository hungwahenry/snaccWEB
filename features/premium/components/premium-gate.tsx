"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { BadgeCheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useIsPremium } from "../hooks/use-premium-limit"
import { PREMIUM_PATH } from "../routes"

/** How much of the feature stays legible above the fade. A taste, not a free look. */
const PEEK = "20%"

/**
 * Shows the feature rather than describing it, then fades it into the pitch. Seeing the thing you
 * cannot have yet is the argument; a screen that hides it has nothing to sell.
 *
 * The preview is inert, so nothing behind the fade can be clicked.
 */
export function PremiumGate({
  title,
  body,
  children,
}: {
  title: string
  body: string
  children: ReactNode
}) {
  const offered = useFlag("premium")
  const active = useIsPremium()

  if (active) return <>{children}</>

  return (
    <div className="relative flex-1">
      <div aria-hidden className="pointer-events-none select-none">
        {children}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{ height: `calc(100% - ${PEEK})` }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background to-background" />

        <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-8 pb-10 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-premium/15">
            <BadgeCheckIcon className="size-10 text-premium" />
          </span>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl font-extrabold">{title}</h2>
            <p className="text-[15px] text-pretty text-muted-foreground">
              {body}
            </p>
          </div>

          {/* With Premium off there is nothing to sell, so the pitch stands without the button. */}
          {offered ? (
            <Button
              size="lg"
              className="w-full max-w-sm"
              render={<Link href={PREMIUM_PATH} />}
            >
              Get Premium
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
