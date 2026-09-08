"use client"

import { useLayoutEffect, useRef, type RefObject } from "react"

const NEAR_BOTTOM_PX = 120

/// Keeps a chat pane pinned to the newest message: jumps to the bottom on load and when something
/// new arrives while you are already there, and holds your place when older messages load on top.
export function useThreadScroll(
  ref: RefObject<HTMLDivElement | null>,
  edges: {
    newestId: string | undefined
    oldestId: string | undefined
    ready: boolean
  }
) {
  const previous = useRef<{
    newestId?: string
    oldestId?: string
    height: number
    top: number
  }>({ height: 0, top: 0 })
  const settled = useRef(false)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node || !edges.ready) return

    const last = previous.current
    const atBottom = last.height - last.top - node.clientHeight < NEAR_BOTTOM_PX

    if (!settled.current) {
      node.scrollTop = node.scrollHeight
      settled.current = true
    } else if (edges.newestId !== last.newestId && atBottom) {
      node.scrollTop = node.scrollHeight
    } else if (edges.oldestId !== last.oldestId) {
      node.scrollTop += node.scrollHeight - last.height
    }

    previous.current = {
      newestId: edges.newestId,
      oldestId: edges.oldestId,
      height: node.scrollHeight,
      top: node.scrollTop,
    }
  }, [ref, edges.newestId, edges.oldestId, edges.ready])

  return {
    onScroll: () => {
      const node = ref.current
      if (node)
        previous.current = {
          ...previous.current,
          height: node.scrollHeight,
          top: node.scrollTop,
        }
    },
    scrollToBottom: () => {
      const node = ref.current
      if (node) node.scrollTop = node.scrollHeight
    },
  }
}
