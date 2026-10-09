import { ChatThemeSkeleton } from "@/features/messages/components/themes/chat-theme-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Chat theme" subtitle="Only you see it" />
      <ChatThemeSkeleton />
    </>
  )
}
