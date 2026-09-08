"use client"

import { useState } from "react"
import { confirm } from "@/components/ui/confirm"
import type { useReportSheet } from "@/features/reports/hooks/use-report-sheet"
import type { MessageParty } from "../types"
import { useConversationActions } from "./use-conversation-actions"

export function useConversationMenu(
  id: string,
  other: MessageParty | null,
  report: ReturnType<typeof useReportSheet>
) {
  const { reveal, block, unblock } = useConversationActions(id)
  const [open, setOpen] = useState(false)

  function confirmReveal() {
    setOpen(false)
    confirm({
      title: "Reveal yourself?",
      message:
        "They'll see your real name and profile from now on. You can't undo this.",
      actions: [{ label: "Reveal", onPress: () => reveal.mutate() }],
    })
  }

  function confirmBlock() {
    setOpen(false)
    confirm({
      title: "Block this person?",
      message: "They will never be able to message you again.",
      actions: [
        { label: "Block", destructive: true, onPress: () => block.mutate() },
      ],
    })
  }

  return {
    menuOpen: open,
    setMenuOpen: setOpen,
    onOpenMenu: () => setOpen(true),
    confirmReveal,
    confirmBlock,
    onUnblock: () => {
      setOpen(false)
      unblock.mutate()
    },
    onReportOther: () => {
      setOpen(false)
      if (other?.id)
        report.open({ type: "user", id: other.id, username: other.username })
    },
  }
}
