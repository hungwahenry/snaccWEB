import {
  BanknoteIcon,
  GhostIcon,
  PlayIcon,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FEATURE_COLORS } from "./palette"
import { SnaccDeck } from "./snacc-deck"

const CHIPS: {
  icon: LucideIcon
  color: string
  text: string
  className: string
}[] = [
  {
    icon: GhostIcon,
    color: FEATURE_COLORS.ghost,
    text: "New anonymous message",
    className: "top-2 left-0",
  },
  {
    icon: BanknoteIcon,
    color: FEATURE_COLORS.money,
    text: "₦2,000 received",
    className: "top-[46%] right-0",
  },
  {
    icon: PlayIcon,
    color: FEATURE_COLORS.clips,
    text: "1.2k watched your clip",
    className: "bottom-2 left-[8%]",
  },
]

export function HeroDeck() {
  return (
    <div
      aria-hidden
      className="relative flex min-w-0 justify-center py-10 lg:py-6"
    >
      <div className="lg:scale-90 xl:scale-100">
        <SnaccDeck />
      </div>

      {CHIPS.map(({ icon: Icon, color, text, className }) => (
        <span
          key={text}
          className={cn(
            "absolute z-40 flex items-center gap-2 rounded-full border border-border bg-background py-1.5 pr-3.5 pl-1.5 text-sm font-bold whitespace-nowrap text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.14)]",
            className
          )}
        >
          <span
            className="flex size-6 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            <Icon className="size-3.5" />
          </span>
          {text}
        </span>
      ))}
    </div>
  )
}
