"use client"

import { useState } from "react"
import type { MoneyRequestPrivacy } from "@/features/users/types"
import { mutedCountLabel, requestPrivacyLabel } from "../../utils/settings"
import { useMutes } from "../requests/use-mutes"
import { useRequestPrivacy } from "./use-request-privacy"

export function useMoneySettings() {
  const { privacy, setPrivacy } = useRequestPrivacy()
  const mutes = useMutes()
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return {
    privacy: {
      value: privacy,
      label: requestPrivacyLabel(privacy),
      open: privacyOpen,
      onOpenChange: setPrivacyOpen,
      onSelect: (value: MoneyRequestPrivacy) => {
        setPrivacyOpen(false)
        setPrivacy(value)
      },
    },
    mutedLabel: mutes.data ? mutedCountLabel(mutes.data.length) : "",
  }
}

export type MoneySettingsProps = ReturnType<typeof useMoneySettings>
