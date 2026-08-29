"use client"

import { use } from "react"
import { DetailScreen } from "@/components/admin/detail-screen"
import { SnaccDetail } from "@/features/admin/snaccs/snacc-detail"
import { useSnacc, useSnaccMutations } from "@/features/admin/snaccs/use-snaccs"

export default function SnaccDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const query = useSnacc(id)
  const actions = useSnaccMutations()

  return (
    <DetailScreen
      backHref="/admin/snaccs"
      backLabel="Back to snaccs"
      missing="Couldn't load this snacc."
      query={query}
    >
      {(snacc) => <SnaccDetail snacc={snacc} actions={actions} />}
    </DetailScreen>
  )
}
