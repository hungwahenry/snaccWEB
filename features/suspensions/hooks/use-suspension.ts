"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { resetMe } from "@/features/auth/cache"
import { getSuspension } from "../api"
import { HOME_PATH } from "@/features/feed/routes"

const SUSPENSION_KEY = ["me", "suspension"]

export function useSuspension() {
  const router = useRouter()
  const query = useQuery({
    queryKey: SUSPENSION_KEY,
    queryFn: getSuspension,
    staleTime: 0,
  })

  const lapsed = query.isSuccess && query.data === null
  useEffect(() => {
    if (!lapsed) return
    void resetMe()
    router.replace(HOME_PATH)
  }, [lapsed, router])

  return query
}
