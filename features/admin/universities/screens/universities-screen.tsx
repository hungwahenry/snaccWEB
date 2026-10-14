"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { formatNumber } from "@/lib/format"
import { UniversitiesTable } from "../components/universities-table"
import { UniversityDialog } from "../components/university-dialog"
import { useUniversitiesScreen } from "../hooks/use-universities-screen"
import { STATUS_OPTIONS } from "../utils/status"

export function UniversitiesScreen() {
  const { list, query, actions, countries, waiting, showWaiting, campuses } =
    useUniversitiesScreen()

  return (
    <>
      <PageHeader
        title="Campuses"
        description="Every campus on Snacc, who belongs to it, and whether it pays. Campuses people add wait here until someone reviews them."
        action={
          <div className="flex flex-wrap gap-2">
            {waiting > 0 ? (
              <Button variant="outline" size="sm" onClick={showWaiting}>
                {formatNumber(waiting)} waiting for review
              </Button>
            ) : null}
            <CanAct permission="universities.write">
              <UniversityDialog
                trigger={
                  <Button size="sm">
                    <Plus />
                    Add campus
                  </Button>
                }
                onSubmit={(draft) => actions.save(draft)}
              />
            </CanAct>
          </div>
        }
      />
      <UniversitiesTable
        query={query}
        campuses={campuses}
        onPageChange={list.setPage}
        onSave={actions.save}
        onDelete={actions.remove}
        onVerify={actions.verify}
        onReject={actions.reject}
        onMerge={actions.merge}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Search by name, acronym or slug"
            />
            <OptionSelect
              label="Status"
              allLabel="Any status"
              value={list.values.status}
              onChange={(status) => list.setFilter({ status })}
              options={STATUS_OPTIONS}
            />
            <OptionSelect
              label="Country"
              allLabel="Every country"
              value={list.values.country}
              onChange={(country) => list.setFilter({ country })}
              options={countries}
            />
          </TableToolbar>
        }
      />
    </>
  )
}
