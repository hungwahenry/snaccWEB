"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { ComposerScreen } from "@/components/ui/composer-screen"
import { useBack } from "@/hooks/use-back"
import { MessageComposer } from "../components/composer/message-composer"
import { AnonymousNote } from "../components/conversations/anonymous-note"
import { useMessageComposer } from "../hooks/use-message-composer"
import { useStartConversation } from "../hooks/use-start-conversation"
import { useVerifiedHandle } from "../hooks/use-verified-handle"

export function NewMessageScreen({
  targetId,
  username,
}: {
  targetId: string
  username: string | null
}) {
  const back = useBack()
  const start = useStartConversation()
  const handle = useVerifiedHandle(targetId, username)
  const composer = useMessageComposer({
    onSend: (body) => start.mutate({ targetId, body }),
    sending: start.isPending,
  })

  return (
    <ComposerScreen>
      <BackHeader
        title={handle ? `Message @${handle}` : "Anonymous message"}
        onBack={back}
      />

      <AnonymousNote />

      <MessageComposer
        {...composer.field}
        placeholder="Say something anonymous…"
      />
    </ComposerScreen>
  )
}
