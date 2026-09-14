"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { JsonBlock } from "@/features/admin/shell/components/json-block"
import { QueryView } from "@/features/admin/shell/components/query-view"
import type { WebhookEventDetail } from "../types"
import { deliveryLine } from "../utils/webhooks"

export function WebhookPayloadDialog({
  query,
  open,
  onClose,
}: {
  query: UseQueryResult<WebhookEventDetail>
  open: boolean
  onClose: () => void
}) {
  const event = query.data

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event?.type ?? "Delivery"}</DialogTitle>
          <DialogDescription>
            {event ? deliveryLine(event) : "What the provider sent."}
          </DialogDescription>
        </DialogHeader>
        <QueryView query={query} what="this delivery">
          {(delivery) => (
            <div className="flex min-w-0 flex-col gap-3">
              {delivery.note ? (
                <p className="text-sm text-pretty text-muted-foreground">
                  {delivery.note}
                </p>
              ) : null}
              <JsonBlock label="Payload" value={delivery.payload} />
            </div>
          )}
        </QueryView>
      </DialogContent>
    </Dialog>
  )
}
