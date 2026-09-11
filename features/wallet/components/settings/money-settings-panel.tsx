import {
  BellOffIcon,
  GaugeIcon,
  HandCoinsIcon,
  KeyRoundIcon,
} from "lucide-react"
import { Row, Section, SelectRow } from "@/features/settings/components/rows"
import type { MoneySettingsProps } from "../../hooks/account/use-money-settings"
import {
  WALLET_LIMITS_PATH,
  WALLET_MUTED_PATH,
  WALLET_PIN_PATH,
} from "../../routes"
import { RequestPrivacySheet } from "./request-privacy-sheet"

export function MoneySettingsPanel({
  privacy,
  mutedLabel,
}: MoneySettingsProps) {
  return (
    <>
      <div className="flex flex-col gap-5 px-6 py-6">
        <Section title="Security">
          <Row icon={KeyRoundIcon} label="Change PIN" href={WALLET_PIN_PATH} />
        </Section>

        <Section title="Limits">
          <Row icon={GaugeIcon} label="Your limits" href={WALLET_LIMITS_PATH} />
        </Section>

        <Section title="Requests">
          <SelectRow
            icon={HandCoinsIcon}
            label="Who can ask for money"
            value={privacy.label}
            onPress={() => privacy.onOpenChange(true)}
          />
          <SelectRow
            icon={BellOffIcon}
            label="Muted requesters"
            value={mutedLabel}
            href={WALLET_MUTED_PATH}
          />
        </Section>
      </div>

      <RequestPrivacySheet
        open={privacy.open}
        onOpenChange={privacy.onOpenChange}
        value={privacy.value}
        onSelect={privacy.onSelect}
      />
    </>
  )
}
