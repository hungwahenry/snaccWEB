import { ShieldAlertIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PackTakenDown() {
  return (
    <Alert variant="destructive">
      <ShieldAlertIcon />
      <AlertTitle>This pack was taken down</AlertTitle>
      <AlertDescription>
        It broke the community guidelines, so nobody can see it or send its
        stickers anymore. You can still delete it.
      </AlertDescription>
    </Alert>
  )
}
