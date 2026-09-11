import { cn } from "@/lib/utils"

/** A row of square thumbnails; the last one counts what did not fit. */
export function ThumbStrip({
  urls,
  extra = 0,
  size = 56,
  className,
}: {
  urls: string[]
  extra?: number
  size?: number
  className?: string
}) {
  if (urls.length === 0) return null

  return (
    <div className={cn("flex gap-1.5", className)}>
      {urls.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="relative shrink-0 overflow-hidden rounded-lg bg-muted"
          style={{ width: size, height: size }}
        >
          <img
            src={url}
            alt=""
            loading="lazy"
            draggable={false}
            className="size-full object-cover"
          />
          {extra > 0 && index === urls.length - 1 ? (
            <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-extrabold text-white">
              +{extra}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}
