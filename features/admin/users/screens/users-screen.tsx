"use client"

import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { UsersTable } from "../components/users-table"
import { useUsersScreen } from "../hooks/use-users-screen"
import { ROLE_OPTIONS, STATE_OPTIONS } from "../utils/users"

export function UsersScreen() {
  const { list, query, campuses } = useUsersScreen()

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
              value={list.values.role}
              onChange={(role) => list.setFilter({ role })}
              options={ROLE_OPTIONS}
            />
            <OptionSelect
              label="Campus"
              allLabel="Every campus"
              value={list.values.campus}
              onChange={(campus) => list.setFilter({ campus })}
              options={campuses.options}
              className="w-56"
            />
          </TableToolbar>
        }
      />
    </>
  )
}
