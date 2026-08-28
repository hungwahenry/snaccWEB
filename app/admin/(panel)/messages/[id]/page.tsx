"use client"

import Link from "next/link"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ConversationThread } from "@/features/admin/messages/conversation-thread"
import {
  useConversation,
  useMessageModeration,
} from "@/features/admin/messages/use-messages"

export default function MessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const query = useConversation(id)
  const actions = useMessageModeration(id)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 w-fit"
        render={<Link href="/admin/messages" />}
      >
        ← Back to messages
      </Button>
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load this thread.
        </p>
      ) : (
        <ConversationThread conversation={query.data} actions={actions} />
      )}
    </>
  )
}
