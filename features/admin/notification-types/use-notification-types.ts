"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  listNotificationTypes,
  updateNotificationType,
  type NotificationTypePatch,
} from "./index"

const KEY = ["admin", "notification-types"]

export function useNotificationTypes() {
  return useQuery({ queryKey: KEY, queryFn: listNotificationTypes })
}

export function useUpdateNotificationType() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      key,
      patch,
    }: {
      key: string
      patch: NotificationTypePatch
    }) => updateNotificationType(key, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      toast.success("Notification updated.")
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  })
}
