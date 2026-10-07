import { useState } from "react"
import { TAIL_REACH } from "./bubble-tail"

const DOTS = [0, 1, 2]
const STAGGER_MS = 150

export function TypingIndicator({
  typing,
}: {
  typing: string | boolean | null
}) {
  const [label, setLabel] = useState(typeof typing === "string" ? typing : null)
  if (typeof typing === "string" && typing !== label) setLabel(typing)

  const visible = Boolean(typing)

  return (
    <div
      role="status"
      aria-label={visible ? (label ?? "Typing") : undefined}
      aria-hidden={!visible}
      data-visible={visible}
      className="group grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out data-[visible=true]:grid-rows-[1fr] motion-reduce:transition-none"
    >
      <div className="min-h-0 overflow-hidden">
        <div
          className="flex flex-col items-start pt-2 pb-2"
          style={{ paddingLeft: TAIL_REACH }}
        >
          {label ? (
            <p className="mb-1 max-w-full truncate text-xs text-muted-foreground">
              {label}
            </p>
          ) : null}

          <div className="relative origin-bottom-left scale-50 opacity-0 transition duration-150 ease-in group-data-[visible=true]:scale-100 group-data-[visible=true]:opacity-100 group-data-[visible=true]:duration-300 group-data-[visible=true]:ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none">
            <span className="absolute -bottom-0.5 -left-0.5 size-3 rounded-full bg-muted" />
            <span className="absolute -bottom-2 -left-2 size-1.5 rounded-full bg-muted" />

            <span className="relative flex h-11 items-center gap-1.5 rounded-2xl bg-muted px-4">
              {DOTS.map((index) => (
                <span
                  key={index}
                  className="size-2 animate-[typing-dot_1.2s_ease-in-out_infinite_both] rounded-full bg-muted-foreground opacity-70 group-data-[visible=false]:[animation-play-state:paused] motion-reduce:animate-none"
                  style={{ animationDelay: `${index * STAGGER_MS}ms` }}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
