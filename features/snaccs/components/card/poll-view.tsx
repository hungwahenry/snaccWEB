import { CheckCircle2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SnaccPoll, SnaccPollOption } from "../../types"
import { optionShare, pollFooter, pollRevealed } from "../../utils/polls"

export type PollViewProps = {
  poll: SnaccPoll
  disabled?: boolean
  voting: boolean
  onVote: (optionId: string) => void
  onOpenImage: (option: SnaccPollOption) => void
}

function OptionThumb({
  option,
  onPress,
}: {
  option: SnaccPollOption
  onPress: () => void
}) {
  if (!option.image) return null

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onPress()
      }}
      aria-label={`${option.label} image`}
      className="shrink-0 transition-opacity active:opacity-80"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={option.image.thumb_url ?? option.image.url}
        alt=""
        className="size-10 rounded-full object-cover"
      />
    </button>
  )
}

export function PollView({
  poll,
  disabled = false,
  voting,
  onVote,
  onOpenImage,
}: PollViewProps) {
  const revealed = pollRevealed(poll)
  const withImages = poll.options.some((option) => option.image !== null)
  const rowHeight = withImages ? "h-14" : "h-11"

  return (
    <div className="flex flex-col gap-2">
      {poll.options.map((option) => {
        if (!revealed) {
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled || voting}
              onClick={(event) => {
                event.stopPropagation()
                onVote(option.id)
              }}
              className={cn(
                "flex items-center gap-2.5 rounded-full border border-primary/40 px-2.5 text-left transition-colors hover:bg-accent disabled:opacity-50",
                rowHeight,
                !withImages && "px-4"
              )}
            >
              <OptionThumb
                option={option}
                onPress={() => onOpenImage(option)}
              />
              <span className="truncate text-sm font-bold text-primary">
                {option.label}
              </span>
            </button>
          )
        }

        const share = optionShare(option, poll)
        const mine = option.id === poll.my_option_id

        return (
          <div
            key={option.id}
            className={cn(
              "relative flex items-center overflow-hidden rounded-xl",
              rowHeight
            )}
          >
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-xl",
                mine ? "bg-primary/20" : "bg-muted"
              )}
              style={{ width: `${Math.max(share * 100, 3)}%` }}
            />
            <div
              className={cn(
                "relative flex w-full items-center gap-2.5 px-2.5",
                !withImages && "px-3"
              )}
            >
              <OptionThumb
                option={option}
                onPress={() => onOpenImage(option)}
              />
              <span
                className={cn(
                  "truncate text-sm text-foreground",
                  mine ? "font-extrabold" : "font-medium"
                )}
              >
                {option.label}
              </span>
              {mine ? (
                <CheckCircle2Icon className="size-4 shrink-0 text-foreground" />
              ) : null}
              <span className="ml-auto text-sm font-bold text-muted-foreground tabular-nums">
                {Math.round(share * 100)}%
              </span>
            </div>
          </div>
        )
      })}

      <p className="text-xs text-muted-foreground">{pollFooter(poll)}</p>
    </div>
  )
}
