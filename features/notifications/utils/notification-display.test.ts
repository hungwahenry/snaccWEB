import { describe, expect, it } from "vitest"
import type { Notification } from "../types"
import { notificationAction } from "./notification-display"

const to = (kind: string, ref: string | null = "x1") =>
  ({ target: { kind, ref } }) as unknown as Notification

const route = (href: string) => ({ kind: "route", href })

describe("notificationAction", () => {
  it("opens the thing the notification is about", () => {
    expect(notificationAction(to("conversation"))).toEqual(
      route("/messages/x1")
    )
    expect(notificationAction(to("chat"))).toEqual(route("/chat/x1"))
    expect(notificationAction(to("moment"))).toEqual(route("/moments/x1"))
    expect(notificationAction(to("wallet"))).toEqual(route("/wallet"))
    expect(notificationAction(to("score"))).toEqual(route("/score"))
  })

  it("opens an announcement in place rather than going anywhere", () => {
    expect(notificationAction(to("announcement"))).toEqual({
      kind: "announcement",
      id: "x1",
    })
  })

  it("does nothing without a ref, or for the list itself", () => {
    expect(notificationAction(to("chat", null))).toBeNull()
    expect(notificationAction(to("announcement", null))).toBeNull()
    expect(notificationAction(to("notifications"))).toBeNull()
    expect(
      notificationAction({ target: null } as unknown as Notification)
    ).toBeNull()
  })
})
