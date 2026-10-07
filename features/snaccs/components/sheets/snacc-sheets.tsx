import { ReportSheet } from "@/features/reports/components/report-sheet"
import { ShareSheet } from "@/features/share/components/share-sheet"
import type { SnaccSheets as Sheets } from "../../hooks/use-snacc-actions"
import { LikersSheet } from "./likers-sheet"
import { ResnaccSheet } from "./resnacc-sheet"
import { SnaccActionsSheet } from "./snacc-actions-sheet"

export function SnaccSheets({
  likers,
  resnacc,
  actions,
  report,
  share,
}: Sheets) {
  return (
    <>
      <LikersSheet {...likers} />
      <ResnaccSheet {...resnacc} />
      <SnaccActionsSheet {...actions} />
      <ReportSheet {...report} />
      <ShareSheet {...share} />
    </>
  )
}
