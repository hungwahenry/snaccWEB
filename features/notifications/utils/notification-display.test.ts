import { describe, expect, it } from "vitest"
import type { Notification } from "../types"
import { notificationRoute } from "./notification-display"

const to = (kind: string, ref: string | null = "x1") =>
  ({ target: { kind, ref } }) as unknown as Notification

describe("notificationRoute", () => {
  it("opens the thing the notification is about", () => {
    expect(notificationRoute(to("conversation"))).toBe("/messages/x1")
    expect(notificationRoute(to("chat"))).toBe("/chat/x1")
    expect(notificationRoute(to("moment"))).toBe("/moments/x1")
    expect(notificationRoute(to("wallet"))).toBe("/wallet")
    expect(notificationRoute(to("score"))).toBe("/score")
  })

  it("goes nowhere without a ref, or for the list itself", () => {
    expect(notificationRoute(to("chat", null))).toBeNull()
    expect(notificationRoute(to("notifications"))).toBeNull()
    expect(
      notificationRoute({ target: null } as unknown as Notification)
    ).toBeNull()
  })
})
