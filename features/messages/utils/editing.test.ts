import { describe, expect, it } from "vitest"
import type { Message } from "../types"
import { deletedBySender, withEditedBody } from "./editing"

const message = {
  id: "m1",
  body: "hello",
  removed: false,
  deleted_by_sender: false,
  edited: false,
  mine: true,
  reactions: [{ emoji: "🔥", mine: false }],
  images: [],
  voice: null,
  sticker: null,
  gif: null,
} as unknown as Message

describe("local message changes", () => {
  it("shows an edit as edited straight away", () => {
    expect(withEditedBody(message, "hi")).toMatchObject({
      body: "hi",
      edited: true,
    })
  })

  it("turns a deleted message into the gap everyone sees", () => {
    expect(deletedBySender(message)).toMatchObject({
      removed: true,
      deleted_by_sender: true,
      body: null,
      reactions: [],
    })
  })
})
