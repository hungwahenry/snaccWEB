"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { ConfigTable } from "@/features/admin/config/config-table"
import { useConfig, useUpdateConfig } from "@/features/admin/config/use-config"

export default function ConfigPage() {
  const query = useConfig()
  const update = useUpdateConfig()

  return (
    <>
      <PageHeader title="Config" description="Runtime configuration values. Changes apply within ~30s." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load config.</p>
      ) : (
        <ConfigTable settings={query.data} onUpdate={update.mutate} pending={update.isPending} />
      )}
    </>
  )
}
