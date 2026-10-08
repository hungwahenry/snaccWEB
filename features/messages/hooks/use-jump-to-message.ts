"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, type RefObject } from "react"
import { showNotice } from "@/lib/feedback"
import { conversationPath } from "../routes"
import type { Message } from "../types"

const MAX_PAGES = 30
const HIGHLIGHT_MS = 2000

interface ThreadPages {
  messages: Message[]
  loading: boolean
  loadingMore: boolean
  hasMore?: boolean
  loadMore: () => void
}

export function useJumpToMessage(
  conversationId: string,
  focusId: string | null,
  list: ThreadPages,
  scrollRef: RefObject<HTMLDivElement | null>
) {
  const router = useRouter()
  const search = useRef({ focusId, pages: 0, landed: false })
  const found =
    focusId !== null && list.messages.some((message) => message.id === focusId)
  const { loading, loadingMore, hasMore, loadMore } = list

  useEffect(() => {
    if (!focusId || loading || loadingMore) return
    if (search.current.focusId !== focusId) {
      search.current = { focusId, pages: 0, landed: false }
    }
    if (search.current.landed) return

    if (found) {
      search.current.landed = true
      scrollRef.current
        ?.querySelector(`[data-message-id="${CSS.escape(focusId)}"]`)
        ?.scrollIntoView({ block: "center" })
      return
    }

    if (!hasMore || search.current.pages >= MAX_PAGES) {
      showNotice("That message is too far back to find.")
      router.replace(conversationPath(conversationId), { scroll: false })
      return
    }

    search.current.pages += 1
    loadMore()
  }, [
    focusId,
    found,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    scrollRef,
    router,
    conversationId,
  ])

  const highlightId = found ? focusId : null

  useEffect(() => {
    if (!highlightId) return
    const timer = setTimeout(
      () => router.replace(conversationPath(conversationId), { scroll: false }),
      HIGHLIGHT_MS
    )
    return () => clearTimeout(timer)
  }, [highlightId, router, conversationId])

  return { highlightId, seeking: focusId !== null && !found }
}
