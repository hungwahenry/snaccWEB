"use client"

import * as Sentry from "@sentry/nextjs"
import { TriangleAlertIcon } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
    Sentry.captureException(error)
  }, [error])

  return (
    <EmptyState
      icon={TriangleAlertIcon}
      title="Something went wrong here"
      description="The rest of Snacc is fine. Try this page again, or head back home."
      className="min-h-[60dvh]"
      action={
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <Button className="rounded-full" onClick={reset}>
            Try again
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            render={<Link href="/" />}
          >
            Go home
          </Button>
        </div>
      }
    />
  )
}
