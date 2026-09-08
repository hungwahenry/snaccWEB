import { CheckIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import type { MoneyRequestPrivacy } from "@/features/users/types"

const OPTIONS: { value: MoneyRequestPrivacy; label: string; hint: string }[] = [
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

export function RequestPrivacySheet({
  open,
  onOpenChange,
  value,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: MoneyRequestPrivacy
  onSelect: (value: MoneyRequestPrivacy) => void
}) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Who can ask you for money?"
      className="px-4"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onSelect(option.value)}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left transition-colors hover:bg-accent/60 active:opacity-70"
        >
          <span className="flex flex-1 flex-col">
            <span className="text-base text-foreground">{option.label}</span>
            <span className="text-xs text-muted-foreground">{option.hint}</span>
          </span>
          {value === option.value ? (
            <CheckIcon className="size-5 text-foreground" />
          ) : null}
        </button>
      ))}
    </ActionSheet>
  )
}
