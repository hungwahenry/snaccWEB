import type { Option } from "@/features/admin/shell/types"
import type { NigerianState } from "../types"

export const NIGERIAN_STATES = [
  "abia",
  "adamawa",
  "akwa_ibom",
  "anambra",
  "bauchi",
  "bayelsa",
  "benue",
  "borno",
  "cross_river",
  "delta",
  "ebonyi",
  "edo",
  "ekiti",
  "enugu",
  "gombe",
  "imo",
  "jigawa",
  "kaduna",
  "kano",
  "katsina",
  "kebbi",
  "kogi",
  "kwara",
  "lagos",
  "nasarawa",
  "niger",
  "ogun",
  "ondo",
  "osun",
  "oyo",
  "plateau",
  "rivers",
  "sokoto",
  "taraba",
  "yobe",
  "zamfara",
  "fct",
] as const satisfies readonly NigerianState[]

export function stateName(state: NigerianState): string {
  if (state === "fct") return "FCT (Abuja)"

  return state
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export const STATE_OPTIONS: Option<NigerianState>[] = NIGERIAN_STATES.map(
  (state) => ({ value: state, label: stateName(state) })
)
