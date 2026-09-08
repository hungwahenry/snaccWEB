import { TriangleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  SettingsBullets,
  SettingsIntro,
} from "@/features/settings/components/settings-intro"

const REMOVED = [
  "Your profile, username and photo",
  "Every snacc, reply and reaction you posted",
  "Your followers and who you follow",
  "Saved snaccs, blocks and reports",
  "Your wallet balance and earnings history",
]

export function DeleteAccountPanel({
  deleting,
  onDelete,
}: {
  deleting: boolean
  onDelete: () => void
}) {
  return (
    <div className="flex flex-col gap-6 px-6 pt-4 pb-8">
      <SettingsIntro
        icon={TriangleAlertIcon}
        tone="destructive"
        title="This is permanent"
        description="Deleting your account can't be undone. Everything below is erased for good."
      />

      <SettingsBullets items={REMOVED} />

      <p className="text-sm text-muted-foreground">
        We&apos;ll email you a code first to confirm it&apos;s really you.
      </p>

      <Button
        variant="destructive"
        size="lg"
        className="h-14 text-base"
        disabled={deleting}
        onClick={onDelete}
      >
        {deleting ? <Spinner /> : "Delete my account"}
      </Button>
    </div>
  )
}
