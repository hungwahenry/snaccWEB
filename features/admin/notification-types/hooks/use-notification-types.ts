"use client"

import { useQuery } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { listNotificationTypes, updateNotificationType } from "../api"
import type { NotificationTypeDraft, NotificationTypeRow } from "../types"
import { adminNotificationTypeKeys } from "../utils/keys"
import { filterTypes, toPatch } from "../utils/notification-types"

/** Every notification type there is, narrowed on the client to what was searched for. */
export function useNotificationTypes(search: string) {
  const select = useCallback(
    (rows: NotificationTypeRow[]) => filterTypes(rows, search),
    [search]
  )

  return useQuery({
    queryKey: adminNotificationTypeKeys.list(),
    queryFn: listNotificationTypes,
    select,
  })
}

export function useNotificationTypeActions() {
  const { run: save } = useAdminMutation({
    mutationFn: ({
      key,
      draft,
    }: {
      key: string
      draft: NotificationTypeDraft
    }) => updateNotificationType(key, toPatch(draft)),
    success: "Notification updated.",
    invalidates: [adminNotificationTypeKeys.all()],
  })

  return useMemo(
    () => ({
      save: (key: string, draft: NotificationTypeDraft) => save({ key, draft }),
    }),
    [save]
  )
}
