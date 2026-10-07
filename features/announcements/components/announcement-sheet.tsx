import { MegaphoneOffIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { LazyImage } from "@/components/ui/lazy-image"
import { LoadFailed } from "@/components/ui/load-failed"
import { aspectRatio } from "@/lib/aspect"
import { shortDate } from "@/lib/format"
import type { Announcement } from "../types"
import { AnnouncementSkeleton } from "./announcement-skeleton"
import { ImportantChip } from "./important-chip"

export type AnnouncementSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  announcement: Announcement | null
  gone: boolean
  failed: boolean
  onRetry: () => void
  onButton: (index: number) => void
}

export function AnnouncementSheet({
  open,
  onOpenChange,
  announcement,
  gone,
  failed,
  onRetry,
  onButton,
}: AnnouncementSheetProps) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      label={announcement?.title ?? "Announcement"}
      className="px-5 pb-5"
    >
      {gone ? (
        <EmptyState
          icon={MegaphoneOffIcon}
          title="This announcement is no longer available"
          description="It may have been taken down."
          className="px-2 py-10"
        />
      ) : announcement ? (
        <Detail announcement={announcement} onButton={onButton} />
      ) : failed ? (
        <div className="py-6">
          <LoadFailed
            title="Could not load this announcement"
            onRetry={onRetry}
          />
        </div>
      ) : (
        <AnnouncementSkeleton />
      )}
    </ActionSheet>
  )
}

function Detail({
  announcement,
  onButton,
}: {
  announcement: Announcement
  onButton: (index: number) => void
}) {
  return (
    <div className="flex flex-col gap-5 pt-2">
      {announcement.image ? (
        <LazyImage
          src={announcement.image.url}
          alt=""
          className="w-full rounded-2xl bg-muted object-cover"
          style={{ aspectRatio: aspectRatio(announcement.image) }}
        />
      ) : null}

      <div className="flex flex-col gap-1.5">
        {announcement.important ? <ImportantChip /> : null}
        <p className="text-xl font-extrabold tracking-tight wrap-break-word text-foreground">
          {announcement.title}
        </p>
        {announcement.sent_at ? (
          <p className="text-sm text-muted-foreground">
            {shortDate(announcement.sent_at)}
          </p>
        ) : null}
      </div>

      <p className="text-[15px] leading-6 wrap-break-word whitespace-pre-wrap text-foreground">
        {announcement.message}
      </p>

      {announcement.buttons.length > 0 ? (
        <div className="flex flex-col gap-2">
          {announcement.buttons.map((button, index) => (
            <Button
              key={index}
              size="lg"
              variant={index === 0 ? "default" : "outline"}
              className="h-11 w-full"
              onClick={() => onButton(index)}
            >
              <span className="truncate">{button.label}</span>
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
