import { Sticker } from "lucide-react"
import { LazyImage } from "@/components/ui/lazy-image"
import { cn } from "@/lib/utils"

export function StickerImage({
  src,
  alt,
  className,
}: {
  src: string | null
  alt: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/40 text-muted-foreground",
        className
      )}
    >
      {src ? (
        <LazyImage src={src} alt={alt} className="size-full object-contain" />
      ) : (
        <Sticker className="size-1/3 max-h-6 max-w-6" aria-hidden />
      )}
    </div>
  )
}
