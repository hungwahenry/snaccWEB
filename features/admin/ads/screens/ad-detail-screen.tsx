"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { ADS_PATH } from "@/features/admin/shell/routes"
import { AdDetail } from "../components/ad-detail"
import { useAdDetailScreen } from "../hooks/use-ad-detail-screen"

export function AdDetailScreen({ id }: { id: string }) {
  const { query, actions, reasons } = useAdDetailScreen(id)

  return (
    <>
      <BackLink href={ADS_PATH} label="Back to promotions" />
      <QueryView query={query} what="this promotion">
        {(ad) => <AdDetail ad={ad} reasons={reasons} actions={actions} />}
      </QueryView>
    </>
  )
}
