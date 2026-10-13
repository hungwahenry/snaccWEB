import { BirthDateFields } from "@/features/birthdays/components/birth-date-fields"
import type { BirthDateDraft } from "@/features/birthdays/types"

export function BirthdayStep({
  value,
  onChange,
}: {
  value: BirthDateDraft
  onChange: (next: BirthDateDraft) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold tracking-tight">
          When were you born?
        </h1>
        <p className="text-base leading-6 text-muted-foreground">
          We check you&apos;re old enough for Snacc. People only ever see your
          birthday, never the year.
        </p>
      </div>

      <BirthDateFields value={value} onChange={onChange} />
    </div>
  )
}
