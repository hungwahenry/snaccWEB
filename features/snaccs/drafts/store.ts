"use client"

import { useSyncExternalStore } from "react"
import { readDrafts, removeDraft, saveDraft } from "./storage"
import type { DraftContent, StoredDraft } from "./types"

interface DraftsState {
  drafts: StoredDraft[]
  hydrated: boolean
}

let state: DraftsState = { drafts: [], hydrated: false }
let hydrating: Promise<void> | null = null
const listeners = new Set<() => void>()

function publish(next: DraftsState) {
  state = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const SERVER: DraftsState = { drafts: [], hydrated: false }

export function hydrateDrafts(): Promise<void> {
  if (state.hydrated) return Promise.resolve()
  hydrating ??= readDrafts().then((drafts) =>
    publish({ drafts, hydrated: true })
  )
  return hydrating
}

export function useDrafts(): DraftsState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER
  )
}

export async function saveStoredDraft(
  content: DraftContent,
  replacesId?: string
): Promise<StoredDraft> {
  const draft = await saveDraft(content, replacesId)
  publish({ drafts: await readDrafts(), hydrated: true })
  return draft
}

export async function removeStoredDraft(id: string): Promise<void> {
  publish({ drafts: await removeDraft(id), hydrated: true })
}

export function draftById(id: string | undefined): StoredDraft | undefined {
  if (!id) return undefined
  return state.drafts.find((draft) => draft.id === id)
}
