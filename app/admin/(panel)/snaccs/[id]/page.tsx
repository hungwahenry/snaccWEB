"use client"

import Link from "next/link"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { SnaccDetail } from "@/features/admin/snaccs/snacc-detail"
import { useSnacc, useSnaccMutations } from "@/features/admin/snaccs/use-snaccs"

export default function SnaccDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const query = useSnacc(id)
  const actions = useSnaccMutations()

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 w-fit"
        render={<Link href="/admin/snaccs" />}
      >
        ← Back to snaccs
      </Button>
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load this snacc.</p>
      ) : (
        <SnaccDetail snacc={query.data} actions={actions} />
      )}
    </>
  )
}
