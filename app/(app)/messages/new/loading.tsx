import { ComposerScreen } from "@/components/ui/composer-screen"
import { MessageComposerPlaceholder } from "@/features/messages/components/composer/message-composer-placeholder"
import { AnonymousNote } from "@/features/messages/components/conversations/anonymous-note"
import { ConversationHeaderSkeleton } from "@/features/messages/components/conversations/conversation-header-skeleton"

export default function Loading() {
  return (
    <ComposerScreen>
      <ConversationHeaderSkeleton />
      <AnonymousNote />
      <MessageComposerPlaceholder placeholder="Say something anonymous…" />
    </ComposerScreen>
  )
}
