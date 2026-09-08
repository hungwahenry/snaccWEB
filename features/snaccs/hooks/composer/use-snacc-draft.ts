"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import type { Gif } from "@/features/giphy/types"
import { useImageEditor } from "@/features/image-editor/hooks/use-image-editor"
import type { DraftSticker } from "@/features/stickers/types"
import {
  useVoiceRecorder,
  type VoiceDraft,
} from "@/features/voice/hooks/use-voice-recorder"
import { fromUrl, pickImages } from "@/lib/media"
import type { SnaccVoiceNote } from "../../types"
import { draftImageKey, type DraftImage } from "../../utils/draft-images"
import { usePollDraft, type PollDraft } from "./use-poll-draft"

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
  sticker?: DraftSticker | null
  voice?: VoiceDraft | null
  poll?: PollDraft | null
  storedVoice?: SnaccVoiceNote | null
}

export const EMPTY_DRAFT: DraftSeed = {
  body: "",
  images: [],
  gif: null,
  spoiler: false,
}

export function useSnaccDraft(
  seed: DraftSeed,
  options: { allowVoice?: boolean } = {}
) {
  const bodyMax = useConfigValue("content.snacc.body_max_length")
  const maxImages = useConfigValue("content.snacc.max_images")
  const showGif = useFlag("snacc_gifs")
  const stickersEnabled = useFlag("snacc_stickers")
  const voiceOn = useFlag("voice_snaccs")

  const [body, setBody] = useState(seed.body)
  const [cursor, setCursor] = useState(seed.body.length)
  const [images, setImages] = useState<DraftImage[]>(seed.images)
  const [gif, setGif] = useState<Gif | null>(seed.gif)
  const [sticker, setSticker] = useState<DraftSticker | null>(
    seed.sticker ?? null
  )
  const [voice, setVoice] = useState<VoiceDraft | null>(seed.voice ?? null)
  const [spoiler, setSpoiler] = useState(seed.spoiler)
  const pollDraft = usePollDraft(seed.poll ?? null)
  const recorder = useVoiceRecorder()
  const editor = useImageEditor()
  const { poll, pollValid } = pollDraft

  const trimmed = body.trim()
  const remaining = bodyMax - trimmed.length
  const hasMedia = images.length > 0 || gif !== null
  const storedVoice = seed.storedVoice ?? null
  const voiceBusy = recorder.recording || voice !== null || storedVoice !== null

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

  async function editImage(key: string) {
    const target = images.find((image) => draftImageKey(image) === key)
    if (!target) return
    try {
      const asset =
        target.kind === "picked"
          ? target.asset
          : await fromUrl(target.url, "snacc.jpg")
      const edited = await editor.edit(asset)
      if (!edited) return
      setImages((current) =>
        current.map((image) =>
          draftImageKey(image) === key
            ? { kind: "picked", asset: edited }
            : image
        )
      )
    } catch {
      toast.error("Could not open that image.")
    }
  }

  async function stopVoice() {
    const take = await recorder.stop()
    if (take) setVoice(take)
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
    sticker,
    hasMedia,
    ...pollDraft,
    showPoll: pollDraft.pollsEnabled,
    canStartPoll: !hasMedia && sticker === null && !voiceBusy,
    spoiler,
    toggleSpoiler: () => setSpoiler((current) => !current),
    addImages: () => void addImages(),
    editImage: (key: string) => void editImage(key),
    imageEditor: editor.sheet,
    removeImage: (key: string) =>
      setImages((current) =>
        current.filter((image) => draftImageKey(image) !== key)
      ),
    selectGif: (next: Gif) => setGif(next),
    removeGif: () => setGif(null),
    selectSticker: (next: DraftSticker) => setSticker(next),
    removeSticker: () => setSticker(null),

    voice,
    recording: recorder.recording,
    recordingMs: recorder.durationMs,
    recordingLevels: recorder.levels,
    startVoice: () => void recorder.start(),
    stopVoice: () => void stopVoice(),
    discardVoice: () => setVoice(null),
    showVoice: voiceOn && options.allowVoice !== false,
    canRecordVoice:
      poll === null &&
      voiceOn &&
      options.allowVoice !== false &&
      images.length === 0 &&
      sticker === null &&
      !voiceBusy,

    remaining,
    showCounter: remaining <= COUNTER_APPEARS_AT,
    storedVoice,
    withinLimits:
      remaining >= 0 &&
      !recorder.recording &&
      (poll !== null
        ? trimmed.length > 0 && pollValid
        : hasMedia ||
          trimmed.length > 0 ||
          sticker !== null ||
          voice !== null ||
          storedVoice !== null),
    canAddImages:
      poll === null &&
      gif === null &&
      sticker === null &&
      !voiceBusy &&
      images.length < maxImages,
    canAddGif: poll === null && images.length === 0 && !recorder.recording,
    canAddSticker:
      poll === null && stickersEnabled && images.length === 0 && !voiceBusy,
    showGif,
    showSticker: stickersEnabled,
    showTray: showGif || stickersEnabled,
  }
}
