"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { useMe } from "@/features/admin/auth/hooks/use-auth"
import { DashboardView } from "@/features/admin/dashboard/components/dashboard-view"
import { useDashboard } from "@/features/admin/dashboard/hooks/use-dashboard"
import { firstAllowedHref } from "@/lib/nav"
import { can } from "@/lib/permissions"

export default function DashboardPage() {
  const router = useRouter()
  const me = useMe()
  const allowed = can(me.data?.permissions, "dashboard.read")
  const query = useDashboard()

  useEffect(() => {
    if (me.data && !allowed) {
      router.replace(firstAllowedHref(me.data.permissions) ?? "/admin/login")
    }
  }, [me.data, allowed, router])

  if (me.isPending || (me.data && !allowed)) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <PageHeader title="Dashboard" description="Your platform at a glance." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load metrics.
        </p>
      ) : (
        <DashboardView metrics={query.data} />
      )}
    </>
  )
}
