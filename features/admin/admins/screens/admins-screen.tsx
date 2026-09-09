"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { AdminsTable } from "../components/admins-table"
import { useAdmins } from "../hooks/use-admins"

export function AdminsScreen() {
  const query = useAdmins()

  return (
    <>
      <PageHeader
        title="Admins"
        description="Everyone who can reach this panel, and what they hold."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load admins.
        </p>
      ) : (
        <AdminsTable admins={query.data} />
      )}
    </>
  )
}
