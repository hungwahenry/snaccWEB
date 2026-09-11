import {
  BanknoteIcon,
  CircleDashedIcon,
  EyeOffIcon,
  HandCoinsIcon,
  ImageIcon,
  ImagePlayIcon,
  LinkIcon,
  MicIcon,
  StickerIcon,
  type LucideIcon,
} from "lucide-react"
import { ContextChip } from "@/components/ui/context-chip"
import { cn } from "@/lib/utils"
import type { AttachmentChip, AttachmentKind } from "../../types"

const ICONS: Record<AttachmentKind, LucideIcon> = {
  voice: MicIcon,
  photo: ImageIcon,
  view_once: EyeOffIcon,
  gif: ImagePlayIcon,
  sticker: StickerIcon,
  money_sent: BanknoteIcon,
  money_request: HandCoinsIcon,
  link: LinkIcon,
  moment: CircleDashedIcon,
}

const TONES = {
  plain: undefined,
  bubble: "bg-background/70",
  dark: "bg-primary-foreground/15 text-primary-foreground/80",
}

/** The chips for what a quoted message carries, toned for what they sit on. */
export function AttachmentChips({
  chips,
  tone = "plain",
  className,
}: {
  chips: AttachmentChip[]
  tone?: keyof typeof TONES
  className?: string
}) {
  if (chips.length === 0) return null

  return (
    <span className={cn("flex flex-wrap gap-1", className)}>
      {chips.map((chip) => (
        <ContextChip
          key={chip.kind}
          icon={ICONS[chip.kind]}
          label={chip.label}
          className={TONES[tone]}
        />
      ))}
    </span>
  )
}
