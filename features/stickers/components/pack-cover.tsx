import { StickerIcon } from "lucide-react"
import { LazyImage } from "@/components/ui/lazy-image"
import { cn } from "@/lib/utils"

export function PackCover({
  url,
  className,
}: {
  url: string | null
  className?: string
}) {
  if (url) {
    return (
      <LazyImage
        src={url}
        alt=""
        draggable={false}
        className={cn("shrink-0 object-contain", className)}
      />
    )
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl bg-muted",
        className
      )}
    >
      <StickerIcon className="size-1/2 text-muted-foreground" aria-hidden />
    </span>
  )
}
