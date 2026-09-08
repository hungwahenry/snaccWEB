"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { confirm } from "@/components/ui/confirm"
import { useMe } from "@/features/auth/hooks/use-me"
import { useGhostCountdown } from "@/features/ghost/hooks/use-ghost-countdown"
import { useGhostWindow } from "@/features/ghost/hooks/use-ghost-window"
import { useStickerCreator } from "@/features/stickers/hooks/use-sticker-creator"
import { useBack } from "@/hooks/use-back"
import type { SnaccDraft } from "../../cache/optimistic-snacc"
import { toOptimisticAuthor } from "../../cache/optimistic-snacc"
import { submitSnacc } from "../../cache/pending-snaccs"
import {
  toDraftSeed,
  toStoredImage,
  toStoredPoll,
  toStoredVoice,
} from "../../drafts/mapping"
import {
  draftById,
  hydrateDrafts,
  removeStoredDraft,
  saveStoredDraft,
  useDrafts,
} from "../../drafts/store"
import type { StoredDraft } from "../../drafts/types"
import { composePath, snaccPath } from "../../routes"
import { pickedAssets } from "../../utils/draft-images"
import type { PollDraft } from "./use-poll-draft"
import { EMPTY_DRAFT, pollMinutes, useSnaccDraft } from "./use-snacc-draft"
import {
  useComposerTypeahead,
  type TypeaheadSuggestion,
} from "./use-composer-typeahead"

export type ComposerMode = "reply" | "quote" | "new"

function pollPayload(poll: PollDraft) {
  const filled = poll.options.filter((option) => option.text.trim().length > 0)
  return {
    options: filled.map((option) => option.text.trim()),
    images: filled.every((option) => option.image !== null)
      ? filled.map((option) => option.image!)
      : undefined,
    durationMinutes: pollMinutes(poll),
  }
}

export function useComposer(params: {
  parentId?: string
  resnaccOfId?: string
  initialBody?: string
  draftId?: string
}) {
  const router = useRouter()
  const back = useBack()
  const me = useMe()
  const ghost = useGhostWindow()
  const countdown = useGhostCountdown()
  const submitted = useRef(false)
  const { drafts } = useDrafts()
  const [draftsOpen, setDraftsOpen] = useState(false)
  const [stickerTrayOpen, setStickerTrayOpen] = useState(false)

  useEffect(() => {
    void hydrateDrafts()
  }, [])

  const mode: ComposerMode = params.parentId
    ? "reply"
    : params.resnaccOfId
      ? "quote"
      : "new"

  const [seed] = useState(() => {
    const stored = draftById(params.draftId)
    return stored
      ? toDraftSeed(stored)
      : { ...EMPTY_DRAFT, body: params.initialBody ?? "" }
  })
  const draft = useSnaccDraft(seed, { allowVoice: !ghost.active })
  const typeahead = useComposerTypeahead(draft.body, draft.cursor)

  const stickerCreator = useStickerCreator(draft.selectSticker)

  const dirty =
    draft.trimmed.length > 0 ||
    draft.images.length > 0 ||
    draft.gif !== null ||
    draft.sticker !== null ||
    draft.voice !== null ||
    draft.poll !== null

  function toDraft(): SnaccDraft {
    return {
      body: draft.trimmed || null,
      images: pickedAssets(draft.images),
      gif: draft.gif,
      sticker: draft.sticker,
      voice: draft.voice,
      parentId: params.parentId,
      resnaccOfId: params.resnaccOfId,
      poll: draft.poll && draft.pollValid ? pollPayload(draft.poll) : undefined,
      spoiler: draft.hasMedia && draft.spoiler,
      anonymous: ghost.active,
    }
  }

  function leave() {
    submitted.current = true
    back()
  }

  function post() {
    if (!draft.withinLimits || submitted.current) return
    if (!me.data) {
      toast.error(
        "Could not post. Your session is still loading, try again in a moment."
      )
      return
    }
    submitted.current = true
    submitSnacc(toDraft(), toOptimisticAuthor(me.data))
    if (params.draftId) void removeStoredDraft(params.draftId)
    if (params.parentId) router.replace(snaccPath(params.parentId))
    else router.replace("/home")
  }

  async function saveAsDraft() {
    try {
      await saveStoredDraft(
        {
          parentId: params.parentId,
          resnaccOfId: params.resnaccOfId,
          body: draft.body,
          spoiler: draft.spoiler,
          images: pickedAssets(draft.images).map(toStoredImage),
          voice: draft.voice ? toStoredVoice(draft.voice) : null,
          gif: draft.gif,
          sticker: draft.sticker,
          poll: draft.poll ? toStoredPoll(draft.poll) : null,
        },
        params.draftId
      )
      toast.success("Saved to drafts.")
      leave()
    } catch {
      toast.error("Could not save the draft.")
    }
  }

  function close() {
    if (!dirty) {
      leave()
      return
    }
    confirm({
      title: "Keep this snacc?",
      message: "Save it as a draft and pick it up later.",
      cancelLabel: "Keep editing",
      actions: [
        { label: "Save draft", onPress: () => void saveAsDraft() },
        { label: "Discard", destructive: true, onPress: leave },
      ],
    })
  }

  return {
    ...draft,
    mode,
    dirty,
    ghost: ghost.active,
    ghostTimeLeft: countdown.label,
    avatarUrl: me.data?.profile?.avatar_url ?? null,
    username: me.data?.profile?.username ?? null,
    showPoll: draft.showPoll && mode !== "quote",
    canPost: draft.withinLimits,
    post,
    close,

    typeahead,
    pickSuggestion(suggestion: TypeaheadSuggestion) {
      if (!typeahead.token) return
      draft.replaceRange(
        typeahead.token.start,
        typeahead.token.end,
        suggestion.replacement
      )
    },

    stickerTray: {
      open: stickerTrayOpen,
      onOpenChange: setStickerTrayOpen,
      onPickSticker: draft.showSticker ? draft.selectSticker : undefined,
      onPickGif: draft.showGif ? draft.selectGif : undefined,
      onCreateSticker: draft.showSticker
        ? () => {
            setStickerTrayOpen(false)
            stickerCreator.begin()
          }
        : undefined,
    },
    openStickerTray: () => setStickerTrayOpen(true),
    stickerCreator,

    drafts,
    draftsSheet: {
      open: draftsOpen,
      onOpenChange: setDraftsOpen,
      drafts,
      onPick: (stored: StoredDraft) => {
        setDraftsOpen(false)
        submitted.current = true
        router.replace(composePath({ draftId: stored.id }))
      },
      onDelete: (stored: StoredDraft) =>
        confirm({
          title: "Delete this draft?",
          message: "It goes for good. Nothing you already posted changes.",
          actions: [
            {
              label: "Delete",
              destructive: true,
              onPress: () => void removeStoredDraft(stored.id),
            },
          ],
        }),
    },
    openDrafts: () => setDraftsOpen(true),
  }
}
