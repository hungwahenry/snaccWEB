"use client"

import { useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useGhostWindow } from "@/features/ghost/hooks/use-ghost-window"
import { authorFromUser } from "@/features/users/utils/author"
import { submitSnacc } from "@/features/snaccs/cache/pending-snaccs"
import { DEFAULT_PROMPTS } from "../types"
import { useOnboardingPrompts } from "./use-onboarding-prompts"
import { showErrorMessage } from "@/lib/feedback"

export function useFirstPostComposer(onPosted: () => void) {
  const me = useMe()
  const prompts = useOnboardingPrompts().data ?? DEFAULT_PROMPTS
  const maxLength = useConfigValue("content.snacc.body_max_length")
  const ghost = useGhostWindow()

  const [text, setText] = useState("")
  const [active, setActive] = useState(0)

  const campus = me.data?.profile?.university?.acronym ?? "your campus"
  const placeholder = (
    prompts[active]?.placeholder ?? "What's on your mind?"
  ).replace("{campus}", campus)

  const trimmed = text.trim()
  const canPost = trimmed.length > 0 && trimmed.length <= maxLength

  function submit() {
    if (!canPost) return
    if (!me.data) {
      showErrorMessage("Could not post. Your session is still loading.")
      return
    }

    submitSnacc(
      {
        body: trimmed,
        images: [],
        gif: null,
        sticker: null,
        match: null,
        voice: null,
        spoiler: false,
        anonymous: ghost.active,
      },
      authorFromUser(me.data)
    )
    setText("")
    onPosted()
  }

  return {
    prompts,
    active,
    selectPrompt: setActive,
    text,
    setText,
    placeholder,
    maxLength,
    campus,
    canPost,
    submit,
  }
}
