import { CheckCheckIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DeliveryState } from "../../types"

const DELIVERY = {
  sent: { label: "Sent", icon: CheckIcon, tint: "text-muted-foreground" },
  seen: { label: "Seen", icon: CheckCheckIcon, tint: "text-foreground" },
} as const

export function MessageMeta({
  mine,
  time,
  delivery,
}: {
  mine: boolean
  time: string | null
  delivery: DeliveryState | null
}) {
  if (!time && !delivery) return null
  const Delivery = delivery ? DELIVERY[delivery] : null

  return (
    <div
      className={cn(
        "mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground",
        mine ? "justify-end pr-1" : "justify-start pl-1"
      )}
    >
      {Delivery ? (
        <Delivery.icon className={cn("size-3.5", Delivery.tint)} />
      ) : null}
      <span>{[Delivery?.label ?? null, time].filter(Boolean).join(" · ")}</span>
    </div>
  )
}
