"use client"

import { useRouter } from "next/navigation"
import { useState, type KeyboardEvent } from "react"
import { confirm } from "@/components/ui/confirm"
import { composePath } from "../../routes"
import type { ComposeParams, EntityKind, StoredDraft } from "../../types"
import {
  COMPOSER_COPY,
  HANGOUT_COPY,
  isSubmitShortcut,
} from "../../utils/composer"
import { useScheduledSheet } from "../scheduled/use-scheduled-sheet"
import { useSnacc } from "../use-snacc"
import { useComposer } from "./use-composer"
import { useTypeaheadPicker } from "./use-typeahead-picker"
import { useDrafts } from "./use-drafts"

const SNACC_ENTITIES: readonly EntityKind[] = ["hashtag", "mention", "cashtag"]

/** The compose page: the composer, the words it suggests, the sticker tray and the drafts. */
export function useComposeScreen(params: ComposeParams) {
  const router = useRouter()
  const composer = useComposer(params)
  const drafts = useDrafts()
  const scheduled = useScheduledSheet({
    enabled: composer.schedule.available,
  })
  const typeahead = useTypeaheadPicker(composer, SNACC_ENTITIES)
  const parent = useSnacc(params.parentId ?? null)
  const quoting = useSnacc(params.resnaccOfId ?? null)
  const [trayOpen, setTrayOpen] = useState(false)
  const [draftsOpen, setDraftsOpen] = useState(false)
  const [scheduledOpen, setScheduledOpen] = useState(false)

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (isSubmitShortcut(event)) {
      event.preventDefault()
      composer.post()
      return
    }
    typeahead.handleKey(event)
  }

  function openDraft(draft: StoredDraft) {
    setDraftsOpen(false)
    if (draft.id === params.draftId) return
    composer.beforeSwitching(() =>
      router.replace(
        composePath({
          draftId: draft.id,
          parentId: draft.parentId,
          resnaccOfId: draft.resnaccOfId,
        })
      )
    )
  }

  return {
    composer,
    copy: composer.hangout ? HANGOUT_COPY : COMPOSER_COPY[composer.mode],
    parent: parent.data ?? null,
    quoting: quoting.data ?? null,
    onKeyDown,
    suggestions: typeahead.suggestions,
    openStickerTray: () => setTrayOpen(true),
    stickerTray: {
      open: trayOpen,
      onOpenChange: setTrayOpen,
      onPickSticker: composer.showSticker ? composer.selectSticker : undefined,
      onPickGif: composer.showGif ? composer.selectGif : undefined,
      beforeLeaving: composer.beforeLeaving,
    },
    scheduledCount: composer.schedule.available ? scheduled.count : 0,
    openScheduled: () => {
      scheduled.reset()
      setScheduledOpen(true)
    },
    scheduledSheet: {
      open: scheduledOpen,
      onOpenChange: setScheduledOpen,
      ...scheduled.sheet,
    },
    draftCount: drafts.drafts.length,
    openDrafts: () => setDraftsOpen(true),
    draftsSheet: {
      open: draftsOpen,
      onOpenChange: setDraftsOpen,
      drafts: drafts.drafts,
      onPick: openDraft,
      onDelete: (draft: StoredDraft) =>
        confirm({
          title: "Delete this draft?",
          message: "It goes for good. Nothing you already posted changes.",
          actions: [
            {
              label: "Delete",
              destructive: true,
              onPress: () => void drafts.remove(draft.id),
            },
          ],
        }),
    },
  }
}
