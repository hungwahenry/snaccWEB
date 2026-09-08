import { XIcon } from "lucide-react"
import type { ComposerContext } from "../../hooks/use-message-composer"

export function ComposerContextRow({ context }: { context: ComposerContext }) {
  return (
    <div className="flex items-center gap-2 px-3.5 pt-2.5 pb-2">
      <span className="w-0.5 self-stretch rounded-full bg-muted-foreground/40" />
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-muted-foreground">
          {context.label}
        </span>
        <span className="block truncate text-sm text-foreground">
          {context.body}
        </span>
      </span>
      {context.cancel ? (
        <button
          type="button"
          onClick={context.cancel}
          aria-label={context.hint}
          className="text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
