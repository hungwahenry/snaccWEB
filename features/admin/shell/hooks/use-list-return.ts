"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useSyncExternalStore } from "react"

const lists = new Map<string, string>()

const subscribe = () => () => {}

export function useRememberLists(pathname: string) {
  const search = useSearchParams().toString()

  useEffect(() => {
    lists.set(pathname, search ? `?${search}` : "")
  }, [pathname, search])
}

export function useListReturn(href: string): string {
  const search = useSyncExternalStore(
    subscribe,
    () => lists.get(href) ?? "",
    () => ""
  )
  return `${href}${search}`
}
