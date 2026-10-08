"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { PackTitleDialog } from "../components/pack-title-dialog"
import { StickerPacksTable } from "../components/sticker-packs-table"
import { useStickerPacksScreen } from "../hooks/use-sticker-packs-screen"
import { LISTED_OPTIONS, OWNER_OPTIONS, STATUS_OPTIONS } from "../utils/packs"

export function StickerPacksScreen() {
  const { list, query, create } = useStickerPacksScreen()

  return (
    <>
      <PageHeader
        title="Sticker packs"
        description="Snacc's own packs, which you make and publish here, and the packs people make for themselves."
        action={
          <CanAct permission="stickers.write">
            <PackTitleDialog
              heading="New Snacc pack"
              description="It starts as a draft only admins can see. Add stickers next, then publish it."
              submitLabel="Start the pack"
              trigger={
                <Button size="sm">
                  <Plus />
                  New pack
                </Button>
              }
              onSubmit={create}
            />
          </CanAct>
        }
      />
      <StickerPacksTable
        query={query}
        filtered={list.filtered}
        onPageChange={list.setPage}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Pack name or @username"
            />
            <OptionSelect
              label="Made by"
              allLabel="Anyone's"
              value={list.values.owner}
              onChange={(owner) => list.setFilter({ owner })}
              options={OWNER_OPTIONS}
            />
            <OptionSelect
              label="Status"
              allLabel="Any status"
              value={list.values.status}
              onChange={(status) => list.setFilter({ status })}
              options={STATUS_OPTIONS}
            />
            <OptionSelect
              label="Catalog"
              allLabel="In or out of the catalog"
              value={list.values.listed}
              onChange={(listed) => list.setFilter({ listed })}
              options={LISTED_OPTIONS}
              className="w-52"
            />
          </TableToolbar>
        }
      />
    </>
  )
}
