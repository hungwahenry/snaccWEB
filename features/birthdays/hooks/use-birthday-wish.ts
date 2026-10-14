"use client"

import { useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useNudge } from "@/features/nudges/hooks/use-nudge"

export function useBirthdayWish() {
  const isBirthday = useMe().data?.profile?.is_birthday ?? false
  const [open, setOpen] = useState(false)

  useNudge("birthday_wish", isBirthday, () => setOpen(true))

  return {
    showButton: isBirthday,
    open,
    onOpenChange: setOpen,
    onOpen: () => setOpen(true),
  }
}
