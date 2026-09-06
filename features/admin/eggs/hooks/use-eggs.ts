"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  createEgg,
  deleteEgg,
  listEggs,
  removeEggImage,
  updateEgg,
  uploadEggImage,
} from "../api"
import type { UpdateEggInput } from "../types"

export function useEggs() {
  return useQuery({ queryKey: ["admin", "easter-eggs"], queryFn: listEggs })
}

export function useEggMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "easter-eggs"] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    create: useMutation({
      mutationFn: createEgg,
      onSuccess: onSuccess("Egg hidden."),
      onError,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateEggInput }) =>
        updateEgg(id, input),
      onSuccess: onSuccess("Egg updated."),
      onError,
    }),
    remove: useMutation({
      mutationFn: (id: string) => deleteEgg(id),
      onSuccess: onSuccess("Egg removed."),
      onError,
    }),
    uploadImage: useMutation({
      mutationFn: ({ id, file }: { id: string; file: File }) =>
        uploadEggImage(id, file),
      onSuccess: onSuccess("Artwork saved."),
      onError,
    }),
    removeImage: useMutation({
      mutationFn: (id: string) => removeEggImage(id),
      onSuccess: onSuccess("Artwork removed."),
      onError,
    }),
  }
}
