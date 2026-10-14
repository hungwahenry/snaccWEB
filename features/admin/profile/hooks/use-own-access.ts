"use client"

import { useQuery } from "@tanstack/react-query"
import { getOwnAccess } from "../api"
import { adminProfileKeys } from "../utils/keys"

export function useOwnAccess() {
  return useQuery({
    queryKey: adminProfileKeys.access(),
    queryFn: getOwnAccess,
  })
}
