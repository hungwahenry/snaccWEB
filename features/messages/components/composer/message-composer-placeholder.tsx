import { ArrowUpIcon, PlusIcon } from "lucide-react"

/** The composer at rest, drawn before the page can wire the real one up, so nothing shifts when it does. */
export function MessageComposerPlaceholder({
  placeholder = "Message…",
  withActions = false,
}: {
  placeholder?: string
  withActions?: boolean
}) {
  return (
    <div className="border-t border-border bg-background px-3 py-2 pb-[max(env(safe-area-inset-bottom),8px)]">
      <div className="flex items-end gap-1">
        {withActions ? (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-input text-foreground">
            <PlusIcon className="size-6" />
          </span>
        ) : null}
        <div className="flex min-h-14 flex-1 items-end gap-3 rounded-full bg-input py-1.5 pr-1.5 pl-5">
          <span className="flex-1 self-center truncate py-2 text-base leading-5 text-muted-foreground/50">
            {placeholder}
          </span>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ArrowUpIcon className="size-6" />
          </span>
        </div>
      </div>
    </div>
  )
}
