"use client"

import { confirm } from "@/components/ui/confirm"
import { useConversationActions } from "./use-conversation-actions"

export function useConfirmReveal(id: string) {
  const { reveal } = useConversationActions(id)

  return () =>
    confirm({
      title: "Reveal yourself?",
      message:
        "They'll see your real name and profile from now on. You can't undo this.",
      actions: [{ label: "Reveal", onPress: () => reveal.mutate() }],
    })
}
