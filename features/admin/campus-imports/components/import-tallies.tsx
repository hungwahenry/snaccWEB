import { Stat, StatGrid } from "@/features/admin/shell/components/detail"
import { formatNumber } from "@/lib/format"
import type { CampusImportTallies } from "../types"

export function ImportTallies({ rows }: { rows: CampusImportTallies }) {
  return (
    <StatGrid columns={4}>
      <Stat
        label="New"
        value={formatNumber(rows.new)}
        hint="Not on Snacc yet"
      />
      <Stat
        label="Already on Snacc"
        value={formatNumber(rows.same)}
        hint="Applying fills in what ours is missing"
      />
      <Stat
        label="Look like ours"
        value={formatNumber(rows.similar)}
        hint="Decide each one"
      />
      <Stat
        label="Not decided"
        value={formatNumber(rows.undecided)}
        hint="Left as they are when you apply"
      />
    </StatGrid>
  )
}
