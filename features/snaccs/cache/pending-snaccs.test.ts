import type { QueryClient, onlineManager } from "@tanstack/react-query"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { ApiError as ApiErrorClass } from "@/lib/api/errors"
import type { Snacc, SnaccAuthor, SnaccDraft } from "../types"
import { snaccKeys } from "../utils/keys"

const store = vi.hoisted(() => new Map<string, unknown>())
const api = vi.hoisted(() => ({ createSnacc: vi.fn() }))

vi.mock("@/lib/idb", () => ({
  idbGet: (key: string) => Promise.resolve(store.get(key)),
  idbSet: (key: string, value: unknown) => {
    store.set(key, structuredClone(value))
    return Promise.resolve()
  },
  idbDelete: (key: string) => {
    store.delete(key)
    return Promise.resolve()
  },
}))
vi.mock("../api", () => api)
vi.mock("@/features/clips/api", () => ({ startClipUpload: vi.fn() }))
vi.mock("@/lib/feedback", () => ({ showError: vi.fn(), showHeld: vi.fn() }))

let client: QueryClient
let online: typeof onlineManager
let ApiError: typeof ApiErrorClass

const FEED = [...snaccKeys.feeds(), "campus"]
const me = { id: "me", username: "me" } as SnaccAuthor
const EMPTY = {
  pages: [{ items: [], total: 0, page: 1, last_page: 1 }],
  pageParams: [1],
}

const draft = (body: string): SnaccDraft => ({
  body,
  images: [],
  gif: null,
  sticker: null,
  match: null,
  voice: null,
  clip: null,
  spoiler: false,
  anonymous: false,
})

const created = (id: string, body: string) =>
  ({
    id,
    body,
    author: me,
    parent_id: null,
    comments_count: 0,
    held: false,
    images: [],
    gif: null,
    clip: null,
  }) as unknown as Snacc

const lands = (body: string) => (input: { id: string }) =>
  Promise.resolve(created(input.id, body))

const feed = (): Snacc[] =>
  client.getQueryData<{ pages: { items: Snacc[] }[] }>(FEED)?.pages[0].items ??
  []

const settled = async () => {
  for (let turn = 0; turn < 10; turn += 1) await Promise.resolve()
}

const outbox = () => (store.get("snacc_outbox") ?? []) as { id: string }[]

let open: typeof import("./pending-snaccs") | null = null

async function closeTab() {
  const disk = new Map(store)
  open?.clearPendingSnaccs()
  await settled()
  store.clear()
  disk.forEach((value, key) => store.set(key, value))
  open = null
}

async function freshTab() {
  await closeTab()
  vi.resetModules()
  const loaded = await import("./pending-snaccs")
  open = loaded
  client = (await import("@/lib/query/client")).getQueryClient()
  online = (await import("@tanstack/react-query")).onlineManager
  ApiError = (await import("@/lib/api/errors")).ApiError
  client.setQueryData(FEED, EMPTY)
  return loaded
}

