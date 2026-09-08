import { ReportSheet } from "@/features/reports/components/report-sheet"
import { ShareSheet } from "@/features/share/components/share-sheet"
import type { SnaccSheets as Sheets } from "../../hooks/use-snacc-actions"
import { ReactionBreakdownSheet } from "../card/reactions/reaction-breakdown-sheet"
import { ResnaccSheet } from "./resnacc-sheet"
import { SnaccActionsSheet } from "./snacc-actions-sheet"

/// Every sheet a list of snaccs can open, mounted once per screen.
export function SnaccSheets({
  breakdown,
  resnacc,
  actions,
  report,
  share,
}: Sheets) {
  return (
    <>
      <ReactionBreakdownSheet {...breakdown} />
      <ResnaccSheet {...resnacc} />
      <SnaccActionsSheet {...actions} />
      <ReportSheet {...report} />
      <ShareSheet {...share} />
    </>
  )
}
