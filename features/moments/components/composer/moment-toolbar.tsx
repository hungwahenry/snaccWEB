import { BadgeCheckIcon, ClockIcon, ImageIcon, TypeIcon } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconButton } from "@/components/ui/icon-button"
import { PREMIUM_PATH } from "@/features/premium/routes"
import { cn } from "@/lib/utils"
import type { MomentLengthChip } from "../../hooks/use-moment-length"
import type { MomentMode } from "../../types"

type MomentToolbarProps = {
  mode: MomentMode
  onModeChange: (mode: MomentMode) => void
  remaining: number
  showCounter: boolean
  length: MomentLengthChip | null
  right?: ReactNode
}

export function MomentToolbar({
  mode,
  onModeChange,
  remaining,
  showCounter,
  length,
  right,
}: MomentToolbarProps) {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <div className="flex items-center gap-1">
        <IconButton
          icon={TypeIcon}
          label="Write a moment"
          aria-pressed={mode === "text"}
          onClick={() => onModeChange("text")}
          iconClassName={cn(mode === "text" && "text-primary")}
        />
        <IconButton
          icon={ImageIcon}
          label="Share a photo"
          aria-pressed={mode === "image"}
          onClick={() => onModeChange("image")}
          iconClassName={cn(mode === "image" && "text-primary")}
        />

        {length ? <LengthChip chip={length} /> : null}
      </div>

      <div className="flex items-center gap-3 pr-2">
        {showCounter ? (
          <span
            className={cn(
              "text-sm font-bold tabular-nums",
              remaining < 0 ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {remaining}
          </span>
        ) : null}
        {right}
      </div>
    </div>
  )
}

const CHIP =
  "flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-foreground tabular-nums transition-colors hover:bg-accent"

function LengthChip({ chip }: { chip: MomentLengthChip }) {
  if (chip.gated) {
    return (
      <Link
        href={PREMIUM_PATH}
        aria-label={`Lasts ${chip.label}. Pick how long with Premium.`}
        className={CHIP}
      >
        <ClockIcon className="size-5" />
        {chip.label}
        <BadgeCheckIcon className="size-3.5 text-premium" />
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`Lasts ${chip.label}`} className={CHIP}>
        <ClockIcon className="size-5" />
        {chip.label}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="min-w-44">
        <DropdownMenuRadioGroup
          value={String(chip.hours)}
          onValueChange={(value) => chip.onPick(String(value))}
        >
          {chip.offered.map((hours) => (
            <DropdownMenuRadioItem key={hours} value={String(hours)}>
              {hours} hours
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
