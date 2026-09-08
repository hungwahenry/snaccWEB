"use client"

import { useState } from "react"
import { useLocalFlag } from "@/hooks/use-local-flag"
import { copyLink, shareLink, shareOrCopy } from "@/lib/share-links"

const OPENED_KEY = "snacc_anon_link_opened"

export function useAnonLink(enabled: boolean, username: string | null) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [opened, markOpened] = useLocalFlag(OPENED_KEY)
  const link = username ? shareLink.profile(username) : ""

  return {
    nudge: enabled && !opened,
    onOpen: () => {
      markOpened()
      setOpen(true)
    },
    sheet: {
      open,
      onOpenChange: setOpen,
      link,
      copied,
      onCopy: () => {
        void copyLink(link, "Your link")
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      },
      onShare: () =>
        void shareOrCopy(link, "Send me anonymous messages 👻", "Your link"),
    },
  }
}
