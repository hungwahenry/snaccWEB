import { cn } from "@/lib/utils"

export interface MediaImage {
  id?: string
  url: string
  width?: number
  height?: number
}

export interface MediaGif {
  url: string
}

export interface MediaSticker {
  url: string
  preview_url?: string | null
}

export interface MediaVoice {
  url: string
  duration_ms: number
}

function seconds(ms: number): string {
  const total = Math.round(ms / 1000)

  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`
}

function Frame({
  url,
  alt,
  className,
}: {
  url: string
  alt: string
  className?: string
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block overflow-hidden rounded-lg border bg-muted/40 transition-opacity hover:opacity-90"
      title="Open the original"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- user media on arbitrary hosts */}
      <img
        src={url}
        alt={alt}
        className={cn("max-h-72 w-auto object-contain", className)}
      />
    </a>
  )
}

/**
 * Everything attached to a piece of content, shown rather than described. A moderator deciding on
 * an image post has nothing to read, so the image itself is the evidence — and it opens full size.
 */
export function ContentMedia({
  images = [],
  gif = null,
  sticker = null,
  voice = null,
}: {
  images?: MediaImage[]
  gif?: MediaGif | null
  sticker?: MediaSticker | null
  voice?: MediaVoice | null
}) {
  if (
    images.length === 0 &&
    gif === null &&
    sticker === null &&
    voice === null
  ) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      {images.length > 0 || gif || sticker ? (
        <div className="flex flex-wrap items-start gap-2">
          {images.map((image, index) => (
            <Frame
              key={image.id ?? image.url}
              url={image.url}
              alt={`Attached image ${index + 1}`}
            />
          ))}
          {gif ? <Frame url={gif.url} alt="Attached GIF" /> : null}
          {sticker ? (
            <Frame
              url={sticker.url}
              alt="Attached sticker"
              className="max-h-40"
            />
          ) : null}
        </div>
      ) : null}

      {voice ? (
        <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
          <audio controls preload="none" src={voice.url} className="h-8" />
          <span className="text-xs text-muted-foreground tabular-nums">
            {seconds(voice.duration_ms)}
          </span>
        </div>
      ) : null}
    </div>
  )
}
