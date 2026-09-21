import { ChevronRightIcon, MapPinIcon, MinusIcon, PlusIcon } from "lucide-react"
import { EmojiPicker } from "@/components/ui/emoji-picker"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { HangoutDraft, HangoutLimits } from "../../types"
import { HANGOUT_EMOJIS } from "../../utils/hangout-emojis"

const ACCESS_OPTIONS = [
  { private: false, label: "Anyone can join" },
  { private: true, label: "I approve who joins" },
]

function StepButton({
  icon: Icon,
  label,
  disabled,
  onPress,
}: {
  icon: typeof PlusIcon
  label: string
  disabled: boolean
  onPress: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-full bg-background text-foreground transition-opacity hover:opacity-80 disabled:opacity-40"
    >
      <Icon className="size-4" />
    </button>
  )
}

export function HangoutEditor({
  hangout,
  limits,
  time,
  timeProblem,
  onEditTime,
  onChange,
  onCapacity,
  accessLocked = false,
  onRemove,
}: {
  hangout: HangoutDraft
  limits: HangoutLimits
  time: string
  timeProblem: string | null
  onEditTime?: () => void
  onChange: (patch: Partial<HangoutDraft>) => void
  onCapacity: (by: number) => void
  accessLocked?: boolean
  onRemove?: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border p-3">
      <div className="flex items-center gap-2">
        <EmojiPicker
          quick={HANGOUT_EMOJIS}
          onSelect={(emoji) => onChange({ emoji })}
          label={`Emoji, ${hangout.emoji}. Change it`}
          triggerClassName="flex size-12 shrink-0 items-center justify-center rounded-xl bg-input text-2xl transition-opacity hover:opacity-80"
        >
          {hangout.emoji}
        </EmojiPicker>
        <Input
          value={hangout.title}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="What's the plan?"
          aria-label="What's the plan"
          maxLength={limits.titleMax}
          className="h-12 rounded-full px-4 text-base md:text-base"
        />
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={onEditTime}
          disabled={!onEditTime}
          aria-label={`When, ${time}`}
          className="flex h-12 items-center justify-between rounded-xl bg-input px-4 transition-opacity enabled:hover:opacity-80"
        >
          <span className="text-sm font-semibold text-muted-foreground">
            When
          </span>
          <span className="flex items-center gap-1 text-sm font-bold text-foreground">
            {time}
            {onEditTime ? (
              <ChevronRightIcon className="size-4 text-muted-foreground" />
            ) : null}
          </span>
        </button>
        {timeProblem ? (
          <p className="px-1 text-xs text-destructive">{timeProblem}</p>
        ) : null}
        {onEditTime ? null : (
          <p className="px-1 text-xs text-muted-foreground">
            The time can&apos;t move once it has started.
          </p>
        )}
      </div>

      <div className="relative">
        <MapPinIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={hangout.place}
          onChange={(event) => onChange({ place: event.target.value })}
          placeholder="Where?"
          aria-label="Where"
          maxLength={limits.placeMax}
          className="h-12 rounded-full pr-4 pl-10 text-base md:text-base"
        />
      </div>

      <div className="flex min-h-12 items-center gap-3 rounded-xl bg-input px-4 py-2">
        <span className="min-w-0 flex-1 text-sm font-semibold text-muted-foreground">
          For how many, you included
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <StepButton
            icon={MinusIcon}
            label="Fewer people"
            disabled={hangout.capacity <= limits.capacityMin}
            onPress={() => onCapacity(-1)}
          />
          <span className="w-6 text-center text-sm font-bold text-foreground tabular-nums">
            {hangout.capacity}
          </span>
          <StepButton
            icon={PlusIcon}
            label="More people"
            disabled={hangout.capacity >= limits.capacityMax}
            onPress={() => onCapacity(1)}
          />
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div
          role="radiogroup"
          aria-label="Who can join"
          className={cn(
            "flex gap-1 rounded-xl bg-input p-1",
            accessLocked && "opacity-60"
          )}
        >
          {ACCESS_OPTIONS.map((option) => {
            const active = option.private === hangout.private
            return (
              <button
                key={option.label}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={accessLocked}
                onClick={() => onChange({ private: option.private })}
                className={cn(
                  "h-10 flex-1 rounded-lg text-sm font-bold transition-colors",
                  active
                    ? "bg-background text-foreground"
                    : "text-muted-foreground enabled:hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
        {accessLocked ? (
          <p className="px-1 text-xs text-muted-foreground">
            Who can join is fixed once someone else has joined or asked.
          </p>
        ) : null}
      </div>

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="self-center py-1 text-sm font-bold text-destructive hover:opacity-80"
        >
          Remove hangout
        </button>
      ) : null}
    </div>
  )
}
