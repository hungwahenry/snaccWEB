"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { formatDate } from "@/lib/format"
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  listAnnouncements,
  removeAnnouncementImage,
  sendAnnouncement,
  setAnnouncementImportant,
  testAnnouncement,
  unscheduleAnnouncement,
  updateAnnouncement,
  uploadAnnouncementImage,
} from "../api"
import type {
  AnnouncementListQuery,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "../types"
import { sendingPoll } from "../utils/announcement"
import { adminAnnouncementKeys } from "../utils/keys"

export function useAnnouncements(query: AnnouncementListQuery) {
  return useQuery({
    queryKey: adminAnnouncementKeys.list(query),
    queryFn: () => listAnnouncements(query),
    placeholderData: keepPreviousData,
    refetchInterval: (current) =>
      sendingPoll(
        current.state.data?.items.map((announcement) => announcement.status) ??
          []
      ),
  })
}

export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: adminAnnouncementKeys.detail(id),
    queryFn: () => getAnnouncement(id),
    refetchInterval: (current) =>
      sendingPoll(current.state.data ? [current.state.data.status] : []),
  })
}

const touched = (id: string) => [
  adminAnnouncementKeys.lists(),
  adminAnnouncementKeys.detail(id),
]

export function useAnnouncementActions() {
  const { run: create } = useAdminMutation({
    mutationFn: (input: CreateAnnouncementInput) => createAnnouncement(input),
    success: "Draft saved.",
    invalidates: [adminAnnouncementKeys.lists()],
  })
  const { run: update } = useAdminMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: UpdateAnnouncementInput
    }) => updateAnnouncement(id, input),
    success: "Announcement saved.",
    invalidates: (_announcement, { id }) => touched(id),
  })
  const { run: uploadImage } = useAdminMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadAnnouncementImage(id, file),
    success: "Image attached.",
    invalidates: (_announcement, { id }) => touched(id),
  })
  const { run: removeImage } = useAdminMutation({
    mutationFn: (id: string) => removeAnnouncementImage(id),
    success: "Image removed.",
    invalidates: (_announcement, id) => touched(id),
  })
  const { run: setImportant } = useAdminMutation({
    mutationFn: ({ id, important }: { id: string; important: boolean }) =>
      setAnnouncementImportant(id, important),
    success: (_announcement, { important }) =>
      important ? "Marked important." : "No longer important.",
    invalidates: (_announcement, { id }) => touched(id),
  })
  const { run: test } = useAdminMutation({
    mutationFn: (id: string) => testAnnouncement(id),
    success: "Sent to you. Check your phone and your notifications.",
  })
  const { run: send } = useAdminMutation({
    mutationFn: ({ id, at }: { id: string; at?: string }) =>
      sendAnnouncement(id, at),
    success: (announcement) =>
      announcement.status === "scheduled"
        ? `Scheduled for ${formatDate(announcement.send_at)}.`
        : "Sending now.",
    invalidates: (_announcement, { id }) => touched(id),
  })
  const { run: unschedule } = useAdminMutation({
    mutationFn: (id: string) => unscheduleAnnouncement(id),
    success: "Back to a draft.",
    invalidates: (_announcement, id) => touched(id),
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    success: "Announcement deleted.",
    invalidates: [adminAnnouncementKeys.lists()],
  })

  return useMemo(
    () => ({
      create,
      update: (id: string, input: UpdateAnnouncementInput) =>
        update({ id, input }),
      uploadImage: (id: string, file: File) => uploadImage({ id, file }),
      removeImage,
      setImportant: (id: string, important: boolean) =>
        setImportant({ id, important }),
      test,
      send: (id: string, at?: string) => send({ id, at }),
      unschedule,
      remove,
    }),
    [
      create,
      update,
      uploadImage,
      removeImage,
      setImportant,
      test,
      send,
      unschedule,
      remove,
    ]
  )
}
