import type { NigerianState, RegionCoverage, RegionStates } from "../types"

export const REGIONS: RegionStates[] = [
  {
    key: "north_central",
    label: "North Central",
    states: ["benue", "kogi", "kwara", "nasarawa", "niger", "plateau", "fct"],
  },
  {
    key: "north_east",
    label: "North East",
    states: ["adamawa", "bauchi", "borno", "gombe", "taraba", "yobe"],
  },
  {
    key: "north_west",
    label: "North West",
    states: [
      "jigawa",
      "kaduna",
      "kano",
      "katsina",
      "kebbi",
      "sokoto",
      "zamfara",
    ],
  },
  {
    key: "south_east",
    label: "South East",
    states: ["abia", "anambra", "ebonyi", "enugu", "imo"],
  },
  {
    key: "south_south",
    label: "South South",
    states: ["akwa_ibom", "bayelsa", "cross_river", "delta", "edo", "rivers"],
  },
  {
    key: "south_west",
    label: "South West",
    states: ["ekiti", "lagos", "ogun", "ondo", "osun", "oyo"],
  },
]

export function stateName(state: NigerianState): string {
  if (state === "fct") return "FCT (Abuja)"
  return state
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function regionCoverage(
  region: RegionStates,
  picked: NigerianState[]
): RegionCoverage {
  const count = region.states.filter((state) => picked.includes(state)).length
  if (count === 0) return "none"
  return count === region.states.length ? "all" : "some"
}

export function toggleRegion(
  picked: NigerianState[],
  region: RegionStates
): NigerianState[] {
  if (regionCoverage(region, picked) === "all")
    return picked.filter((state) => !region.states.includes(state))

  return [
    ...picked,
    ...region.states.filter((state) => !picked.includes(state)),
  ]
}

export function regionSummary(
  region: RegionStates,
  picked: NigerianState[]
): string {
  const count = region.states.filter((state) => picked.includes(state)).length
  if (count === 0) return ""
  return count === region.states.length
    ? "All"
    : `${count} of ${region.states.length}`
}
