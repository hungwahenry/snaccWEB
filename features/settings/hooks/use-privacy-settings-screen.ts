"use client"

import { useMessageSettings } from "@/features/messages/hooks/use-message-settings"
import { usePrivateAccount } from "@/features/users/hooks/use-private-account"
import { useBack } from "@/hooks/use-back"
import { SETTINGS_PATH } from "../routes"

export function usePrivacySettingsScreen() {
  const back = useBack(SETTINGS_PATH)
  const account = usePrivateAccount()
  const messages = useMessageSettings()

  return { onBack: back, account, messages }
}
