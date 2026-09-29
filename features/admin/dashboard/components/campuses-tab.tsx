import type { CampusRow } from "../types"
import { CampusTableSection, MostActiveSection } from "./campuses-sections"

export function CampusesTab({
  campuses,
  days,
}: {
  campuses: CampusRow[]
  days: number
}) {
  return (
    <div className="flex flex-col gap-6">
      <MostActiveSection campuses={campuses} />
      <CampusTableSection campuses={campuses} days={days} />
    </div>
  )
}
