"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { openExternal } from "@/lib/links"
import { siteLink } from "../utils/site-link"

export function useOpenSiteLink() {
  const router = useRouter()

  return useCallback(
    (url: string) => {
      const link = siteLink(url)
      if (link?.kind === "app") router.push(link.path)
      else if (link?.kind === "web") openExternal(link.url)
    },
    [router]
  )
}
