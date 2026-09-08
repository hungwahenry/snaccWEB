import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  BirthdayFields,
  type BirthdayDraft,
} from "@/features/birthdays/components/birthday-fields"

export function BirthdayForm({
  locked,
  birthday,
  onChangeBirthday,
  celebrate,
  onChangeCelebrate,
  valid,
  submitting,
  onSubmit,
}: {
  locked: boolean
  birthday: BirthdayDraft
  onChangeBirthday: (next: BirthdayDraft) => void
  celebrate: boolean
  onChangeCelebrate: (next: boolean) => void
  valid: boolean
  submitting: boolean
  onSubmit: () => void
}) {
  return (
    <form
      className="flex flex-col gap-6 px-6 pt-4 pb-8"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">Your birthday</p>
        <BirthdayFields
          value={birthday}
          onChange={onChangeBirthday}
          disabled={locked}
        />
        <p className="text-xs text-muted-foreground">
          {locked
            ? "Your birthday is set. Contact support if it needs changing."
            : "No year — just the day. You can only set this once."}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-sm font-semibold text-foreground">
            Celebrate my birthday
          </p>
          <p className="text-xs text-muted-foreground">
            Marks your name on the day and lets the people who follow you know.
          </p>
        </div>
        <Switch checked={celebrate} onCheckedChange={onChangeCelebrate} />
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-14 text-base"
        disabled={!valid || submitting}
      >
        {submitting ? <Spinner /> : "Save"}
      </Button>
    </form>
  )
}
