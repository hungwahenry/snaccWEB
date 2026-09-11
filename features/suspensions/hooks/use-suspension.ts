"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { authKeys } from "@/features/auth/utils/keys"
import { getSuspension } from "../api"
import { HOME_PATH } from "@/features/feed/routes"

const SUSPENSION_KEY = ["me", "suspension"]

export function useSuspension() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: SUSPENSION_KEY,
    queryFn: getSuspension,
    staleTime: 0,
  })

  const lapsed = query.isSuccess && query.data === null
  useEffect(() => {
    if (!lapsed) return
    void queryClient.invalidateQueries({ queryKey: authKeys.me() })
    router.replace(HOME_PATH)
  }, [lapsed, queryClient, router])

  return query
}
