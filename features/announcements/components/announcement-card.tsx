import { MegaphoneIcon, XIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { LazyImage } from "@/components/ui/lazy-image"
import type { AnnouncementBanner } from "../types"
import { ImportantChip } from "./important-chip"

export function AnnouncementCard({
  banner,
  onOpen,
  onDismiss,
}: {
  banner: AnnouncementBanner
  onOpen: () => void
  onDismiss: () => void
}) {
  return (
    <div className="relative mx-4 mt-3 mb-1">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-start gap-3 rounded-3xl border border-border p-3.5 pr-12 text-left transition-colors hover:bg-muted/50 active:opacity-70"
      >
        {banner.image ? (
          <LazyImage
            src={banner.image.url}
            alt=""
            className="size-11 shrink-0 rounded-xl bg-muted object-cover"
          />
        ) : (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15">
            <MegaphoneIcon className="size-5 text-foreground" />
          </span>
        )}

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate font-bold text-foreground">
              {banner.title}
            </span>
            {banner.important ? <ImportantChip /> : null}
          </span>
          <span className="line-clamp-2 text-sm wrap-break-word text-muted-foreground">
            {banner.message}
          </span>
        </span>
      </button>

      <IconButton
        icon={XIcon}
        label="Dismiss"
        onClick={onDismiss}
        className="absolute top-2 right-2 size-8"
        iconClassName="size-4 text-muted-foreground"
      />
    </div>
  )
}