describe("posting from the web", () => {
  beforeEach(() => {
    store.clear()
    api.createSnacc.mockReset()
  })

  it("shows the post at once and swaps in the real one when it lands", async () => {
    const { submitSnacc } = await freshTab()
    api.createSnacc.mockImplementation(lands("hello"))

    submitSnacc(draft("hello"), me)
    expect(feed()[0].status).toBe("sending")

    await settled()
    expect(feed()).toHaveLength(1)
    expect(feed()[0].status).toBeUndefined()
    expect(outbox()).toEqual([])
  })

  it("keeps a post that failed, on screen and on disk, until it is retried", async () => {
    const { submitSnacc, retrySnacc } = await freshTab()
    api.createSnacc.mockRejectedValueOnce(new ApiError(503, "Down"))

    submitSnacc(draft("hello"), me)
    await settled()
    expect(feed()[0].status).toBe("failed")
    expect(outbox()).toHaveLength(1)

    api.createSnacc.mockImplementation(lands("hello"))
    retrySnacc(feed()[0].id)
    await settled()
    expect(feed()[0].status).toBeUndefined()
    expect(outbox()).toEqual([])
  })

  it("picks an unsent post back up after a reload, under the same id", async () => {
    const before = await freshTab()
    api.createSnacc.mockRejectedValueOnce(new TypeError("Failed to fetch"))
    before.submitSnacc(draft("written before the reload"), me)
    await settled()
    const id = outbox()[0].id

    const after = await freshTab()
    api.createSnacc.mockImplementation(lands("written before the reload"))
    await after.resumePendingSnaccs(me)
    await settled()

    expect(api.createSnacc).toHaveBeenLastCalledWith(
      expect.objectContaining({ id })
    )
    expect(feed().map((snacc) => snacc.id)).toEqual([id])
    expect(outbox()).toEqual([])
  })

  it("leaves another account's unsent posts alone", async () => {
    const before = await freshTab()
    api.createSnacc.mockRejectedValueOnce(new ApiError(503, "Down"))
    before.submitSnacc(draft("mine"), me)
    await settled()

    const after = await freshTab()
    await after.resumePendingSnaccs({ id: "someone-else" } as SnaccAuthor)
    await settled()

    expect(api.createSnacc).toHaveBeenCalledTimes(1)
    expect(outbox()).toHaveLength(1)
  })

  it("puts a failed post back after the list is refetched without it", async () => {
    const { submitSnacc } = await freshTab()
    api.createSnacc.mockRejectedValueOnce(new ApiError(503, "Down"))
    submitSnacc(draft("hello"), me)
    await settled()

    await client.fetchQuery({
      queryKey: FEED,
      queryFn: () => EMPTY,
      staleTime: 0,
    })

    expect(feed()).toHaveLength(1)
    expect(feed()[0].status).toBe("failed")
  })

  it("adds the finished post even when its placeholder has gone", async () => {
    const { submitSnacc } = await freshTab()
    let finish = () => undefined as void
    api.createSnacc.mockImplementation(
      (input: { id: string }) =>
        new Promise<Snacc>((resolve) => {
          finish = () => resolve(created(input.id, "hello"))
        })
    )

    submitSnacc(draft("hello"), me)
    await settled()
    client.setQueryData(FEED, EMPTY)
    finish()
    await settled()

    expect(feed()).toHaveLength(1)
    expect(feed()[0].status).toBeUndefined()
  })

  it("never sends the same post twice at once", async () => {
    const { submitSnacc, retrySnacc } = await freshTab()
    api.createSnacc.mockImplementation(() => new Promise(() => undefined))

    submitSnacc(draft("hello"), me)
    await settled()
    retrySnacc(feed()[0].id)
    retrySnacc(feed()[0].id)
    await settled()

    expect(api.createSnacc).toHaveBeenCalledTimes(1)
  })

  it("retries by itself when the connection comes back, but not a refusal", async () => {
    const { submitSnacc } = await freshTab()
    api.createSnacc
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockRejectedValueOnce(new ApiError(422, "Too long"))

    submitSnacc(draft("dropped"), me)
    submitSnacc(draft("refused"), me)
    await settled()
    api.createSnacc.mockImplementation(lands("dropped"))

    online.setOnline(false)
    online.setOnline(true)
    await settled()

    expect(api.createSnacc).toHaveBeenCalledTimes(3)
    expect(feed().filter((snacc) => snacc.status === "failed")).toHaveLength(1)
  })

  it("forgets a discarded post for good", async () => {
    const { submitSnacc, discardSnacc } = await freshTab()
    api.createSnacc.mockRejectedValueOnce(new ApiError(503, "Down"))
    submitSnacc(draft("hello"), me)
    await settled()

    discardSnacc(feed()[0].id)
    await settled()

    expect(feed()).toEqual([])
    expect(outbox()).toEqual([])
  })
})
