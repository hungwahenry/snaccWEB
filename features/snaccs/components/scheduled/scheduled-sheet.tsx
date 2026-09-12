import { ArrowLeftIcon, CalendarClockIcon, Trash2Icon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import {
  DateTimePicker,
  type DateTimePickerProps,
} from "@/components/ui/date-time-picker"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { LoadFailed } from "@/components/ui/load-failed"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { ScheduledSheetView, ScheduledSnacc } from "../../types"
import {
  scheduledLine,
  scheduledPreview,
  scheduledThumb,
} from "../../utils/schedule"
import { ScheduledDetail } from "./scheduled-detail"
import { ScheduledRowSkeleton } from "./scheduled-row-skeleton"

export type ScheduledSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  view: ScheduledSheetView
  scheduled: ScheduledSnacc[]
  loading: boolean
  failed: boolean
  onRetry: () => void
  busy: ReadonlySet<string>
  onPick: (item: ScheduledSnacc) => void
  onDelete: (item: ScheduledSnacc) => void
  acting: ScheduledSnacc | null
  posting: boolean
  deleting: boolean
  onBack: () => void
  onPostNow: () => void
  onChangeTime: () => void
  onDeleteActing: () => void
  picker: DateTimePickerProps
}

export function ScheduledSheet({
  open,
  onOpenChange,
  view,
  scheduled,
  loading,
  failed,
  onRetry,
  busy,
  onPick,
  onDelete,
  acting,
  posting,
  deleting,
  onBack,
  onPostNow,
  onChangeTime,
  onDeleteActing,
  picker,
}: ScheduledSheetProps) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Scheduled"
      hint={view === "list" ? "Goes out on its own" : undefined}
      tall
    >
      {view === "detail" && acting ? (
        <ScheduledDetail
          item={acting}
          posting={posting}
          deleting={deleting}
          onBack={onBack}
          onPostNow={onPostNow}
          onChangeTime={onChangeTime}
          onDelete={onDeleteActing}
        />
      ) : view === "time" && acting ? (
        <div className="flex flex-col gap-2 px-4">
          {picker.step === "date" ? (
            <IconButton
              icon={ArrowLeftIcon}
              label="Back to this snacc"
              onClick={onBack}
              className="-ml-2 size-8"
              iconClassName="size-5"
            />
          ) : null}
          <DateTimePicker {...picker} />
        </div>
      ) : failed ? (
        <LoadFailed
          title="Could not load your scheduled snaccs"
          onRetry={onRetry}
        />
      ) : loading ? (
        <SkeletonRows count={4} item={ScheduledRowSkeleton} />
      ) : scheduled.length === 0 ? (
        <EmptyState
          icon={CalendarClockIcon}
          title="Nothing scheduled"
          description="Schedule a snacc and it waits here."
          className="py-16"
        />
      ) : (
        scheduled.map((item) => (
          <ScheduledRow
            key={item.id}
            item={item}
            busy={busy.has(item.id)}
            onPick={onPick}
            onDelete={onDelete}
          />
        ))
      )}
    </ActionSheet>
  )
}

function ScheduledRow({
  item,
  busy,
  onPick,
  onDelete,
}: {
  item: ScheduledSnacc
  busy: boolean
  onPick: (item: ScheduledSnacc) => void
  onDelete: (item: ScheduledSnacc) => void
}) {
  const thumb = scheduledThumb(item)
  const line = scheduledLine(item)

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40">
      <button
        type="button"
        disabled={busy}
        onClick={() => onPick(item)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        {thumb ? (
          <img
            src={thumb.url}
            alt=""
            className={cn(
              "size-12 shrink-0 rounded-lg",
              thumb.sticker ? "object-contain" : "object-cover"
            )}
          />
        ) : null}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="line-clamp-2 font-medium text-foreground">
            {scheduledPreview(item)}
          </span>
          <span
            className={cn(
              "text-sm",
              line.failed ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {line.text}
          </span>
        </span>
      </button>
      {busy ? (
        <span className="flex size-9 shrink-0 items-center justify-center">
          <Spinner className="text-muted-foreground" />
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onDelete(item)}
          aria-label="Delete scheduled snacc"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-destructive transition-opacity active:opacity-60"
        >
          <Trash2Icon className="size-5" />
        </button>
      )}
    </div>
  )
}
