"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import type { Gif } from "@/features/giphy/types"
import { pickImages } from "@/lib/media"
import type { SnaccVoiceNote } from "../../types"
import { draftImageKey, type DraftImage } from "../../utils/draft-images"
import { usePollDraft } from "./use-poll-draft"

const COUNTER_APPEARS_AT = 80

export {
  pollMinutes,
  type PollDraft,
  type PollOptionDraft,
} from "./use-poll-draft"

export interface DraftSeed {
  body: string
  images: DraftImage[]
  gif: Gif | null
  spoiler: boolean
  storedVoice?: SnaccVoiceNote | null
}

export const EMPTY_DRAFT: DraftSeed = {
  body: "",
  images: [],
  gif: null,
  spoiler: false,
}

export function useSnaccDraft(seed: DraftSeed) {
  const bodyMax = useConfigValue("content.snacc.body_max_length")
  const maxImages = useConfigValue("content.snacc.max_images")
  const showGif = useFlag("snacc_gifs")

  const [body, setBody] = useState(seed.body)
  const [cursor, setCursor] = useState(seed.body.length)
  const [images, setImages] = useState<DraftImage[]>(seed.images)
  const [gif, setGif] = useState<Gif | null>(seed.gif)
  const [spoiler, setSpoiler] = useState(seed.spoiler)
  const pollDraft = usePollDraft()
  const { poll, pollValid } = pollDraft

  const trimmed = body.trim()
  const remaining = bodyMax - trimmed.length
  const hasMedia = images.length > 0 || gif !== null
  const storedVoice = seed.storedVoice ?? null

  function replaceRange(start: number, end: number, text: string) {
    setBody(`${body.slice(0, start)}${text}${body.slice(end)}`)
    setCursor(start + text.length)
  }

  async function addImages() {
    try {
      const picked = await pickImages(maxImages - images.length)
      if (picked.length === 0) return
      setImages((current) =>
        [
          ...current,
          ...picked.map((asset) => ({ kind: "picked", asset }) as DraftImage),
        ].slice(0, maxImages)
      )
    } catch {
      toast.error("Could not read those images.")
    }
  }

  return {
    body,
    setBody,
    trimmed,
    cursor,
    setCursor,
    replaceRange,

    images,
    gif,
    hasMedia,
    ...pollDraft,
    showPoll: pollDraft.pollsEnabled,
    canStartPoll: !hasMedia && storedVoice === null,
    spoiler,
    toggleSpoiler: () => setSpoiler((current) => !current),
    addImages: () => void addImages(),
    removeImage: (key: string) =>
      setImages((current) =>
        current.filter((image) => draftImageKey(image) !== key)
      ),
    selectGif: (next: Gif) => setGif(next),
    removeGif: () => setGif(null),

    remaining,
    showCounter: remaining <= COUNTER_APPEARS_AT,
    storedVoice,
    withinLimits:
      remaining >= 0 &&
      (poll !== null
        ? trimmed.length > 0 && pollValid
        : hasMedia || trimmed.length > 0 || storedVoice !== null),
    canAddImages: poll === null && gif === null && images.length < maxImages,
    canAddGif: poll === null && images.length === 0,
    showGif,
  }
}
