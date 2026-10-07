"use client"

import { useMutation } from "@tanstack/react-query"
import { recordAnnouncementEvent } from "../api"

export function useAnnouncementEvent() {
  return useMutation({
    mutationFn: recordAnnouncementEvent,
    meta: { silent: true },
  })
}
