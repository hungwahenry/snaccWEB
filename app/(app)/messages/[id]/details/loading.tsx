import { ConversationDetailsSkeleton } from "@/features/messages/components/details/conversation-details-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Details" />
      <ConversationDetailsSkeleton />
    </>
  )
}
