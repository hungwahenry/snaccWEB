"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import { pickImages, type PickedImage } from "@/lib/media"

export interface PollOptionDraft {
  text: string
  image: PickedImage | null
}

export interface PollDraft {
  options: PollOptionDraft[]
  days: number
  hours: number
  minutes: number
}

const FRESH_OPTION: PollOptionDraft = { text: "", image: null }
const FRESH_POLL: PollDraft = {
  options: [FRESH_OPTION, FRESH_OPTION],
  days: 1,
  hours: 0,
  minutes: 0,
}

export function pollMinutes(poll: PollDraft): number {
  return poll.days * 1440 + poll.hours * 60 + poll.minutes
}

export function usePollDraft(seed: PollDraft | null = null) {
  const pollsEnabled = useFlag("polls")
  const maxPollOptions = useConfigValue("content.poll.max_options")
  const pollOptionMax = useConfigValue("content.poll.option_max_length")
  const pollMinMinutes = useConfigValue("content.poll.min_minutes")
  const pollMaxMinutes = useConfigValue("content.poll.max_minutes")

  const [poll, setPoll] = useState<PollDraft | null>(seed)

  const filled =
    poll?.options.filter((option) => option.text.trim().length > 0) ?? []
  const imageCount = filled.filter((option) => option.image !== null).length
  const labels = filled.map((option) => option.text.trim().toLowerCase())
  const pollDuplicate = new Set(labels).size !== labels.length
  const pollValid =
    poll !== null &&
    filled.length >= 2 &&
    filled.every((option) => option.text.trim().length <= pollOptionMax) &&
    !pollDuplicate &&
    (imageCount === 0 || imageCount === filled.length) &&
    pollMinutes(poll) >= pollMinMinutes &&
    pollMinutes(poll) <= pollMaxMinutes

  const patchOption = (index: number, patch: Partial<PollOptionDraft>) =>
    setPoll((current) =>
      current
        ? {
            ...current,
            options: current.options.map((option, at) =>
              at === index ? { ...option, ...patch } : option
            ),
          }
        : current
    )

  return {
    pollsEnabled,
    poll,
    pollValid,
    pollDuplicate,
    pollOptionMax,
    maxPollOptions,
    togglePoll: () => setPoll((current) => (current ? null : FRESH_POLL)),
    setPollOption: (index: number, text: string) =>
      patchOption(index, { text }),
    async pickPollOptionImage(index: number) {
      try {
        const [image] = await pickImages(1)
        if (image) patchOption(index, { image })
      } catch {
        toast.error("Could not read that image.")
      }
    },
    removePollOptionImage: (index: number) =>
      patchOption(index, { image: null }),
    addPollOption: () =>
      setPoll((current) =>
        current && current.options.length < maxPollOptions
          ? { ...current, options: [...current.options, FRESH_OPTION] }
          : current
      ),
    removePollOption: (index: number) =>
      setPoll((current) =>
        current && current.options.length > 2
          ? {
              ...current,
              options: current.options.filter((_, at) => at !== index),
            }
          : current
      ),
    setPollDuration: (part: "days" | "hours" | "minutes", value: number) =>
      setPoll((current) => (current ? { ...current, [part]: value } : current)),
  }
}
