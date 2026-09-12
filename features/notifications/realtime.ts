import { requestsChanged } from "@/features/follows/cache"
import { getQueryClient } from "@/lib/query/client"
import { NOTIFICATIONS_KEY } from "./hooks/use-notifications"
import { UNREAD_KEY } from "./hooks/use-unread-count"

const SPREAD_MS = 5_000

function notificationsChanged(): void {
  const queryClient = getQueryClient()
  void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
  void queryClient.invalidateQueries({ queryKey: UNREAD_KEY })
}

export function onNotification(): void {
  notificationsChanged()
  requestsChanged()
}

/** An announcement reaches everyone at once, so each page waits a random moment before asking. */
export function onNotificationsChanged(payload?: { spread?: boolean }): void {
  if (payload?.spread)
    window.setTimeout(notificationsChanged, Math.random() * SPREAD_MS)
  else notificationsChanged()
}
