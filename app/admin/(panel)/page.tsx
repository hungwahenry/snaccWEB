"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { DashboardView } from "@/features/dashboard/dashboard-view"
import { useDashboard } from "@/features/dashboard/use-dashboard"

export default function DashboardPage() {
  const query = useDashboard()

  return (
    <>
      <PageHeader title="Dashboard" description="Your platform at a glance." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load metrics.</p>
      ) : (
        <DashboardView metrics={query.data} />
      )}
    </>
  )
}
