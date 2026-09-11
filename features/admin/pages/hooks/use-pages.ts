"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  createPage,
  deletePage,
  getPage,
  listPages,
  setPageStatus,
  updatePage,
} from "../api"
import type { CreatePageInput, PageStatus, UpdatePageInput } from "../types"
import { adminPageKeys } from "../utils/keys"

export function usePages() {
  return useQuery({ queryKey: adminPageKeys.list(), queryFn: listPages })
}

export function usePage(id: string) {
  return useQuery({
    queryKey: adminPageKeys.detail(id),
    queryFn: () => getPage(id),
  })
}

export function usePageActions(onCreated?: () => void) {
  const touched = (_page: unknown, { id }: { id: string }) => [
    adminPageKeys.list(),
    adminPageKeys.detail(id),
  ]

  const { run: create } = useAdminMutation({
    mutationFn: (input: CreatePageInput) => createPage(input),
    success: "Page created.",
    invalidates: [adminPageKeys.list()],
    onSuccess: onCreated,
  })
  const { run: update } = useAdminMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePageInput }) =>
      updatePage(id, input),
    success: "Page saved.",
    invalidates: touched,
  })
  const { run: setStatus } = useAdminMutation({
    mutationFn: ({ id, status }: { id: string; status: PageStatus }) =>
      setPageStatus(id, status),
    success: "Page status updated.",
    invalidates: touched,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (id: string) => deletePage(id),
    success: "Page deleted.",
    invalidates: [adminPageKeys.list()],
  })

  return useMemo(
    () => ({
      create,
      update: (id: string, input: UpdatePageInput) => update({ id, input }),
      setStatus: (id: string, status: PageStatus) => setStatus({ id, status }),
      remove,
    }),
    [create, update, setStatus, remove]
  )
}
