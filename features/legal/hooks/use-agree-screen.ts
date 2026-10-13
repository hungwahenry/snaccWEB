"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { authKeys } from "@/features/auth/utils/keys"
import { HOME_PATH } from "@/features/feed/routes"
import { getErrorMessage } from "@/lib/api/errors"
import { acceptDocuments, getPendingDocuments } from "../api"

const PENDING_KEY = ["legal", "pending"]

export function useAgreeScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const logout = useLogout()
  const pending = useQuery({
    queryKey: PENDING_KEY,
    queryFn: getPendingDocuments,
    staleTime: 0,
  })
  const documents = pending.data?.documents ?? []

  const nothingLeft = pending.isSuccess && documents.length === 0
  useEffect(() => {
    if (!nothingLeft) return
    void queryClient.invalidateQueries({ queryKey: authKeys.me() })
    router.replace(HOME_PATH)
  }, [nothingLeft, queryClient, router])

  const accept = useMutation({
    mutationFn: () => acceptDocuments(documents.map((doc) => doc.id)),
    onSettled: () => void pending.refetch(),
  })

  return {
    loading: pending.isPending,
    failed: pending.isError,
    retry: () => void pending.refetch(),
    country: pending.data?.country_code ?? null,
    documents,
    agreeing: accept.isPending,
    agree: () => accept.mutate(),
    error: accept.isError ? getErrorMessage(accept.error) : null,
    signingOut: logout.isPending,
    signOut: () => logout.mutate(),
  }
}
