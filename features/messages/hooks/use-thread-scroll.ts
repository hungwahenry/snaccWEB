"use client"

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react"

const NEAR_BOTTOM_PX = 120

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

  useEffect(() => {
    const node = ref.current
    const content = node?.firstElementChild
    if (!node || !content) return

    const observer = new ResizeObserver(() => {
      const last = previous.current
      const wasAtBottom =
        last.height - last.top - node.clientHeight < NEAR_BOTTOM_PX
      if (settled.current && wasAtBottom && node.scrollHeight > last.height) {
        node.scrollTop = node.scrollHeight
      }
      previous.current = {
        ...previous.current,
        height: node.scrollHeight,
        top: node.scrollTop,
      }
    })
    observer.observe(content)

    return () => observer.disconnect()
  }, [ref, edges.ready])

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
