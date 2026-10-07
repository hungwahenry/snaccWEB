"use client"

import { useRouter } from "next/navigation"
import { useEffect, useSyncExternalStore } from "react"
import { isNotFound } from "@/lib/api/errors"
import { openExternal } from "@/lib/links"
import { announcementLink } from "../utils/links"
import { useAnnouncement } from "./use-announcement"
import { useAnnouncementEvent } from "./use-announcement-event"

interface SheetState {
  id: string | null
  open: boolean
}

const CLOSED: SheetState = { id: null, open: false }

let state = CLOSED
const listeners = new Set<() => void>()

function set(next: SheetState): void {
  state = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => state
const getServerSnapshot = () => CLOSED

export function openAnnouncement(id: string): void {
  set({ id, open: true })
}

function closeAnnouncement(): void {
  set({ ...state, open: false })
}

export function useAnnouncementSheet() {
  const router = useRouter()
  const { id, open } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const query = useAnnouncement(id, open)
  const { mutate: record } = useAnnouncementEvent()
  const announcement = query.data ?? null

  useEffect(() => {
    if (open && id) record({ id, kind: "opened" })
  }, [open, id, record])

  function onButton(index: number) {
    const button = announcement?.buttons[index]
    if (!announcement || !button) return
    record({ id: announcement.id, kind: "tapped", button: index })
    closeAnnouncement()

    const link = announcementLink(button.url)
    if (link?.kind === "app") router.push(link.path)
    else if (link?.kind === "web") openExternal(link.url)
  }

  return {
    open,
    onOpenChange: (next: boolean) => {
      if (!next) closeAnnouncement()
    },
    announcement,
    gone: isNotFound(query.error),
    failed: query.isError,
    onRetry: () => void query.refetch(),
    onButton,
  }
}
