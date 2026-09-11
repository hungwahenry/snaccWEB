"use client"

import { useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import { showErrorMessage } from "@/lib/feedback"
import { pickImages } from "@/lib/media"
import type { PollDraft, PollDurationPart } from "../../types"
import {
  durationChoices,
  FRESH_POLL,
  pollIsValid,
  pollProblem,
  withAddedOption,
  withOption,
  withoutOption,
} from "../../utils/polls"

export function usePollDraft(seed: PollDraft | null = null) {
  const pollsEnabled = useFlag("polls")
  const maxOptions = useConfigValue("content.poll.max_options")
  const optionMaxLength = useConfigValue("content.poll.option_max_length")
  const minMinutes = useConfigValue("content.poll.min_minutes")
  const maxMinutes = useConfigValue("content.poll.max_minutes")
  const limits = { optionMaxLength, minMinutes, maxMinutes }

  const [poll, setPoll] = useState<PollDraft | null>(seed)

  const change = (next: (current: PollDraft) => PollDraft) =>
    setPoll((current) => (current ? next(current) : current))

  async function pickPollOptionImage(index: number) {
    try {
      const [image] = await pickImages(1)
      if (image) change((current) => withOption(current, index, { image }))
    } catch {
      showErrorMessage("Could not read that image.")
    }
  }

  return {
    pollsEnabled,
    poll,
    pollValid: poll !== null && pollIsValid(poll, limits),
    pollProblem: poll ? pollProblem(poll, limits) : null,
    pollOptionMax: optionMaxLength,
    maxPollOptions: maxOptions,
    pollDurations: durationChoices(maxMinutes),
    togglePoll: () => setPoll((current) => (current ? null : FRESH_POLL)),
    setPollOption: (index: number, text: string) =>
      change((current) => withOption(current, index, { text })),
    pickPollOptionImage: (index: number) => void pickPollOptionImage(index),
    removePollOptionImage: (index: number) =>
      change((current) => withOption(current, index, { image: null })),
    addPollOption: () =>
      change((current) => withAddedOption(current, maxOptions)),
    removePollOption: (index: number) =>
      change((current) => withoutOption(current, index)),
    setPollDuration: (part: PollDurationPart, value: number) =>
      change((current) => ({ ...current, [part]: value })),
  }
}
