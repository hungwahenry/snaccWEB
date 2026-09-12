import { ComposerScreen } from "@/components/ui/composer-screen"
import { MessageComposerPlaceholder } from "@/features/messages/components/composer/message-composer-placeholder"
import { MessageThreadSkeleton } from "@/features/messages/components/thread/message-thread-skeleton"
import { MESSAGES_PATH } from "@/features/messages/routes"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <ComposerScreen>
      <RouteBackHeader title="" fallback={MESSAGES_PATH} />
      <div className="flex min-h-0 flex-1 flex-col px-3 py-4">
        <MessageThreadSkeleton />
      </div>
      <MessageComposerPlaceholder
        placeholder="Message the room…"
        withActions
      />
    </ComposerScreen>
  )
}
