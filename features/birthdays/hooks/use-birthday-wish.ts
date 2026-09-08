"use client"

import { useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useLocalFlag } from "@/hooks/use-local-flag"

export function useBirthdayWish({
  blocked = false,
}: { blocked?: boolean } = {}) {
  const isBirthday = useMe().data?.profile?.is_birthday ?? false
  const year = String(new Date().getFullYear())
  const [wished, markWished] = useLocalFlag(`snacc_birthday_wished_${year}`)
  const [open, setOpen] = useState(false)

  const due = isBirthday && !blocked && !wished
  const [armed, setArmed] = useState(due)
  if (due !== armed) {
    setArmed(due)
    if (due) {
      markWished()
      setOpen(true)
    }
  }

  return {
    showButton: isBirthday,
    open,
    onOpenChange: setOpen,
    onOpen: () => setOpen(true),
  }
}
