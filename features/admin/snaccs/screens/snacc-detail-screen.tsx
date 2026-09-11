"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { SNACCS_PATH } from "@/features/admin/shell/routes"
import { SnaccDetail } from "../components/snacc-detail"
import { useSnaccDetailScreen } from "../hooks/use-snacc-detail-screen"

export function SnaccDetailScreen({ id }: { id: string }) {
  const { query, actions } = useSnaccDetailScreen(id)

  return (
    <>
      <BackLink href={SNACCS_PATH} label="Back to snaccs" />
      <QueryView query={query} what="this snacc">
        {(snacc) => <SnaccDetail snacc={snacc} actions={actions} />}
      </QueryView>
    </>
  )
}
