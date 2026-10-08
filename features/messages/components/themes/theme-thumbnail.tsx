import { ImageIcon } from "lucide-react"
import type { ChatPaint } from "@/features/chat-themes/types"
import { PremiumBadge } from "@/features/premium/components/premium-badge"
import { cn } from "@/lib/utils"
import { ChatThemePreview } from "./chat-theme-preview"

const PREVIEW_WIDTH = 300
const ASPECT = 4 / 3

export function ThemeThumbnail({
  paint,
  photoUrl,
  needsPhoto,
  width,
  selected = false,
  locked = false,
}: {
  paint: ChatPaint | null
  photoUrl: string | null
  needsPhoto: boolean
  width: number
  selected?: boolean
  locked?: boolean
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-background"
      style={{ width, height: width * ASPECT }}
    >
      {needsPhoto ? (
        <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
          <ImageIcon className="size-6" />
        </div>
      ) : (
        <div
          className="pointer-events-none absolute top-0 left-0 origin-top-left"
          style={{
            width: PREVIEW_WIDTH,
            height: PREVIEW_WIDTH * ASPECT,
            transform: `scale(${width / PREVIEW_WIDTH})`,
          }}
        >
          <ChatThemePreview
            paint={paint}
            photoUrl={photoUrl}
            className="size-full"
          />
        </div>
      )}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl border-2",
          selected ? "border-foreground" : "border-border"
        )}
      />
      {locked ? <PremiumBadge className="absolute top-1.5 right-1.5" /> : null}
    </div>
  )
}
