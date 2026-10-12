import {
  EyeIcon,
  MapPinIcon,
  UserRoundPlusIcon,
  type LucideIcon,
} from "lucide-react"
import { FEATURE_COLORS } from "@/components/marketing/palette"
import { FloatingCard, SnaccMock } from "@/components/marketing/snacc-deck"
import { cn } from "@/lib/utils"

const CHIPS: {
  icon: LucideIcon
  color: string
  text: string
  className: string
}[] = [
  {
    icon: EyeIcon,
    color: FEATURE_COLORS.clips,
    text: "2.4k views today",
    className: "top-0 left-[4%]",
  },
  {
    icon: MapPinIcon,
    color: FEATURE_COLORS.feed,
    text: "UNILAG · LASU · YABATECH",
    className: "top-[44%] right-0",
  },
  {
    icon: UserRoundPlusIcon,
    color: FEATURE_COLORS.money,
    text: "+38 new followers",
    className: "bottom-0 left-[10%]",
  },
]

export function AdvertiseDeck() {
  return (
    <div
      aria-hidden
      className="relative flex min-w-0 justify-center py-12 lg:py-8"
    >
      <div className="flex items-center justify-center lg:scale-95 xl:scale-100">
        <FloatingCard rotate={-6} baseY={18} className="z-10">
          <SnaccMock
            name="Lit Fridays"
            handle="litfridays"
            campus="LASU"
            time="Promoted"
            seed="lit"
            body="Freshers' Night this Friday 🎉 DJ, food and games till late. Early bird tickets ₦3,000 🎟️"
            lines={4}
            button="Book now"
            likes={96}
            comments={21}
            resnaccs={14}
          />
        </FloatingCard>

        <FloatingCard rotate={4} baseY={-8} className="z-30 -ml-14">
          <SnaccMock
            name="Kemi's Kitchen"
            handle="kemiskitchen"
            campus="UNILAG"
            time="Promoted"
            seed="kemi"
            body="Jollof, chicken and plantain for ₦2,500 🍗 Delivered to any hostel in 30 minutes. Order before 8pm!"
            lines={4}
            button="Order now"
            likes={132}
            liked
            comments={18}
            resnaccs={9}
          />
        </FloatingCard>
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
