import type { UseQueryResult } from "@tanstack/react-query"
import { CloudOff } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { getErrorMessage } from "@/lib/api/errors"
import { cn } from "@/lib/utils"

export function LoadingBlock({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center py-16", className)}>
      <Spinner className="size-5 text-muted-foreground" />
    </div>
  )
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3 p-4" aria-busy aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-8 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function LoadError({
  what,
  error,
  onRetry,
}: {
  what: string
  error: unknown
  onRetry: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 px-6 py-12 text-center"
    >
      <CloudOff className="size-8 text-muted-foreground/50" aria-hidden />
      <p className="font-medium">Couldn&apos;t load {what}</p>
      <p className="max-w-sm text-sm text-pretty text-muted-foreground">
        {getErrorMessage(error)}
      </p>
      <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}

/** Loading, failed with a retry, or the data: the three states every admin read goes through. */
export function QueryView<T>({
  query,
  what,
  loading = <LoadingBlock />,
  children,
}: {
  query: UseQueryResult<T>
  what: string
  loading?: ReactNode
  children: (data: T) => ReactNode
}) {
  if (query.isPending) return <>{loading}</>
  if (query.data === undefined) {
    return (
      <LoadError
        what={what}
        error={query.error}
        onRetry={() => void query.refetch()}
      />
    )
  }

  return <>{children(query.data)}</>
}
