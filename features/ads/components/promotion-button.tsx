import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PromotionButton({
  label,
  onPress,
  className,
}: {
  label: string
  onPress: () => void
  className?: string
}) {
  return (
    <Button
      size="lg"
      className={cn("h-11 w-full", className)}
      onClick={(event) => {
        event.stopPropagation()
        onPress()
      }}
    >
      <span className="truncate">{label}</span>
    </Button>
  )
}
