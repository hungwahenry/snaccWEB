import type {
  GroupCoverage,
  NamedPlace,
  PlaceRegion,
  RegionGroup,
} from "../types"

export function regionGroups(regions: PlaceRegion[]): RegionGroup[] {
  const children = new Map<string, PlaceRegion[]>()
  for (const region of regions) {
    if (region.parent_id === null) continue
    children.set(region.parent_id, [
      ...(children.get(region.parent_id) ?? []),
      region,
    ])
  }

  const tops = regions.filter((region) => region.parent_id === null)
  const groups = tops
    .filter((top) => children.has(top.id))
    .map((top) => ({ region: top, members: children.get(top.id)! }))
  const loose = tops.filter((top) => !children.has(top.id))

  return loose.length > 0
    ? [...groups, { region: null, members: loose }]
    : groups
}

export function groupCoverage(
  group: RegionGroup,
  picked: string[]
): GroupCoverage {
  if (group.region && picked.includes(group.region.id)) return "all"
  const count = group.members.filter((member) =>
    picked.includes(member.id)
  ).length
  if (count === 0) return "none"
  return count === group.members.length ? "all" : "some"
}

export function toggleGroup(picked: string[], group: RegionGroup): string[] {
  const covered = new Set([
    ...group.members.map((member) => member.id),
    ...(group.region ? [group.region.id] : []),
  ])
  const rest = picked.filter((id) => !covered.has(id))
  if (!group.region || groupCoverage(group, picked) === "all") return rest
  return [...rest, group.region.id]
}

export function toggleMember(
  picked: string[],
  group: RegionGroup,
  memberId: string
): string[] {
  const parentId = group.region?.id ?? null
  const memberIds = group.members.map((member) => member.id)
  const expanded =
    parentId !== null && picked.includes(parentId)
      ? [...picked.filter((id) => id !== parentId), ...memberIds]
      : picked
  const next = expanded.includes(memberId)
    ? expanded.filter((id) => id !== memberId)
    : [...expanded, memberId]

  if (parentId !== null && memberIds.every((id) => next.includes(id)))
    return [...next.filter((id) => !memberIds.includes(id)), parentId]
  return next
}

export function groupSummary(group: RegionGroup, picked: string[]): string {
  const coverage = groupCoverage(group, picked)
  if (coverage === "none") return ""
  if (coverage === "all") return "All"
  const count = group.members.filter((member) =>
    picked.includes(member.id)
  ).length
  return `${count} of ${group.members.length}`
}

export function regionPath(regions: PlaceRegion[], id: string): string {
  const byId = new Map(regions.map((region) => [region.id, region]))
  const names: string[] = []
  let current = byId.get(id)
  while (current && !names.includes(current.name)) {
    names.unshift(current.name)
    current = current.parent_id ? byId.get(current.parent_id) : undefined
  }
  return names.join(" › ")
}

export function namedRegions(
  regions: PlaceRegion[],
  ids: string[]
): NamedPlace[] {
  return regions
    .filter((region) => ids.includes(region.id))
    .map((region) => ({ id: region.id, name: region.name }))
}
