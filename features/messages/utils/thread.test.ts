import { describe, expect, it } from "vitest"
import type { ThreadMessage } from "../types"
import { decorateThread, deliveryOf } from "./thread"

const at = (minutes: number) =>
  new Date(Date.UTC(2026, 8, 11, 12, minutes)).toISOString()

const message = (
  id: string,
  minutes: number,
  patch: Partial<ThreadMessage & { sender: string }> = {}
) => ({ id, mine: false, created_at: at(minutes), sender: "a", ...patch })

describe("deliveryOf", () => {
  it("says nothing under their message", () => {
    expect(deliveryOf(message("1", 0), null)).toBeNull()
  })

  it("says sent until they read past it", () => {
    const mine = message("1", 5, { mine: true })
    expect(deliveryOf(mine, null)).toBe("sent")
    expect(deliveryOf(mine, at(4))).toBe("sent")
    expect(deliveryOf(mine, at(6))).toBe("seen")
  })

  it("says nothing while it is still going out", () => {
    expect(
      deliveryOf(message("1", 5, { mine: true, status: "sending" }), null)
    ).toBeNull()
  })
})

describe("decorateThread", () => {
  it("returns oldest first, with one run for close messages", () => {
    const items = decorateThread([message("2", 1), message("1", 0)], false)

    expect(items.map((item) => item.message.id)).toEqual(["1", "2"])
    expect(items[0]).toMatchObject({ firstInBurst: true, lastInBurst: false })
    expect(items[1]).toMatchObject({ firstInBurst: false, lastInBurst: true })
    expect(items[0].time).toBeNull()
    expect(items[1].time).not.toBeNull()
  })

  it("puts a day break over the oldest message only when nothing is older", () => {
    expect(decorateThread([message("1", 0)], false)[0].dayBreak).not.toBeNull()
    expect(decorateThread([message("1", 0)], true)[0].dayBreak).toBeNull()
  })

  it("has no delivery line in a room", () => {
    const items = decorateThread([message("1", 0, { mine: true })], false)
    expect(items[0].delivery).toBeNull()
  })

  it("marks the newest of yours in a DM", () => {
    const items = decorateThread([message("1", 0, { mine: true })], false, {
      peerReadAt: null,
    })
    expect(items[0].delivery).toBe("sent")
  })

  it("splits a room's run when the sender changes", () => {
    const items = decorateThread(
      [message("2", 1, { sender: "b" }), message("1", 0)],
      false,
      { sameSide: (a, b) => a.sender === b.sender }
    )
    expect(items.every((item) => item.firstInBurst && item.lastInBurst)).toBe(
      true
    )
  })
})
