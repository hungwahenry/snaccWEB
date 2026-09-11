import { ImagePlusIcon, PlusIcon, XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { PollDraft } from "../../types"

const DAYS = [0, 1, 2, 3, 4, 5, 6, 7]
const HOURS = Array.from({ length: 24 }, (_, hour) => hour)
const MINUTES = Array.from({ length: 12 }, (_, step) => step * 5)

function DurationSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: number
  options: number[]
  onChange: (value: number) => void
}) {
  return (
    <label className="flex flex-1 flex-col gap-1">
      <span className="text-xs font-semibold text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full appearance-none rounded-full bg-input px-4 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export function PollEditor({
  poll,
  problem,
  optionMax,
  maxOptions,
  onSetOption,
  onAddOption,
  onRemoveOption,
  onPickImage,
  onRemoveImage,
  onSetDuration,
  onRemove,
}: {
  poll: PollDraft
  /** Why the poll can't go out yet, when the form alone doesn't show it. */
  problem: string | null
  optionMax: number
  maxOptions: number
  onSetOption: (index: number, text: string) => void
  onAddOption: () => void
  onRemoveOption: (index: number) => void
  onPickImage: (index: number) => void
  onRemoveImage: (index: number) => void
  onSetDuration: (part: "days" | "hours" | "minutes", value: number) => void
  onRemove: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border p-3">
      <div className="flex flex-col gap-2">
        {poll.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            {option.image ? (
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                aria-label={`Remove image from option ${index + 1}`}
                className="relative shrink-0"
              >
                <img
                  src={option.image.uri}
                  alt=""
                  className="size-12 rounded-xl object-cover"
                />
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-background/90 shadow">
                  <XIcon className="size-3" />
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onPickImage(index)}
                aria-label={`Add an image to option ${index + 1}`}
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-input text-muted-foreground transition-opacity hover:opacity-70"
              >
                <ImagePlusIcon className="size-5" />
              </button>
            )}

            <div className="relative flex-1">
              <Input
                value={option.text}
                onChange={(event) => onSetOption(index, event.target.value)}
                placeholder={`Option ${index + 1}${index > 1 ? " (optional)" : ""}`}
                maxLength={optionMax}
                className="h-12 rounded-full px-4 pr-10 text-base md:text-base"
              />
              {poll.options.length > 2 ? (
                <button
                  type="button"
                  onClick={() => onRemoveOption(index)}
                  aria-label={`Remove option ${index + 1}`}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="size-[18px]" />
                </button>
              ) : null}
            </div>
          </div>
        ))}

        {problem ? (
          <p className="px-1 text-xs text-destructive">{problem}</p>
        ) : null}

        {poll.options.length < maxOptions ? (
          <button
            type="button"
            onClick={onAddOption}
            className="flex h-12 items-center justify-center gap-1.5 rounded-full border border-dashed border-border text-sm font-bold text-muted-foreground transition-colors hover:bg-accent"
          >
            <PlusIcon className="size-[18px]" /> Add option
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-muted-foreground">
          Poll length
        </span>
        <div className="flex gap-2">
          <DurationSelect
            label="Days"
            value={poll.days}
            options={DAYS}
            onChange={(value) => onSetDuration("days", value)}
          />
          <DurationSelect
            label="Hours"
            value={poll.hours}
            options={HOURS}
            onChange={(value) => onSetDuration("hours", value)}
          />
          <DurationSelect
            label="Minutes"
            value={poll.minutes}
            options={MINUTES}
            onChange={(value) => onSetDuration("minutes", value)}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="py-1 text-sm font-bold text-destructive active:opacity-60"
      >
        Remove poll
      </button>
    </div>
  )
}
