"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ME_KEY } from "@/lib/query-keys"
import { getSuspension } from "../api"

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
    void queryClient.invalidateQueries({ queryKey: ME_KEY })
    router.replace("/home")
  }, [lapsed, queryClient, router])

  return query
}
