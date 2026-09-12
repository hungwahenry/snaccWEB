import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { ScheduledSnacc } from "../../types"
import {
  scheduledLine,
  scheduledPreview,
  scheduledThumb,
} from "../../utils/schedule"

export function ScheduledDetail({
  item,
  posting,
  deleting,
  onBack,
  onPostNow,
  onChangeTime,
  onDelete,
}: {
  item: ScheduledSnacc
  posting: boolean
  deleting: boolean
  onBack: () => void
  onPostNow: () => void
  onChangeTime: () => void
  onDelete: () => void
}) {
  const thumb = scheduledThumb(item)
  const line = scheduledLine(item)
  const busy = posting || deleting

  return (
    <div className="flex flex-col gap-4 px-4">
      <IconButton
        icon={ArrowLeftIcon}
        label="Back to scheduled"
        onClick={onBack}
        className="-ml-2 size-8"
        iconClassName="size-5"
      />

      <div className="flex items-start gap-3">
        {thumb ? (
          <img
            src={thumb.url}
            alt=""
            className={cn(
              "size-16 shrink-0 rounded-lg",
              thumb.sticker ? "object-contain" : "object-cover"
            )}
          />
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="line-clamp-6 font-medium break-words whitespace-pre-line text-foreground">
            {scheduledPreview(item)}
          </p>
          <p
            className={cn(
              "text-sm",
              line.failed ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {line.text}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button className="h-12 w-full" disabled={busy} onClick={onPostNow}>
          {posting ? <Spinner /> : "Post now"}
        </Button>
        <Button
          variant="outline"
          className="h-12 w-full"
          disabled={busy}
          onClick={onChangeTime}
        >
          Change time
        </Button>
        <Button
          variant="destructive"
          className="h-12 w-full"
          disabled={busy}
          onClick={onDelete}
        >
          {deleting ? <Spinner /> : "Delete"}
        </Button>
      </div>
    </div>
  )
}
