"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { UniversitiesTable } from "../components/universities-table"
import { UniversityDialog } from "../components/university-dialog"
import { useUniversitiesScreen } from "../hooks/use-universities-screen"

export function UniversitiesScreen() {
  const { list, query, actions } = useUniversitiesScreen()

  return (
    <>
      <PageHeader
        title="Universities"
        description="Every campus on Snacc, who belongs to it, and whether it pays."
        action={
          <CanAct permission="universities.write">
            <UniversityDialog
              trigger={
                <Button size="sm">
                  <Plus />
                  Add university
                </Button>
              }
              onSubmit={(draft) => actions.save(draft)}
            />
          </CanAct>
        }
      />
      <UniversitiesTable
        query={query}
        onPageChange={list.setPage}
        onSave={actions.save}
        onDelete={actions.remove}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Search by name, acronym or slug"
            />
          </TableToolbar>
        }
      />
    </>
  )
}
