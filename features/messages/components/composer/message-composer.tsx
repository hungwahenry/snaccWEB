import { ArrowUpIcon, CheckIcon } from "lucide-react"
import type { RefObject } from "react"
import { Spinner } from "@/components/ui/spinner"
import type { PickedImage } from "@/lib/media"
import { cn } from "@/lib/utils"
import type { ComposerContext } from "../../hooks/use-message-composer"
import {
  ComposerActionsMenu,
  type ComposerAction,
} from "./composer-actions-menu"
import { ComposerContextRow } from "./composer-context-row"
import { MessageDraftImages } from "./message-draft-images"
import { ViewOnceToggle } from "./view-once-toggle"

export type MessageComposerProps = {
  inputRef?: RefObject<HTMLTextAreaElement | null>
  body: string
  onChange: (text: string) => void
  onSend: () => void
  canSend: boolean
  sending: boolean
  editing: boolean
  context: ComposerContext | null
  placeholder?: string
  maxLength: number
  remaining: number
  showCounter: boolean
  images?: PickedImage[]
  onRemoveImage?: (uri: string) => void
  viewOnce?: boolean
  onToggleViewOnce?: () => void
  actions?: ComposerAction[]
}

export function MessageComposer({
  inputRef,
  body,
  onChange,
  onSend,
  canSend,
  sending,
  editing,
  context,
  placeholder = "Message…",
  maxLength,
  remaining,
  showCounter,
  images = [],
  onRemoveImage,
  viewOnce = false,
  onToggleViewOnce,
  actions = [],
}: MessageComposerProps) {
  const showDrafts = images.length > 0 && Boolean(onRemoveImage)
  const showViewOnce = images.length === 1 && Boolean(onToggleViewOnce)

  return (
    <div className="border-t border-border bg-background px-3 py-2 pb-[max(env(safe-area-inset-bottom),8px)]">
      {context || showDrafts ? (
        <div className="mb-2 rounded-2xl bg-input">
          {context ? <ComposerContextRow context={context} /> : null}
          {showDrafts ? (
            <MessageDraftImages images={images} onRemove={onRemoveImage!} />
          ) : null}
          {showViewOnce ? (
            <ViewOnceToggle checked={viewOnce} onToggle={onToggleViewOnce!} />
          ) : null}
        </div>
      ) : null}

      {showCounter ? (
        <p className="pr-2 pb-1 text-right text-xs text-muted-foreground tabular-nums">
          {remaining}
        </p>
      ) : null}

      <form
        className="flex items-end gap-1"
        onSubmit={(event) => {
          event.preventDefault()
          onSend()
        }}
      >
        {actions.length > 0 ? <ComposerActionsMenu actions={actions} /> : null}

        <div className="flex min-h-11 flex-1 items-end gap-2 rounded-3xl bg-input py-1 pr-1 pl-4">
          <textarea
            ref={inputRef}
            value={body}
            rows={1}
            maxLength={maxLength}
            placeholder={editing ? "Edit message…" : placeholder}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault()
                onSend()
              }
            }}
            className="field-sizing-content max-h-32 min-h-9 flex-1 resize-none self-center bg-transparent py-2 text-base leading-5 text-foreground outline-none placeholder:text-muted-foreground/50"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label={editing ? "Save edit" : "Send"}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
              canSend || sending
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground"
            )}
          >
            {sending ? (
              <Spinner />
            ) : editing ? (
              <CheckIcon className="size-5" />
            ) : (
              <ArrowUpIcon className="size-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
