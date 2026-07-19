"use client"

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { createAnnouncement, deleteAnnouncement, listAnnouncements } from "./api"
import type { ListAnnouncementsParams } from "./types"

export function useAnnouncements(params: ListAnnouncementsParams) {
  return useQuery({
    queryKey: ["admin", "announcements", params],
    queryFn: () => listAnnouncements(params),
    placeholderData: keepPreviousData,
  })
}

export function useAnnouncementMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "announcements"] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    create: useMutation({
      mutationFn: createAnnouncement,
      onSuccess: onSuccess("Announcement broadcast."),
      onError,
    }),
    remove: useMutation({
      mutationFn: (id: string) => deleteAnnouncement(id),
      onSuccess: onSuccess("Announcement deleted."),
      onError,
    }),
  }
}
