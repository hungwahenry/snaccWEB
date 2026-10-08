"use client"

import { MessageComposer } from "@/features/messages/components/composer/message-composer"
import { useMessageComposer } from "@/features/messages/hooks/use-message-composer"

export function MomentReplyComposer({
  onReply,
  onFocus,
  onBlur,
}: {
  onReply: (body: string) => void
  onFocus: () => void
  onBlur: () => void
}) {
  const composer = useMessageComposer({ onSend: onReply })

  return (
    <MessageComposer
      {...composer.field}
      onDark
      placeholder="Reply privately…"
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}
