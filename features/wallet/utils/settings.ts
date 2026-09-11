import type { MoneyRequestPrivacy } from "@/features/users/types"

export const REQUEST_PRIVACY_OPTIONS: {
  value: MoneyRequestPrivacy
  label: string
  hint: string
}[] = [
  {
    value: "everyone",
    label: "Everyone",
    hint: "Anyone on Snacc can ask you for money",
  },
  {
    value: "following",
    label: "People you follow",
    hint: "Only people you follow can ask",
  },
  { value: "nobody", label: "No one", hint: "Money requests to you are off" },
]

export function requestPrivacyLabel(value: MoneyRequestPrivacy): string {
  return (
    REQUEST_PRIVACY_OPTIONS.find((option) => option.value === value)?.label ??
    "Everyone"
  )
}

export function mutedCountLabel(count: number): string {
  return count === 0 ? "None" : String(count)
}
