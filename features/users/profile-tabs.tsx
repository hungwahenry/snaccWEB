import {
  ImageIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  RepeatIcon,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const TABS: { label: string; icon: LucideIcon }[] = [
  { label: "Snaccs", icon: MessageSquareIcon },
  { label: "Replies", icon: MessageCircleIcon },
  { label: "Media", icon: ImageIcon },
  { label: "Resnaccs", icon: RepeatIcon },
]

export function ProfileTabs() {
  return (
    <div className="border-border border-b">
      <div className="flex gap-2 overflow-x-auto px-4 py-2">
        {TABS.map((tab, i) => {
          const active = i === 0
          return (
            <div
              key={tab.label}
              className={cn(
                "flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5",
                active ? "bg-foreground" : "bg-muted",
              )}
            >
              <tab.icon
                size={16}
                className={active ? "text-background" : "text-muted-foreground"}
              />
              <span
                className={cn(
                  "text-sm font-extrabold",
                  active ? "text-background" : "text-muted-foreground",
                )}
              >
                {tab.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
