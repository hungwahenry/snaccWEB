import { ComposerScreen } from "@/components/ui/composer-screen"
import { MessageComposerPlaceholder } from "@/features/messages/components/composer/message-composer-placeholder"
import { ConversationHeaderSkeleton } from "@/features/messages/components/conversations/conversation-header-skeleton"
import { MessageThreadSkeleton } from "@/features/messages/components/thread/message-thread-skeleton"

export default function Loading() {
  return (
    <ComposerScreen>
      <ConversationHeaderSkeleton />
      <div className="flex min-h-0 flex-1 flex-col px-3 py-4">
        <MessageThreadSkeleton />
      </div>
      <MessageComposerPlaceholder withActions />
    </ComposerScreen>
  )
}
