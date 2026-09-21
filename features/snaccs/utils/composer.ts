import type { ClipDraft } from "@/features/clips/types"
import type { Gif } from "@/features/giphy/types"
import type { HangoutDraft } from "@/features/hangouts/types"
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

export const HANGOUT_COPY = {
  title: "New hangout",
  placeholder: "Add a note, if you like",
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
  clip: ClipDraft | null
  poll: PollDraft | null
  hangout: HangoutDraft | null
  spoiler: boolean
}

export function hasContent(content: ComposerContent): boolean {
  return (
    content.body.trim().length > 0 ||
    content.images.length > 0 ||
    content.gif !== null ||
    content.sticker !== null ||
    content.voice !== null ||
    content.clip !== null ||
    content.poll !== null ||
    content.hangout !== null
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
    hangout: content.hangout,
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
  hangout: boolean
  hangoutValid: boolean
  carriesHangout: boolean
  voiceAllowed: boolean
  stickersAllowed: boolean
  clip: boolean
  clipsAllowed: boolean
  tagProblem: string | null
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
  canStartHangout: boolean
  canAddClip: boolean
  hint: string | null
  tagProblem: string | null
}

export function draftRules(state: DraftState): DraftRules {
  const remaining = state.bodyMax - state.bodyLength
  const hasMedia = state.images > 0 || state.gif || state.clip
  const voiceBusy = state.recording || state.voice || state.storedVoice
  const hasBody = state.bodyLength > 0
  const hangoutBound = state.hangout || state.carriesHangout
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
      state.tagProblem === null &&
      (state.poll
        ? hasBody && state.pollValid
        : state.hangout
          ? state.hangoutValid
          : state.carriesHangout ||
            hasMedia ||
            hasBody ||
            state.sticker ||
            state.voice ||
            state.storedVoice),
    canAddImages:
      !state.poll &&
      !state.gif &&
      !state.sticker &&
      !state.clip &&
      !voiceBusy &&
      state.images < state.maxImages,
    canAddGif:
      !state.poll &&
      !hangoutBound &&
      state.images === 0 &&
      !state.clip &&
      !state.recording,
    canAddSticker:
      !state.poll &&
      !hangoutBound &&
      state.stickersAllowed &&
      state.images === 0 &&
      !state.clip &&
      !voiceBusy,
    canRecordVoice:
      !state.poll &&
      !hangoutBound &&
      state.voiceAllowed &&
      state.images === 0 &&
      !state.sticker &&
      !state.clip &&
      !voiceBusy,
    canStartPoll: !hasMedia && !state.sticker && !voiceBusy && !hangoutBound,
    canStartHangout:
      !state.poll && !state.gif && !state.sticker && !state.clip && !voiceBusy,
    canAddClip:
      state.clipsAllowed &&
      !hangoutBound &&
      !state.clip &&
      !state.poll &&
      state.images === 0 &&
      !state.gif &&
      !state.sticker &&
      !voiceBusy,
    hint: pollHint,
    tagProblem: state.tagProblem,
  }
}

export function isSubmitShortcut(event: {
  key: string
  metaKey: boolean
  ctrlKey: boolean
}): boolean {
  return event.key === "Enter" && (event.metaKey || event.ctrlKey)
}
