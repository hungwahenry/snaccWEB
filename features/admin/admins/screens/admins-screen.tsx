"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { AdminsTable } from "../components/admins-table"
import { useAdminsScreen } from "../hooks/use-admins-screen"

export function AdminsScreen() {
  const { query, campuses } = useAdminsScreen()

  return (
    <>
      <PageHeader
        title="Admins"
        description="Everyone who can reach this panel, and what they hold."
      />
      <AdminsTable query={query} acronyms={campuses.acronyms} />
    </>
  )
}
