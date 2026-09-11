import type { Gender } from "../types"

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non_binary", label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
]

export function isGender(value: string): value is Gender {
  return GENDER_OPTIONS.some((option) => option.value === value)
}
