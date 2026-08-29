"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function DetailScreen<T>({
  backHref,
  backLabel,
  missing,
  query,
  children,
}: {
  backHref: string
  backLabel: string
  missing: string
  query: UseQueryResult<T | null | undefined>
  children: (data: T) => ReactNode
}) {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 w-fit"
        render={<Link href={backHref} />}
      >
        ← {backLabel}
      </Button>
      {query.isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">{missing}</p>
      ) : (
        children(query.data)
      )}
    </>
  )
}
