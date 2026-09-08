"use client"

import { MessageComposer } from "@/features/messages/components/composer/message-composer"
import { useMessageComposer } from "@/features/messages/hooks/use-message-composer"

/// The DM composer with everything it can attach left switched off. Reusing it rather than
/// rebuilding a growing text field is the point.
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
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}
