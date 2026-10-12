"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { authKeys } from "@/features/auth/utils/keys"
import { HOME_PATH } from "@/features/feed/routes"
import { getAvailability } from "../api"

const AVAILABILITY_KEY = ["me", "availability"]

export function useAvailability() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: AVAILABILITY_KEY,
    queryFn: getAvailability,
    staleTime: 0,
  })

  const opened = query.isSuccess && query.data.open
  useEffect(() => {
    if (!opened) return
    void queryClient.invalidateQueries({ queryKey: authKeys.me() })
    router.replace(HOME_PATH)
  }, [opened, queryClient, router])

  return query
}
