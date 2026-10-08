import { CheckIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PackSaveButton({
  saved,
  busy,
  onPress,
}: {
  saved: boolean
  busy: boolean
  onPress: () => void
}) {
  return (
    <Button
      size="sm"
      variant={saved ? "outline" : "default"}
      disabled={busy}
      onClick={onPress}
      aria-label={saved ? "Remove from your stickers" : "Add to your stickers"}
    >
      {saved ? <CheckIcon /> : <PlusIcon />}
      {saved ? "Added" : "Add"}
    </Button>
  )
}
