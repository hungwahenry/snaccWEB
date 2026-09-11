import { getQueryClient } from "@/lib/query/client"
import { NOTIFICATIONS_KEY } from "./hooks/use-notifications"
import { UNREAD_KEY } from "./hooks/use-unread-count"

export function onNotification(): void {
  const queryClient = getQueryClient()
  void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
  void queryClient.invalidateQueries({ queryKey: UNREAD_KEY })
}
