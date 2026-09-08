"use client"

import {
  BellOffIcon,
  GaugeIcon,
  HandCoinsIcon,
  KeyRoundIcon,
} from "lucide-react"
import { Row, Section, SelectRow } from "@/features/settings/components/rows"
import type { MoneyRequestPrivacy } from "@/features/users/types"
import { useMoneySettings } from "../../hooks/account/use-money-settings"
import {
  WALLET_LIMITS_PATH,
  WALLET_MUTED_PATH,
  WALLET_PIN_PATH,
} from "../../routes"
import { RequestPrivacySheet } from "./request-privacy-sheet"

const PRIVACY_LABELS: Record<MoneyRequestPrivacy, string> = {
  everyone: "Everyone",
  following: "People you follow",
  nobody: "No one",
}

export function MoneySettingsPanel() {
  const settings = useMoneySettings()

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
            value={PRIVACY_LABELS[settings.privacy]}
            onPress={() => settings.setPrivacyOpen(true)}
          />
          <SelectRow
            icon={BellOffIcon}
            label="Muted requesters"
            value={
              settings.mutedCount === 0 ? "None" : String(settings.mutedCount)
            }
            href={WALLET_MUTED_PATH}
          />
        </Section>
      </div>

      <RequestPrivacySheet
        open={settings.privacyOpen}
        onOpenChange={settings.setPrivacyOpen}
        value={settings.privacy}
        onSelect={settings.selectPrivacy}
      />
    </>
  )
}
