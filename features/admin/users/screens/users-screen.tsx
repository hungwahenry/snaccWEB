"use client"

import { CampusSearchField } from "@/features/admin/universities/containers/campus-search-field"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { UsersTable } from "../components/users-table"
import { useUsersScreen } from "../hooks/use-users-screen"
import { KIND_OPTIONS, STATE_OPTIONS } from "../utils/users"

export function UsersScreen() {
  const { list, query } = useUsersScreen()

  return (
    <>
      <PageHeader
        title="Users"
        description="Find an account, see what it has been up to, and act on it."
      />
      <UsersTable
        query={query}
        onPageChange={list.setPage}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Search by name, handle or email"
            />
            <OptionSelect
              label="Status"
              allLabel="Any status"
              value={list.values.state}
              onChange={(state) => list.setFilter({ state })}
              options={STATE_OPTIONS}
            />
            <OptionSelect
              label="Account type"
              allLabel="Any account"
              value={list.values.kind}
              onChange={(kind) => list.setFilter({ kind })}
              options={KIND_OPTIONS}
            />
            <div className="w-64">
              <CampusSearchField
                label="Campus"
                value={list.values.campus}
                onChange={(campus) => list.setFilter({ campus })}
                anyLabel="Every campus"
              />
            </div>
          </TableToolbar>
        }
      />
    </>
  )
}
