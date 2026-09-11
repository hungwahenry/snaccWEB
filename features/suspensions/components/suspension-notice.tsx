"use client"

import { ShieldAlertIcon } from "lucide-react"
import Link from "next/link"
import { useNow } from "@/hooks/use-now"
import { MINUTE_MS } from "@/lib/duration"
import type { Suspension } from "../types"
import { backOn, timeLeft } from "../utils/countdown"
import { GUIDELINES_PATH } from "@/lib/routes"

export function SuspensionNotice({ suspension }: { suspension: Suspension }) {
  const now = useNow(MINUTE_MS)
  const left = suspension.until ? timeLeft(suspension.until, now) : null

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <ShieldAlertIcon className="size-8 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-center text-2xl font-extrabold tracking-tight text-foreground">
          {suspension.title}
        </h1>
        <p className="text-center text-base leading-6 text-muted-foreground">
          {suspension.description}
        </p>
      </div>

      {suspension.indefinite ? (
        <p className="text-center text-sm font-bold text-muted-foreground">
          This one does not lift on its own.
        </p>
      ) : left ? (
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-base font-bold text-foreground">
            You get back in {left}
          </p>
          <p className="text-sm text-muted-foreground">
            {backOn(suspension.until!)}
          </p>
        </div>
      ) : null}

      <p className="mt-2 px-2 text-center text-xs leading-5 text-muted-foreground">
        Making another account to get around this makes the suspension
        permanent. Read our{" "}
        <Link
          href={GUIDELINES_PATH}
          className="text-xs font-medium text-foreground"
        >
          Community Guidelines
        </Link>
        .
      </p>
    </div>
  )
}
