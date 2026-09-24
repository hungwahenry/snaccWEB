"use client"

import { useState } from "react"
import { useDraftClip } from "@/features/clips/hooks/use-draft-clip"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import type { Gif } from "@/features/giphy/types"
import { usePremiumNudge } from "@/features/premium/hooks/use-premium-limit"
import { useHangoutDraft } from "@/features/hangouts/hooks/hosting/use-hangout-draft"
import type { DraftSticker } from "@/features/stickers/types"
import type { DraftSeed } from "../../types"
import { draftRules, type ComposerContent } from "../../utils/composer"
import { tagLimitProblem } from "../../utils/entities"
import { useDraftImages } from "./use-draft-images"
import { useDraftVoice } from "./use-draft-voice"
import { usePollDraft } from "./use-poll-draft"

export function useSnaccDraft(
  seed: DraftSeed,
  options: { allowVoice?: boolean; allowClip?: boolean } = {}
) {
  const gifsEnabled = useFlag("snacc_gifs")
  const stickersEnabled = useFlag("snacc_stickers")
  const voiceEnabled = useFlag("voice_snaccs")
  const clipsEnabled = useFlag("snacc_clips")
  const maxMentions = useConfigValue("content.snacc.max_mentions")
  const maxHashtags = useConfigValue("content.snacc.max_hashtags")
  const maxCashtags = useConfigValue("content.snacc.max_cashtags")

  const [body, setBody] = useState(seed.body)
  const [cursor, setCursor] = useState(seed.body.length)
  const [gif, setGif] = useState<Gif | null>(seed.gif)
  const [sticker, setSticker] = useState<DraftSticker | null>(
    seed.sticker ?? null
  )
  const [spoiler, setSpoiler] = useState(seed.spoiler)
  const images = useDraftImages(seed.images)
  const voice = useDraftVoice(seed.voice ?? null)
  const poll = usePollDraft(seed.poll ?? null)
  const hangoutDraft = useHangoutDraft(seed.hangout ?? null)
  const clipDraft = useDraftClip()
  const storedVoice = seed.storedVoice ?? null
  const voiceAllowed = voiceEnabled && options.allowVoice !== false
  const clipsAllowed = clipsEnabled && options.allowClip !== false

  const trimmed = body.trim()
  const bodyLimit = usePremiumNudge(
    "content.snacc.body_max_length",
    (max) => trimmed.length >= max,
    (upgrade) => `${upgrade} characters with Premium`
  )

  const rules = draftRules({
    bodyLength: trimmed.length,
    bodyMax: bodyLimit.value,
    images: images.images.length,
    maxImages: images.maxImages,
    gif: gif !== null,
    sticker: sticker !== null,
    voice: voice.voice !== null,
    storedVoice: storedVoice !== null,
    recording: voice.recording,
    poll: poll.poll !== null,
    pollValid: poll.pollValid,
    pollProblem: poll.pollProblem,
    hangout: hangoutDraft.hangout !== null,
    hangoutValid: hangoutDraft.hangoutValid,
    carriesHangout: seed.carriesHangout ?? false,
    voiceAllowed,
    stickersAllowed: stickersEnabled,
    clip: clipDraft.clip !== null,
    clipsAllowed,
    tagProblem: tagLimitProblem(trimmed, {
      maxMentions,
      maxHashtags,
      maxCashtags,
    }),
  })

  const content: ComposerContent = {
    body,
    images: images.images,
    gif,
    sticker,
    voice: voice.voice,
    clip: clipDraft.clip,
    poll: poll.poll,
    hangout: hangoutDraft.hangout,
    spoiler,
  }

  function replaceRange(start: number, end: number, text: string) {
    setBody(
      (current) => `${current.slice(0, start)}${text}${current.slice(end)}`
    )
    setCursor(start + text.length)
  }

  return {
    ...images,
    ...voice,
    ...poll,
    ...hangoutDraft,
    ...clipDraft,
    ...rules,
    content,
    body,
    setBody,
    trimmed,
    cursor,
    setCursor,
    replaceRange,
    gif,
    sticker,
    spoiler,
    storedVoice,
    upgrade: bodyLimit,
    showVoice: voiceAllowed,
    showClip: clipsAllowed,
    showGif: gifsEnabled,
    showSticker: stickersEnabled,
    showTray: gifsEnabled || stickersEnabled,
    toggleSpoiler: () => setSpoiler((current) => !current),
    selectGif: (next: Gif) => {
      setSticker(null)
      setGif(next)
    },
    removeGif: () => setGif(null),
    selectSticker: (next: DraftSticker) => {
      setGif(null)
      setSticker(next)
    },
    removeSticker: () => setSticker(null),
  }
}

export type SnaccDraftState = ReturnType<typeof useSnaccDraft>
