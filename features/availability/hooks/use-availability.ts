"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { resetMe } from "@/features/auth/cache"
import { HOME_PATH } from "@/features/feed/routes"
import { getAvailability } from "../api"

const AVAILABILITY_KEY = ["me", "availability"]

export function useAvailability() {
  const router = useRouter()
  const query = useQuery({
    queryKey: AVAILABILITY_KEY,
    queryFn: getAvailability,
    staleTime: 0,
  })

  const opened = query.isSuccess && query.data.open
  useEffect(() => {
    if (!opened) return
    void resetMe()
    router.replace(HOME_PATH)
  }, [opened, router])

  return query
}
