"use client"

import { useRouter } from "next/navigation"
import { useState, type KeyboardEvent } from "react"
import { confirm } from "@/components/ui/confirm"
import { useStickerCreator } from "@/features/stickers/hooks/use-sticker-creator"
import { composePath } from "../../routes"
import type {
  ComposeParams,
  StoredDraft,
  TypeaheadSuggestion,
} from "../../types"
import { COMPOSER_COPY, isSubmitShortcut } from "../../utils/composer"
import { useSnacc } from "../use-snacc"
import { useComposer } from "./use-composer"
import { useComposerTypeahead } from "./use-composer-typeahead"
import { useDrafts } from "./use-drafts"

/** The compose page: the composer, the words it suggests, the sticker tray and the drafts. */
export function useComposeScreen(params: ComposeParams) {
  const router = useRouter()
  const composer = useComposer(params)
  const drafts = useDrafts()
  const typeahead = useComposerTypeahead(composer.body, composer.cursor)
  const stickerCreator = useStickerCreator(composer.selectSticker)
  const parent = useSnacc(params.parentId ?? "")
  const quoting = useSnacc(params.resnaccOfId ?? "")
  const [trayOpen, setTrayOpen] = useState(false)
  const [draftsOpen, setDraftsOpen] = useState(false)

  function pick(suggestion: TypeaheadSuggestion) {
    if (!typeahead.token) return
    composer.replaceRange(
      typeahead.token.start,
      typeahead.token.end,
      suggestion.replacement
    )
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (isSubmitShortcut(event)) {
      event.preventDefault()
      composer.post()
      return
    }
    const choice = typeahead.suggestions[typeahead.highlighted]
    if (!typeahead.open || !choice) return

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      typeahead.move(event.key === "ArrowDown" ? 1 : -1)
    } else if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault()
      pick(choice)
    }
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
    copy: COMPOSER_COPY[composer.mode],
    parent: parent.data ?? null,
    quoting: quoting.data ?? null,
    onKeyDown,
    suggestions: typeahead.open
      ? {
          suggestions: typeahead.suggestions,
          loading: typeahead.loading,
          highlighted: typeahead.highlighted,
          onPick: pick,
        }
      : null,
    openStickerTray: () => setTrayOpen(true),
    stickerTray: {
      open: trayOpen,
      onOpenChange: setTrayOpen,
      onPickSticker: composer.showSticker ? composer.selectSticker : undefined,
      onPickGif: composer.showGif ? composer.selectGif : undefined,
      onCreateSticker: composer.showSticker
        ? () => {
            setTrayOpen(false)
            stickerCreator.begin()
          }
        : undefined,
    },
    stickerCreator,
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
