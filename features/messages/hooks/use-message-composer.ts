"use client"

import { useEffect, useRef, useState } from "react"
import { usePremiumNudge } from "@/features/premium/hooks/use-premium-limit"
import {
  useVoiceRecorder,
  type VoiceDraft,
} from "@/features/voice/hooks/use-voice-recorder"
import type { PickedImage } from "@/lib/media"
import type { Message } from "../types"
import { replyPreview, toReplyPreview } from "../utils/preview"

/** How close to the limit the counter appears. */
const COUNTER_WITHIN = 100

export interface ComposerContext {
  label: string
  body: string
  cancel?: () => void
  hint: string
}

export interface MessageComposerInput {
  onSend: (body: string) => void
  sending?: boolean
  replyingTo?: Message | null
  onCancelReply?: () => void
  editing?: Message | null
  onCancelEdit?: () => void
  onType?: () => void
  images?: PickedImage[]
  maxImages?: number
  canSendVoice?: boolean
  onSendVoice?: (voice: VoiceDraft) => void
}

export interface VoiceControls {
  recording: boolean
  durationMs: number
  levels: number[]
  slide: number
  onStart: () => void
  onSlide: (translationX: number) => void
  onFinish: (cancelled: boolean) => void
}

export function useMessageComposer({
  onSend,
  sending,
  replyingTo,
  onCancelReply,
  editing,
  onCancelEdit,
  onType,
  images = [],
  maxImages = 0,
  canSendVoice = false,
  onSendVoice,
}: MessageComposerInput) {
  const [body, setBody] = useState("")
  // The limit is the account's, not a constant: Premium raises it, and the server enforces its
  // own number either way.
  const bodyLimit = usePremiumNudge(
    "content.message.body_max_length",
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

  const canAttach = !editing && maxImages > 0 && images.length < maxImages
  const hasContent = trimmed.length > 0 || images.length > 0
  const voice: VoiceControls | null = canSendVoice
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
            if (draft) onSendVoice?.(draft)
          })
        },
      }
    : null
  const canSend =
    hasContent && !sending && (!editing || trimmed !== editing.body)

  const context: ComposerContext | null = editing
    ? {
        label: "Editing your message",
        body: replyPreview(toReplyPreview(editing)),
        cancel: onCancelEdit,
        hint: "Cancel edit",
      }
    : replyingTo
      ? {
          label: `Replying to ${replyingTo.mine ? "yourself" : "them"}`,
          body: replyPreview(toReplyPreview(replyingTo)),
          cancel: onCancelReply,
          hint: "Cancel reply",
        }
      : null

  return {
    body,
    change(text: string) {
      setBody(text.slice(0, maxLength))
      if (!editing && text.trim()) onType?.()
    },
    send() {
      if (!canSend) return
      onSend(trimmed)
      setBody("")
    },
    canSend,
    sending: Boolean(sending),
    canAttach,
    voice,
    offerVoice: voice !== null && !hasContent && !editing,
    context,
    editing: Boolean(editing),
    remaining: maxLength - body.length,
    showCounter: body.length >= maxLength - COUNTER_WITHIN,
    maxLength,
    upgrade: bodyLimit,
  }
}
