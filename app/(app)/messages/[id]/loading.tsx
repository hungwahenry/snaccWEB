import { MessageThreadSkeleton } from "@/features/messages/components/thread/message-thread-skeleton"

export default function Loading() {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <MessageThreadSkeleton />
    </>
  )
}
