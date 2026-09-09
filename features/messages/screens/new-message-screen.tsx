"use client"

import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { BackHeader } from "@/features/navigation/components/back-header"
import { ComposerScreen } from "@/components/ui/composer-screen"
import { useBack } from "@/hooks/use-back"
import { MessageComposer } from "../components/composer/message-composer"
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

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-10 text-center">
        <GhostAvatar className="size-16" iconClassName="size-8" />
        <p className="text-base leading-5 text-foreground">
          They&apos;ll see an anonymous ghost, never you, until you choose to
          reveal yourself.
        </p>
      </div>

      <MessageComposer
        body={composer.body}
        onChange={composer.change}
        onSend={composer.send}
        canSend={composer.canSend}
        sending={composer.sending}
        editing={false}
        context={null}
        placeholder="Say something anonymous…"
        maxLength={composer.maxLength}
        remaining={composer.remaining}
        showCounter={composer.showCounter}
      />
    </ComposerScreen>
  )
}
