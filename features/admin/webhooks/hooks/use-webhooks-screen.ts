"use client"

import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useCallback, useState } from "react"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { WEBHOOK_PROVIDERS, WEBHOOK_STATUSES } from "../utils/webhooks"
import { useWebhook, useWebhookStats, useWebhooks } from "./use-webhooks"

const FILTERS = {
  q: parseAsString.withDefault(""),
  provider: parseAsStringLiteral(WEBHOOK_PROVIDERS),
  status: parseAsStringLiteral(WEBHOOK_STATUSES),
}

export function useWebhooksScreen() {
  const list = useListParams(FILTERS)
  const events = useWebhooks({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
    provider: list.query.provider ?? undefined,
    status: list.query.status ?? undefined,
  })

  // The id outlives the close so the dialog keeps its content while it animates away.
  const [selected, setSelected] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const show = useCallback((id: string) => {
    setSelected(id)
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])

  return {
    list,
    events,
    stats: useWebhookStats(),
    payload: { query: useWebhook(selected), open, show, close },
  }
}
