import { ArrowUpIcon, CheckIcon } from "lucide-react"
import { useCallback, useState, type RefObject } from "react"
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

/// One line of text at rest; past this the pill squares off, as on the phone.
const INPUT_REST_HEIGHT = 36

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
  onDark?: boolean
  onFocus?: () => void
  onBlur?: () => void
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
  onDark = false,
  onFocus,
  onBlur,
}: MessageComposerProps) {
  const showDrafts = images.length > 0 && Boolean(onRemoveImage)
  const showViewOnce = images.length === 1 && Boolean(onToggleViewOnce)
  const [tall, setTall] = useState(false)
  const watchHeight = useCallback((node: HTMLTextAreaElement | null) => {
    if (!node) return
    const observer = new ResizeObserver(([entry]) =>
      setTall(entry.contentRect.height > INPUT_REST_HEIGHT + 2)
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={cn(
        "px-3 py-2 pb-[max(env(safe-area-inset-bottom),8px)]",
        !onDark && "border-t border-border bg-background"
      )}
    >
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

        <div
          className={cn(
            "flex min-h-14 flex-1 items-end gap-3 bg-input py-1.5 pr-1.5 pl-5",
            tall ? "rounded-2xl" : "rounded-full",
            onDark && "border border-white/40 bg-black/35"
          )}
        >
          <textarea
            ref={(node) => {
              watchHeight(node)
              if (inputRef) inputRef.current = node
            }}
            value={body}
            rows={1}
            maxLength={maxLength}
            placeholder={editing ? "Edit message…" : placeholder}
            onChange={(event) => onChange(event.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
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
            className={cn(
              "field-sizing-content max-h-32 flex-1 resize-none self-center bg-transparent py-2 text-base leading-5 outline-none",
              onDark
                ? "text-white placeholder:text-white/50"
                : "text-foreground placeholder:text-muted-foreground/50"
            )}
            style={{ minHeight: INPUT_REST_HEIGHT }}
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label={editing ? "Save edit" : "Send"}
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full transition-colors",
              onDark
                ? canSend || sending
                  ? "bg-white text-black hover:opacity-90"
                  : "bg-white/25 text-white/60"
                : canSend || sending
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground",
              tall && "mb-1.5"
            )}
          >
            {sending ? (
              <Spinner className="size-5" />
            ) : editing ? (
              <CheckIcon className="size-6" />
            ) : (
              <ArrowUpIcon className="size-6" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
