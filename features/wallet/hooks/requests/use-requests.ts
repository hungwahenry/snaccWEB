"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listRequests } from "../../api"
import { REQUESTS_KEY } from "../../utils/keys"

export function useRequests(box: "incoming" | "outgoing") {
  return useInfiniteList([...REQUESTS_KEY, box], (page) =>
    listRequests(box, page)
  )
}
