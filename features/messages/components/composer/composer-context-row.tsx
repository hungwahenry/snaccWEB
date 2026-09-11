import { XIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import type { ComposerContext } from "../../types"
import { MessageGlimpseView } from "../glimpse/message-glimpse"

export function ComposerContextRow({
  context,
  onCancel,
}: {
  context: ComposerContext
  onCancel?: () => void
}) {
  return (
    <div className="flex items-start gap-2 px-3.5 pt-2.5 pb-2">
      <span className="w-0.5 self-stretch rounded-full bg-muted-foreground/40" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">
          {context.label}
        </span>
        <MessageGlimpseView glimpse={context.glimpse} />
      </span>
      {onCancel ? (
        <IconButton
          icon={XIcon}
          label={context.hint}
          onClick={onCancel}
          className="-mt-1 -mr-2 size-8 text-muted-foreground hover:text-foreground"
          iconClassName="size-4"
        />
      ) : null}
    </div>
  )
}
