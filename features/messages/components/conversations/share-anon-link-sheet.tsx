import { CheckIcon, CopyIcon, ShareIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { bareLink } from "@/lib/share-links"
import { cn } from "@/lib/utils"

const GHOSTS = [
  { size: 60, icon: "size-7", left: 16, top: 46, rotate: -10, z: 1 },
  { size: 96, icon: "size-12", left: 62, top: 8, rotate: 0, z: 3 },
  { size: 68, icon: "size-8", left: 146, top: 38, rotate: 8, z: 2 },
]

export type ShareAnonLinkSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  link: string
  copied: boolean
  onCopy: () => void
  onShare: () => void
}

export function ShareAnonLinkSheet({
  open,
  onOpenChange,
  link,
  copied,
  onCopy,
  onShare,
}: ShareAnonLinkSheetProps) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      className="flex flex-col items-center gap-6 px-6 pt-4 pb-4"
    >
      <div className="relative" style={{ width: 220, height: 128 }}>
        {GHOSTS.map((ghost) => (
          <div
            key={ghost.left}
            className="absolute"
            style={{
              left: ghost.left,
              top: ghost.top,
              transform: `rotate(${ghost.rotate}deg)`,
              zIndex: ghost.z,
            }}
          >
            <GhostAvatar
              className="border-4 border-popover"
              iconClassName={ghost.icon}
              style={{ width: ghost.size, height: ghost.size }}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Get anonymous messages 👻
        </h2>
        <p className="text-base leading-6 text-muted-foreground">
          Share your profile link. Anyone on Snacc can message you anonymously
          from it, and you&apos;ll never see who sent what unless they choose to
          reveal themselves.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy your link"
          className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3 text-left transition-opacity active:opacity-70"
        >
          <span className="min-w-0 flex-1">
            <Eyebrow>{copied ? "Copied" : "Your link"}</Eyebrow>
            <span className="block truncate font-bold text-foreground">
              {bareLink(link)}
            </span>
          </span>
          {copied ? (
            <CheckIcon className={cn("text-success size-5")} />
          ) : (
            <CopyIcon className="size-5 text-muted-foreground" />
          )}
        </button>
        <Button size="lg" className="h-14 w-full text-base" onClick={onShare}>
          <ShareIcon /> Share your link
        </Button>
      </div>
    </ActionSheet>
  )
}
