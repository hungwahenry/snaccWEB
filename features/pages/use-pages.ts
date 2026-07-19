"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  createPage,
  deletePage,
  getPage,
  listPages,
  setPageStatus,
  updatePage,
} from "./api"
import type { PageStatus, UpdatePageInput } from "./types"

export function usePages() {
  return useQuery({ queryKey: ["admin", "pages"], queryFn: listPages })
}

export function usePage(id: string) {
  return useQuery({ queryKey: ["admin", "page", id], queryFn: () => getPage(id), enabled: !!id })
}

export function usePageMutations(id?: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin", "pages"] })
    if (id) queryClient.invalidateQueries({ queryKey: ["admin", "page", id] })
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    create: useMutation({
      mutationFn: createPage,
      onSuccess: () => {
        invalidate()
        toast.success("Page created.")
        router.replace("/pages")
      },
      onError,
    }),
    update: useMutation({
      mutationFn: (input: UpdatePageInput) => updatePage(id!, input),
      onSuccess: () => {
        invalidate()
        toast.success("Page saved.")
      },
      onError,
    }),
    setStatus: useMutation({
      mutationFn: ({ pageId, status }: { pageId: string; status: PageStatus }) =>
        setPageStatus(pageId, status),
      onSuccess: () => {
        invalidate()
        toast.success("Page status updated.")
      },
      onError,
    }),
    remove: useMutation({
      mutationFn: (pageId: string) => deletePage(pageId),
      onSuccess: () => {
        invalidate()
        toast.success("Page deleted.")
      },
      onError,
    }),
  }
}
