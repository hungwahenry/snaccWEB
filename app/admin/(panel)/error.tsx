"use client"

import * as Sentry from "@sentry/nextjs"
import { TriangleAlertIcon } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { ADMIN_PATH } from "@/features/admin/shell/routes"

export default function PanelError({
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
      title="This page hit a problem"
      description="The rest of the panel is fine. Try the page again, or go back to the dashboard."
      className="min-h-[60dvh]"
      action={
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <Button className="rounded-full" onClick={reset}>
            Try again
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            render={<Link href={ADMIN_PATH} />}
          >
            Dashboard
          </Button>
        </div>
      }
    />
  )
}
