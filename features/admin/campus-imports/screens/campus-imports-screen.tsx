"use client"

import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { CampusImportsTable } from "../components/campus-imports-table"
import { CheckCountryDialog } from "../components/check-country-dialog"
import { ImportFileDialog } from "../components/import-file-dialog"
import { useCampusImportsScreen } from "../hooks/use-campus-imports-screen"

export function CampusImportsScreen() {
  const { list, query, countries, importFile, checkCountry } =
    useCampusImportsScreen()

  return (
    <>
      <PageHeader
        title="Campus imports"
        description="Bring in a country's campuses from a file, or check the ones already on Snacc. Every row waits for your review, and nothing changes until you apply."
        action={
          <div className="flex flex-wrap gap-2">
            <CanAct permission="universities.import">
              <CheckCountryDialog
                countries={countries}
                trigger={
                  <Button variant="outline" size="sm">
                    Check a country
                  </Button>
                }
                onCheck={checkCountry}
              />
            </CanAct>
            <CanAct permission="universities.import">
              <ImportFileDialog
                countries={countries}
                trigger={<Button size="sm">Import a file</Button>}
                onImport={importFile}
              />
            </CanAct>
          </div>
        }
      />
      <CampusImportsTable
        query={query}
        onPageChange={list.setPage}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
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
