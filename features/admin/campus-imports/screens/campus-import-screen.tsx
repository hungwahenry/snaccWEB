"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { CAMPUS_IMPORTS_PATH } from "@/features/admin/shell/routes"
import { CampusImportDetail } from "../components/campus-import-detail"
import { ImportRowsTable } from "../components/import-rows-table"
import { useCampusImportScreen } from "../hooks/use-campus-import-screen"
import { DECISION_OPTIONS, MATCH_OPTIONS } from "../utils/campus-imports"

export function CampusImportScreen({ id }: { id: string }) {
  const { query, rows, list, places, campuses, actions } =
    useCampusImportScreen(id)

  return (
    <>
      <BackLink href={CAMPUS_IMPORTS_PATH} label="Back to campus imports" />
      <QueryView query={query} what="this import">
        {(run) => (
          <CampusImportDetail
            run={run}
            onApply={actions.apply}
            onRecheck={actions.recheck}
            onDiscard={actions.discard}
            rows={
              <ImportRowsTable
                query={rows}
                source={run.source}
                editable={run.status === "ready"}
                places={places}
                campuses={campuses}
                onPageChange={list.setPage}
                onEdit={actions.editRow}
                toolbar={
                  <TableToolbar
                    onReset={list.filtered ? list.reset : undefined}
                  >
                    <SearchField
                      value={list.values.q}
                      onChange={(q) => list.setFilter({ q })}
                      placeholder="Search by name"
                    />
                    <OptionSelect
                      label="Match"
                      allLabel="Any match"
                      value={list.values.match}
                      onChange={(match) => list.setFilter({ match })}
                      options={MATCH_OPTIONS}
                      className="w-48"
                    />
                    <OptionSelect
                      label="Decision"
                      allLabel="Any decision"
                      value={list.values.decision}
                      onChange={(decision) => list.setFilter({ decision })}
                      options={DECISION_OPTIONS}
                    />
                  </TableToolbar>
                }
              />
            }
          />
        )}
      </QueryView>
    </>
  )
}
