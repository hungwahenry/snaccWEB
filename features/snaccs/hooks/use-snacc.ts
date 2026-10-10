"use client"

import { skipToken, useQuery } from "@tanstack/react-query"
import { getSnacc } from "../api"
import { findSnacc } from "../cache"
import { snaccKeys } from "../utils/keys"

export function useSnacc(id: string | null) {
  return useQuery({
    queryKey: snaccKeys.detail(id),
    queryFn: id === null ? skipToken : () => getSnacc(id),
    placeholderData: () => (id === null ? undefined : findSnacc(id)),
  })
}
