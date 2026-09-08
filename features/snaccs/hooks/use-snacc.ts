"use client"

import { useQuery } from "@tanstack/react-query"
import { getSnacc } from "../api"
import { findSnacc } from "../cache"

export function useSnacc(id: string) {
  return useQuery({
    queryKey: ["snaccs", id],
    queryFn: () => getSnacc(id),
    enabled: id.length > 0,
    placeholderData: () => findSnacc(id),
  })
}
