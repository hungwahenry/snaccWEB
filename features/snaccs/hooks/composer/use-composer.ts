"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { confirm } from "@/components/ui/confirm"
import { useMe } from "@/features/auth/hooks/use-me"
import { HOME_PATH } from "@/features/feed/routes"
import { useMatchDetail } from "@/features/football/hooks/use-match-detail"
import { useGhostCountdown } from "@/features/ghost/hooks/use-ghost-countdown"
import { useBack } from "@/hooks/use-back"
import { showErrorMessage, showSuccess } from "@/lib/feedback"
import { authorFromUser } from "@/features/users/utils/author"
import { submitSnacc } from "../../cache/pending-snaccs"
import { snaccPath } from "../../routes"
import type { ComposeParams, SnaccDraft } from "../../types"
import {
  composerMode,
  EMPTY_DRAFT,
  hasContent,
  toDraftContent,
} from "../../utils/composer"
import { pickedAssets } from "../../utils/draft-images"
import { toDraftSeed } from "../../utils/drafts"
import { toPollPayload } from "../../utils/polls"
import { useDrafts } from "./use-drafts"
import { useSnaccDraft } from "./use-snacc-draft"

/** Writing a new snacc, reply or quote: posting it, keeping it as a draft, or letting it go. */
export function useComposer(params: ComposeParams) {
  const router = useRouter()
  const back = useBack(params.parentId ? snaccPath(params.parentId) : HOME_PATH)
  const me = useMe()
  const ghost = useGhostCountdown()
  const drafts = useDrafts()
  const done = useRef(false)
  const mode = composerMode(params)

  const [seed] = useState(() => {
    const stored = drafts.drafts.find((draft) => draft.id === params.draftId)
    return stored
      ? toDraftSeed(stored)
      : { ...EMPTY_DRAFT, body: params.initialBody ?? "" }
  })
  const draft = useSnaccDraft(seed, { allowVoice: !ghost.active })
  const dirty = hasContent(draft.content)

  // A match is context the composer was opened with, not something it holds and edits. It comes
  // from the match itself rather than today's board, so an old fixture attaches too.
  const [matchDropped, setMatchDropped] = useState(false)
  const matchId = params.matchId && !matchDropped ? params.matchId : undefined
  const match = useMatchDetail(matchId ?? null).data?.match ?? null

  useEffect(() => {
    if (!dirty) return
    const hold = (event: BeforeUnloadEvent) => {
      if (!done.current) event.preventDefault()
    }
    window.addEventListener("beforeunload", hold)
    return () => window.removeEventListener("beforeunload", hold)
  }, [dirty])

  function toSnaccDraft(): SnaccDraft {
    return {
      body: draft.trimmed || null,
      images: pickedAssets(draft.images),
      gif: draft.gif,
      sticker: draft.sticker,
      matchId,
      match,
      voice: draft.voice,
      parentId: params.parentId,
      resnaccOfId: params.resnaccOfId,
      poll:
        draft.poll && draft.pollValid ? toPollPayload(draft.poll) : undefined,
      spoiler: draft.hasMedia && draft.spoiler,
      anonymous: ghost.active,
    }
  }

  function leave() {
    done.current = true
    back()
  }

  function post() {
    if (!draft.withinLimits || done.current) return
    if (!me.data) {
      showErrorMessage(
        "Could not post. Your session is still loading, try again in a moment."
      )
      return
    }
    done.current = true
    submitSnacc(toSnaccDraft(), authorFromUser(me.data))
    if (params.draftId) void drafts.remove(params.draftId)
    if (params.parentId) back()
    else router.replace(HOME_PATH)
  }

  async function saveDraft(): Promise<boolean> {
    try {
      await drafts.save(toDraftContent(params, draft.content), params.draftId)
      showSuccess("Saved to drafts.")
      return true
    } catch {
      showErrorMessage("Could not save the draft.")
      return false
    }
  }

  /** Asks what to do with unsaved work before `then` runs; straight through when there is none. */
  function settleFirst(
    then: () => void,
    copy: { title: string; message: string }
  ) {
    if (!dirty) {
      then()
      return
    }
    confirm({
      ...copy,
      cancelLabel: "Keep editing",
      actions: [
        {
          label: "Save draft",
          onPress: () =>
            void saveDraft().then((saved) => {
              if (saved) then()
            }),
        },
        { label: "Discard", destructive: true, onPress: then },
      ],
    })
  }

  return {
    ...draft,
    mode,
    dirty,
    match,
    removeMatch: () => setMatchDropped(true),
    ghost: ghost.active,
    ghostTimeLeft: ghost.label,
    avatarUrl: me.data?.profile?.avatar_url ?? null,
    username: me.data?.profile?.username ?? null,
    showPoll: draft.showPoll && mode !== "quote",
    canPost: draft.withinLimits,
    post,
    close: () =>
      settleFirst(leave, {
        title: "Keep this snacc?",
        message: "Save it as a draft and pick it up later.",
      }),
    /** Runs `then` once whatever is being written has been saved or let go. */
    beforeSwitching: (then: () => void) =>
      settleFirst(
        () => {
          done.current = true
          then()
        },
        {
          title: "Open this draft?",
          message: "Save what you're writing first, or let it go.",
        }
      ),
  }
}

export type Composer = ReturnType<typeof useComposer>
