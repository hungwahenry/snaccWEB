import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { realtimeRooms } from "@/providers/realtime-rooms"
import { useFeedScreen } from "./use-feed-screen"

const flags: Record<string, boolean> = {}
const joined: (string | null | undefined)[] = []
let emit: ((payload: unknown) => void) | null = null
const refresh = vi.fn()
const signal = vi.fn()

vi.mock("@/features/config/hooks/use-flag", () => ({
  useFlag: (key: string) => flags[key] ?? false,
}))
vi.mock("@/features/auth/hooks/use-me", () => ({
  useMe: () => ({ data: { profile: { university: { slug: "unilag" } } } }),
}))
vi.mock("@/features/signals/utils/queue", () => ({
  signal: (...args: unknown[]) => signal(...args),
}))
vi.mock("@/hooks/use-realtime-room", () => ({
  useRealtimeRoom: (room: string | null | undefined) => joined.push(room),
}))
vi.mock("@/hooks/use-realtime-event", () => ({
  useRealtimeEvent: (_: string, handler: (payload: unknown) => void) => {
    emit = handler
  },
}))
vi.mock("./use-feed", () => ({
  useFeed: (scope: string, sort: string) => ({
    scope,
    sort,
    snaccs: [],
    loading: false,
    stale: false,
    failed: false,
    loadingMore: false,
    retry: vi.fn(),
    loadMore: vi.fn(),
    refresh,
  }),
}))
vi.mock("./use-feed-sort", async () => {
  const { useState } = await import("react")
  return {
    useFeedSort: () => useState<"top" | "latest">("latest"),
  }
})

describe("useFeedScreen", () => {
  beforeEach(() => {
    for (const key of Object.keys(flags)) delete flags[key]
    joined.length = 0
    emit = null
    refresh.mockClear()
    signal.mockClear()
    window.scrollTo = vi.fn()
  })

  it("falls back to campus when the picked feed is switched off", () => {
    flags.feed_global = true
    const { result, rerender } = renderHook(() => useFeedScreen())

    act(() => result.current.tabs.onChange("global"))
    expect(result.current.tabs.value).toBe("global")

    flags.feed_global = false
    rerender()
    expect(result.current.tabs.value).toBe("campus")
    expect(result.current.tabs.tabs.map((tab) => tab.value)).toEqual(["campus"])
    expect(result.current.tabs.show).toBe(false)
  })

  it("orders by newest when ranking is off and hides the sort menu", () => {
    const { result } = renderHook(() => useFeedScreen())
    expect(result.current.sortMenu.value).toBe("latest")
    expect(result.current.tabs.onReselect).toBeUndefined()
    expect(result.current.list.feed).toMatchObject({ sort: "latest" })
  })

  it("collects new posters and clears them when you look", () => {
    const { result } = renderHook(() => useFeedScreen())
    expect(joined.at(-1)).toBe(realtimeRooms.feedCampus("unilag"))
    expect(result.current.newPill).toBeNull()

    act(() => emit?.({ actor_id: "a", avatar_url: null }))
    act(() => emit?.({ anonymous: true }))
    expect(result.current.newPill?.posters.map((p) => p.key)).toEqual([
      "a",
      "ghost",
    ])

    act(() => result.current.newPill?.onPress())
    expect(result.current.newPill).toBeNull()
    expect(refresh).toHaveBeenCalledOnce()
    expect(window.scrollTo).toHaveBeenCalled()
  })

  it("ignores posts on the following feed and forgets new ones on a switch", () => {
    flags.feed_following = true
    const { result } = renderHook(() => useFeedScreen())

    act(() => emit?.({ actor_id: "a" }))
    expect(result.current.newPill).not.toBeNull()

    act(() => result.current.tabs.onChange("following"))
    expect(result.current.newPill).toBeNull()
    expect(joined.at(-1)).toBeNull()
    expect(signal).toHaveBeenCalledWith("feed_scope", { detail: "following" })

    act(() => emit?.({ actor_id: "b" }))
    expect(result.current.newPill).toBeNull()
    expect(result.current.list.empty.title).toBe("You follow nobody yet")
    expect(result.current.list.findPeople).toBe(true)
  })

  it("does nothing when you pick the feed you are on", () => {
    const { result } = renderHook(() => useFeedScreen())
    act(() => result.current.tabs.onChange("campus"))
    expect(signal).not.toHaveBeenCalled()
  })
})
