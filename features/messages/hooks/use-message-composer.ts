"use client"

import { useEffect, useRef, useState } from "react"
import { usePremiumNudge } from "@/features/premium/hooks/use-premium-limit"
import { useVoiceRecorder } from "@/features/voice/hooks/use-voice-recorder"
import type { VoiceDraft } from "@/features/voice/types"
import type { PickedImage } from "@/lib/media"
import type { ComposerContext, VoiceControls } from "../types"
import { COUNTER_WITHIN, editChanged } from "../utils/composer"

type LengthKey = "content.message.body_max_length" | "chat.message_max_length"

export interface MessageComposerInput {
  onSend: (body: string) => void
  sending?: boolean
  /** What the message answers or edits, shown above the field. */
  context?: ComposerContext | null
  onCancelContext?: () => void
  /** The message being edited; its words fill the field until the edit ends. */
  editing?: { body: string | null } | null
  /** Rooms allow longer messages than DMs; each caller names its own limit. */
  lengthKey?: LengthKey
  onType?: () => void
  images?: PickedImage[]
  maxImages?: number
  canSendVoice?: boolean
  onSendVoice?: (voice: VoiceDraft) => void
}

/** The text field of any message composer: its words, its limit, and the voice button. */
export function useMessageComposer({
  onSend,
  sending = false,
  context = null,
  onCancelContext,
  editing = null,
  lengthKey = "content.message.body_max_length",
  onType,
  images = [],
  maxImages = 0,
  canSendVoice = false,
  onSendVoice,
}: MessageComposerInput) {
  const [body, setBody] = useState("")
  // The limit is the account's, not a constant: Premium can raise it, and the server enforces
  // its own number either way.
  const bodyLimit = usePremiumNudge(
    lengthKey,
    (max) => body.length >= max,
    (upgrade) => `${upgrade} characters with Premium`
  )
  const maxLength = bodyLimit.value
  const [slide, setSlide] = useState(0)
  const recorder = useVoiceRecorder()
  const stash = useRef("")
  const wasEditing = useRef(false)
  const trimmed = body.trim()

  useEffect(() => {
    if (editing && !wasEditing.current) {
      setBody((current) => {
        stash.current = current
        return editing.body ?? ""
      })
    } else if (editing) {
      setBody(editing.body ?? "")
    } else if (wasEditing.current) {
      setBody(stash.current)
      stash.current = ""
    }
    wasEditing.current = Boolean(editing)
  }, [editing])

  const hasContent = trimmed.length > 0 || images.length > 0
  const canSend = hasContent && !sending && editChanged(editing, trimmed)

  const voice: VoiceControls | null =
    canSendVoice && onSendVoice
      ? {
          recording: recorder.recording,
          durationMs: recorder.durationMs,
          levels: recorder.levels,
          slide,
          onStart: () => void recorder.start(),
          onSlide: setSlide,
          onFinish: (cancelled) => {
            setSlide(0)
            if (cancelled) {
              void recorder.cancel()
              return
            }
            void recorder.stop().then((draft) => {
              if (draft) onSendVoice(draft)
            })
          },
        }
      : null

  return {
    canAttach: !editing && maxImages > 0 && images.length < maxImages,
    /** Everything the field itself needs, named as MessageComposer takes it. */
    field: {
      body,
      onChange(text: string) {
        setBody(text.slice(0, maxLength))
        if (!editing && text.trim()) onType?.()
      },
      onSend() {
        if (!canSend) return
        onSend(trimmed)
        setBody("")
      },
      canSend,
      sending,
      editing: editing !== null,
      context,
      onCancelContext,
      voice,
      offerVoice: voice !== null && !hasContent && !editing,
      maxLength,
      remaining: maxLength - body.length,
      showCounter: body.length >= maxLength - COUNTER_WITHIN,
      upgrade: { show: bodyLimit.show, label: bodyLimit.label },
    },
  }
}
