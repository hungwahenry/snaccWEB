"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { createPrompt, deletePrompt, listPrompts, updatePrompt } from "./api"
import type { UpdatePromptInput } from "./types"

export function usePrompts() {
  return useQuery({ queryKey: ["admin", "onboarding-prompts"], queryFn: listPrompts })
}

export function usePromptMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "onboarding-prompts"] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    create: useMutation({ mutationFn: createPrompt, onSuccess: onSuccess("Prompt created."), onError }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdatePromptInput }) => updatePrompt(id, input),
      onSuccess: onSuccess("Prompt updated."),
      onError,
    }),
    remove: useMutation({
      mutationFn: (id: string) => deletePrompt(id),
      onSuccess: onSuccess("Prompt deleted."),
      onError,
    }),
  }
}
