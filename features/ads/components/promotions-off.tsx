import { MegaphoneOffIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export function PromotionsOff() {
  return (
    <EmptyState
      icon={MegaphoneOffIcon}
      title="Not available"
      description="Promotions are switched off right now."
      className="py-24"
    />
  )
}
