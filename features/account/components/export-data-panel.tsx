import { DownloadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  SettingsBullets,
  SettingsIntro,
} from "@/features/settings/components/settings-intro"

const INCLUDED = [
  "Your profile and account details",
  "Every snacc, reply and reaction you posted",
  "Follows, saved snaccs, blocks and reports",
  "Earnings, withdrawals and payout details",
  "Notification preferences and devices",
]

export function ExportDataPanel({
  exporting,
  onExport,
}: {
  exporting: boolean
  onExport: () => void
}) {
  return (
    <div className="flex flex-col gap-6 px-6 pt-4 pb-8">
      <SettingsIntro
        icon={DownloadIcon}
        title="Your data, exported"
        description="Get a full copy of everything you've shared on Snacc as a JSON file you can save or share."
      />

      <SettingsBullets items={INCLUDED} />

      <p className="text-sm text-muted-foreground">
        We&apos;ll prepare the file and your browser will download it.
      </p>

      <Button
        size="lg"
        className="h-14 text-base"
        disabled={exporting}
        onClick={onExport}
      >
        {exporting ? <Spinner /> : "Download my data"}
      </Button>
    </div>
  )
}
