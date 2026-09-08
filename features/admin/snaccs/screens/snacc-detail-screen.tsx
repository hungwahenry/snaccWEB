"use client"

import { DetailScreen } from "@/features/admin/shell/ui/detail-screen"
import { SnaccDetail } from "@/features/admin/snaccs/components/snacc-detail"
import {
  useSnacc,
  useSnaccMutations,
} from "@/features/admin/snaccs/hooks/use-snaccs"

export function SnaccDetailScreen({ id }: { id: string }) {
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
