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
      onDark
      placeholder="Reply privately…"
      body={composer.body}
      onChange={composer.change}
      onSend={composer.send}
      canSend={composer.canSend}
      sending={composer.sending}
      editing={false}
      context={null}
      maxLength={composer.maxLength}
      remaining={composer.remaining}
      showCounter={composer.showCounter}
      upgrade={composer.upgrade}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}
