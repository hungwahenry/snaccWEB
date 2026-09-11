"use client"

import { MessageComposer } from "@/features/messages/components/composer/message-composer"
import { useMessageComposer } from "@/features/messages/hooks/use-message-composer"

export function MomentReplyComposer({
  onReply,
  replying,
  onFocus,
  onBlur,
}: {
  onReply: (body: string) => void
  replying: boolean
  onFocus: () => void
  onBlur: () => void
}) {
  const composer = useMessageComposer({ onSend: onReply, sending: replying })

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
