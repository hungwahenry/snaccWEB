import type { Option } from "@/features/admin/shell/types"
import { plural } from "@/features/admin/shell/utils/format"
import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type {
  AdminCampusType,
  AdminRegion,
  CampusTypeDraft,
  CampusTypeInput,
  RegionInput,
} from "../types"

export const TOP_LEVEL = "top"

export interface RegionRow {
  region: AdminRegion
  depth: number
}

export function regionRows(regions: AdminRegion[]): RegionRow[] {
  const ids = new Set(regions.map((region) => region.id))
  const children = new Map<string | null, AdminRegion[]>()
  for (const region of regions) {
    const parent =
      region.parent_id !== null && ids.has(region.parent_id)
        ? region.parent_id
        : null
    children.set(parent, [...(children.get(parent) ?? []), region])
  }

  const rows: RegionRow[] = []
  const visit = (parent: string | null, depth: number) => {
    const level = [...(children.get(parent) ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    for (const region of level) {
      rows.push({ region, depth })
      visit(region.id, depth + 1)
    }
  }
  visit(null, 0)
  return rows
}

function descendantsOf(regions: AdminRegion[], id: string): Set<string> {
  const found = new Set([id])
  let grew = true
  while (grew) {
    grew = false
    for (const region of regions) {
      if (
        region.parent_id !== null &&
        found.has(region.parent_id) &&
        !found.has(region.id)
      ) {
        found.add(region.id)
        grew = true
      }
    }
  }
  return found
}

export function parentOptions(
  regions: AdminRegion[],
  editing?: AdminRegion
): Option[] {
  const excluded = editing ? descendantsOf(regions, editing.id) : new Set()

  return [
    { value: TOP_LEVEL, label: "None, it is a top-level region" },
    ...regionRows(regions)
      .filter(({ region }) => !excluded.has(region.id))
      .map(({ region, depth }) => ({
        value: region.id,
        label: `${"· ".repeat(depth)}${region.name}`,
      })),
  ]
}

export function toRegionInput(
  name: string,
  parent: string
): RegionInput | null {
  const trimmed = name.trim()
  if (!trimmed) return null

  return { name: trimmed, parentId: parent === TOP_LEVEL ? null : parent }
}

export function typeDraftFrom(type?: AdminCampusType): CampusTypeDraft {
  return { name: type?.name ?? "", position: type ? String(type.position) : "" }
}

export function toCampusTypeInput(
  draft: CampusTypeDraft
): CampusTypeInput | null {
  const name = draft.name.trim()
  if (!name) return null
  if (draft.position.trim() === "") return { name }

  const position = parseWholeNumber(draft.position, { min: 0, max: 1000 })
  return position === null ? null : { name, position }
}

export function usageNote(place: {
  campuses: number
  promotions: number
}): string {
  if (place.campuses === 0 && place.promotions === 0) return "Not used yet"

  return [
    place.campuses > 0 ? plural(place.campuses, "campus", "campuses") : null,
    place.promotions > 0 ? plural(place.promotions, "promotion") : null,
  ]
    .filter(Boolean)
    .join(" · ")
}
