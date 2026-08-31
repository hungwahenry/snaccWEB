"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { formatDate } from "@/lib/format"
import { useWebhook } from "../hooks/use-webhooks"

export function WebhookPayload({
  id,
  onClose,
}: {
  id: string | null
  onClose: () => void
}) {
  const event = useWebhook(id)

  return (
    <Sheet open={!!id} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{event.data?.type ?? "Delivery"}</SheetTitle>
          <SheetDescription>
            {event.data
              ? `${event.data.event_id} · received ${formatDate(event.data.created_at)}`
              : "What the provider sent."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6">
          {event.isPending ? (
            <Spinner />
          ) : event.data ? (
            <>
              {event.data.note ? (
                <p className="text-muted-foreground mb-3 text-sm">
                  {event.data.note}
                </p>
              ) : null}
              <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs">
                {JSON.stringify(event.data.payload, null, 2)}
              </pre>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              Couldn&apos;t load this delivery.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
