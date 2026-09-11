import type { Gif } from "@/features/giphy/types"
import type { DraftSticker } from "@/features/stickers/types"
import type { VoiceDraft } from "@/features/voice/types"
import type {
  ComposeParams,
  ComposerMode,
  DraftContent,
  DraftImage,
  DraftSeed,
  PollDraft,
} from "../types"
import { pickedAssets } from "./draft-images"
import { toStoredImage, toStoredPoll, toStoredVoice } from "./drafts"

export const COMPOSER_COPY: Record<
  ComposerMode,
  { title: string; placeholder: string }
> = {
  reply: { title: "Reply", placeholder: "Say something about this snacc" },
  quote: { title: "Quote", placeholder: "Add something to this" },
  new: { title: "New snacc", placeholder: "What's happening on campus?" },
}

export const COUNTER_APPEARS_AT = 80

export const EMPTY_DRAFT: DraftSeed = {
  body: "",
  images: [],
  gif: null,
  spoiler: false,
}

export function composerMode(
  params: Pick<ComposeParams, "parentId" | "resnaccOfId">
): ComposerMode {
  if (params.parentId) return "reply"
  return params.resnaccOfId ? "quote" : "new"
}

/** What the composer is holding, in the shape both posting and saving read from. */
export interface ComposerContent {
  body: string
  images: DraftImage[]
  gif: Gif | null
  sticker: DraftSticker | null
  voice: VoiceDraft | null
  poll: PollDraft | null
  spoiler: boolean
}

export function hasContent(content: ComposerContent): boolean {
  return (
    content.body.trim().length > 0 ||
    content.images.length > 0 ||
    content.gif !== null ||
    content.sticker !== null ||
    content.voice !== null ||
    content.poll !== null
  )
}

export function toDraftContent(
  params: Pick<ComposeParams, "parentId" | "resnaccOfId">,
  content: ComposerContent
): DraftContent {
  return {
    parentId: params.parentId,
    resnaccOfId: params.resnaccOfId,
    body: content.body,
    spoiler: content.spoiler,
    images: pickedAssets(content.images).map(toStoredImage),
    voice: content.voice ? toStoredVoice(content.voice) : null,
    gif: content.gif,
    sticker: content.sticker,
    poll: content.poll ? toStoredPoll(content.poll) : null,
  }
}

export interface DraftState {
  bodyLength: number
  bodyMax: number
  images: number
  maxImages: number
  gif: boolean
  sticker: boolean
  voice: boolean
  storedVoice: boolean
  recording: boolean
  poll: boolean
  pollValid: boolean
  pollProblem: string | null
  voiceAllowed: boolean
  stickersAllowed: boolean
}

export interface DraftRules {
  remaining: number
  showCounter: boolean
  hasMedia: boolean
  withinLimits: boolean
  canAddImages: boolean
  canAddGif: boolean
  canAddSticker: boolean
  canRecordVoice: boolean
  canStartPoll: boolean
  /** Why posting is held back, when the form alone doesn't show it. */
  hint: string | null
}

/**
 * What a snacc can hold at once. A poll is the whole attachment; photos exclude a GIF, a sticker
 * and a voice note; a voice note is its own thing.
 */
export function draftRules(state: DraftState): DraftRules {
  const remaining = state.bodyMax - state.bodyLength
  const hasMedia = state.images > 0 || state.gif
  const voiceBusy = state.recording || state.voice || state.storedVoice
  const hasBody = state.bodyLength > 0
  const pollHint = state.poll
    ? (state.pollProblem ??
      (hasBody ? null : "Write your question above the options."))
    : null

  return {
    remaining,
    showCounter: remaining <= COUNTER_APPEARS_AT,
    hasMedia,
    withinLimits:
      remaining >= 0 &&
      !state.recording &&
      (state.poll
        ? hasBody && state.pollValid
        : hasMedia ||
          hasBody ||
          state.sticker ||
          state.voice ||
          state.storedVoice),
    canAddImages:
      !state.poll &&
      !state.gif &&
      !state.sticker &&
      !voiceBusy &&
      state.images < state.maxImages,
    canAddGif: !state.poll && state.images === 0 && !state.recording,
    canAddSticker:
      !state.poll && state.stickersAllowed && state.images === 0 && !voiceBusy,
    canRecordVoice:
      !state.poll &&
      state.voiceAllowed &&
      state.images === 0 &&
      !state.sticker &&
      !voiceBusy,
    canStartPoll: !hasMedia && !state.sticker && !voiceBusy,
    hint: pollHint,
  }
}

/** Cmd+Enter on a Mac, Ctrl+Enter elsewhere. */
export function isSubmitShortcut(event: {
  key: string
  metaKey: boolean
  ctrlKey: boolean
}): boolean {
  return event.key === "Enter" && (event.metaKey || event.ctrlKey)
}
