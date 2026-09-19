import { beforeAll, describe, expect, it, vi } from "vitest"
import type { ClipUpload } from "@/features/clips/types"
import type { OutboxEntry, SnaccAuthor, SnaccDraft } from "../types"
import {
  finishedUpload,
  fromStoredOutboxDraft,
  outboxEntry,
  ownedBy,
  retriesOnline,
  toStoredOutboxDraft,
  withClipUpload,
  withEntry,
  withoutEntry,
} from "./outbox"

beforeAll(() => {
  URL.createObjectURL = vi.fn(() => "blob:restored")
})

const upload: ClipUpload = {
  done: () => Promise.resolve("upload-1"),
  watch: () => () => undefined,
  cancel: () => undefined,
}

const image = (name: string) => ({
  file: new Blob(["x"], { type: "image/jpeg" }),
  uri: `blob:${name}`,
  width: 10,
  height: 20,
  mimeType: "image/jpeg",
  fileName: `${name}.jpg`,
})

const draft = (patch: Partial<SnaccDraft> = {}): SnaccDraft => ({
  body: "hello",
  images: [],
  gif: null,
  sticker: null,
  match: null,
  voice: null,
  clip: null,
  spoiler: false,
  anonymous: false,
  ...patch,
})

const author = (id: string) => ({ id, username: id }) as SnaccAuthor
const entry = (id: string, by = "me"): OutboxEntry =>
  outboxEntry(id, author(by), draft())

describe("storing a draft for later", () => {
  it("keeps the files and drops what cannot survive a reload", () => {
    const file = new File(["v"], "clip.mp4", { type: "video/mp4" })
    const stored = toStoredOutboxDraft(
      draft({
        images: [image("a")],
        voice: {
          uri: "blob:voice",
          file: new Blob(["v"]),
          mimeType: "audio/mp4",
          durationMs: 900,
        },
        clip: {
          file,
          posterUrl: "blob:poster",
          durationMs: 5000,
          width: 720,
          height: 1280,
          upload,
        },
        poll: { options: ["a", "b"], images: [image("p")], durationMinutes: 60 },
      })
    )

    expect(stored.images[0]).not.toHaveProperty("uri")
    expect(stored.voice).toEqual(
      expect.objectContaining({ mimeType: "audio/mp4", durationMs: 900 })
    )
    expect(stored.clip).toEqual({
      file,
      durationMs: 5000,
      width: 720,
      height: 1280,
    })
    expect(stored.poll?.images?.[0]).not.toHaveProperty("uri")
  })

  it("rebuilds a draft that can be sent, with fresh links to its files", () => {
    const file = new File(["v"], "clip.mp4", { type: "video/mp4" })
    const uploadOf = vi.fn(() => upload)
    const restored = fromStoredOutboxDraft(
      toStoredOutboxDraft(
        draft({
          images: [image("a")],
          clip: {
            file,
            posterUrl: "blob:poster",
            durationMs: 5000,
            width: 720,
            height: 1280,
            upload,
          },
        })
      ),
      uploadOf
    )

    expect(restored.body).toBe("hello")
    expect(restored.images[0].uri).toBe("blob:restored")
    expect(restored.clip?.posterUrl).toBeNull()
    expect(restored.clip?.upload).toBe(upload)
    expect(uploadOf).toHaveBeenCalledWith(file)
  })

  it("stands in for an upload that already finished", async () => {
    const done = finishedUpload("upload-9")
    const heard: number[] = []
    done.watch((fraction) => heard.push(fraction))

    expect(await done.done()).toBe("upload-9")
    expect(heard).toEqual([1])
  })
})

describe("the outbox list", () => {
  it("replaces an entry saved twice and removes one that is done", () => {
    const entries = withEntry(withEntry([entry("a")], entry("b")), entry("a"))

    expect(entries.map((queued) => queued.id)).toEqual(["b", "a"])
    expect(withoutEntry(entries, "b").map((queued) => queued.id)).toEqual(["a"])
  })

  it("remembers which upload belongs to which post", () => {
    const [first, second] = withClipUpload(
      [entry("a"), entry("b")],
      "b",
      "upload-1"
    )

    expect(first.clipUploadId).toBeUndefined()
    expect(second.clipUploadId).toBe("upload-1")
  })

  it("only hands an account its own unsent posts", () => {
    expect(
      ownedBy([entry("a", "me"), entry("b", "someone-else")], "me").map(
        (queued) => queued.id
      )
    ).toEqual(["a"])
  })
})

describe("retriesOnline", () => {
  it("retries what the network or the server dropped", () => {
    expect(retriesOnline(new TypeError("Failed to fetch"), null)).toBe(true)
    expect(retriesOnline(new Error("x"), 503)).toBe(true)
  })

  it("leaves a refusal for the person to deal with", () => {
    expect(retriesOnline(new Error("x"), 422)).toBe(false)
    expect(retriesOnline(new Error("x"), 403)).toBe(false)
  })
})
