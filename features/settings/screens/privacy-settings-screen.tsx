"use client"

import { GhostIcon, LockIcon } from "lucide-react"
import { BackHeader } from "@/features/navigation/components/back-header"
import { Section, ToggleRow } from "../components/rows"
import { usePrivacySettingsScreen } from "../hooks/use-privacy-settings-screen"

export function PrivacySettingsScreen() {
  const { onBack, account, messages } = usePrivacySettingsScreen()

  return (
    <>
      <BackHeader title="Privacy" onBack={onBack} />
      <div className="flex flex-col gap-5 px-6 py-6">
        {account.shown ? (
          <Section title="Account">
            <ToggleRow
              icon={LockIcon}
              label="Private account"
              hint="Only people you approve see your snaccs"
              value={account.isPrivate}
              disabled={!account.ready}
              onChange={account.setPrivate}
            />
          </Section>
        ) : null}
        {messages.shown ? (
          <Section title="Anonymous messages">
            <ToggleRow
              icon={GhostIcon}
              label="Anonymous messages"
              hint="Let people send you anonymous messages"
              value={messages.acceptsAnonymous}
              disabled={!messages.ready}
              onChange={messages.setAcceptsAnonymous}
            />
          </Section>
        ) : null}
      </div>
    </>
  )
}
