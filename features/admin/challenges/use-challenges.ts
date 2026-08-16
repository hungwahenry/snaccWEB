"use client"

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  createChallenge,
  deleteChallenge,
  listChallenges,
  updateChallenge,
} from "./api"
import type { AdminChallenge, ListChallengesParams, UpdateChallengeInput } from "./types"

export const DEFAULT_ACCENT = "#10b981"

export function useChallenges(params: ListChallengesParams) {
  return useQuery({
    queryKey: ["admin", "challenges", params],
    queryFn: () => listChallenges(params),
    placeholderData: keepPreviousData,
  })
}

export function useChallengeMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "challenges"] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    create: useMutation({
      mutationFn: createChallenge,
      onSuccess: onSuccess("Challenge created."),
      onError,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateChallengeInput }) =>
        updateChallenge(id, input),
      onSuccess: onSuccess("Challenge updated."),
      onError,
    }),
    remove: useMutation({
      mutationFn: (id: string) => deleteChallenge(id),
      onSuccess: onSuccess("Challenge deleted."),
      onError,
    }),
  }
}

type Mutations = ReturnType<typeof useChallengeMutations>

/** All create/edit form state, validation, and payload shaping — keeps the dialog presentational. */
export function useChallengeForm(
  challenge: AdminChallenge | undefined,
  mutations: Mutations,
  onDone: () => void,
) {
  const editing = Boolean(challenge)
  const daysEditable = !editing || challenge?.status === "draft"

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tag, setTag] = useState("")
  const [rewardNaira, setRewardNaira] = useState("")
  const [accentFrom, setAccentFrom] = useState(DEFAULT_ACCENT)
  const [accentTo, setAccentTo] = useState<string | null>(null)
  const [prompts, setPrompts] = useState<string[]>([""])

  const reset = useCallback(() => {
    setTitle(challenge?.title ?? "")
    setDescription(challenge?.description ?? "")
    setTag(challenge?.tag ?? "")
    setRewardNaira(challenge ? String(challenge.reward_kobo / 100) : "")
    setAccentFrom(challenge?.accent_from ?? DEFAULT_ACCENT)
    setAccentTo(challenge?.accent_to ?? null)
    setPrompts(
      challenge && challenge.day_prompts.length > 0
        ? challenge.day_prompts.map((day) => day.prompt)
        : [""],
    )
  }, [challenge])

  const setAccent = (from: string, to: string | null) => {
    setAccentFrom(from)
    setAccentTo(to)
  }
  const setPromptAt = (index: number, value: string) =>
    setPrompts((prev) => prev.map((prompt, i) => (i === index ? value : prompt)))
  const addPrompt = () => setPrompts((prev) => [...prev, ""])
  const removePrompt = (index: number) => setPrompts((prev) => prev.filter((_, i) => i !== index))

  const promptLines = prompts.map((line) => line.trim()).filter(Boolean)
  const rewardKobo = Math.round(Number(rewardNaira) * 100)
  const valid =
    title.trim() !== "" &&
    rewardKobo > 0 &&
    (editing ? true : tag.trim() !== "") &&
    (daysEditable ? promptLines.length > 0 : true)
  const submitting = mutations.create.isPending || mutations.update.isPending

  function submit() {
    const days = promptLines.map((prompt) => ({ prompt }))
    if (editing && challenge) {
      mutations.update.mutate(
        {
          id: challenge.id,
          input: {
            title: title.trim(),
            description: description.trim() || undefined,
            rewardKobo,
            accentFrom,
            accentTo,
            ...(daysEditable ? { days } : {}),
          },
        },
        { onSuccess: onDone },
      )
    } else {
      mutations.create.mutate(
        {
          title: title.trim(),
          description: description.trim() || undefined,
          tag: tag.trim().replace(/^#/, ""),
          rewardKobo,
          accentFrom,
          accentTo,
          days,
        },
        { onSuccess: onDone },
      )
    }
  }

  return {
    editing,
    daysEditable,
    title,
    setTitle,
    description,
    setDescription,
    tag,
    setTag,
    rewardNaira,
    setRewardNaira,
    accentFrom,
    accentTo,
    setAccent,
    prompts,
    setPromptAt,
    addPrompt,
    removePrompt,
    valid,
    submitting,
    reset,
    submit,
  }
}

export type ChallengeForm = ReturnType<typeof useChallengeForm>
