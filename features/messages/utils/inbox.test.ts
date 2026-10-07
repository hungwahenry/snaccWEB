import { describe, expect, it } from "vitest"
import type { ChatRoom } from "@/features/chats/types"
import type { Conversation } from "../types"
import { inboxEntries, pinnedRooms } from "./inbox"

const dm = (id: string, at: string) =>
  ({ id, last_message_at: at }) as Conversation

const room = (id: string, kind: ChatRoom["kind"], at: string | null) =>
  ({ id, kind, active_at: at, last_message_at: at }) as ChatRoom

const keys = (entries: ReturnType<typeof inboxEntries>) =>
  entries.map((entry) => entry.key)

describe("the inbox", () => {
  const rooms = [
    room("campus", "campus", "2026-10-07T12:00:00.000Z"),
    room("global", "global", "2026-10-07T12:30:00.000Z"),
    room("derby", "hangout", "2026-10-07T11:00:00.000Z"),
    room("picnic", "hangout", "2026-10-05T09:00:00.000Z"),
  ]

  it("pins the campus and global rooms, in the order they came", () => {
    expect(pinnedRooms(rooms).map((each) => each.id)).toEqual([
      "campus",
      "global",
    ])
  })

  it("puts hangout chats among the DMs by when they were last active", () => {
    const conversations = [
      dm("ada", "2026-10-07T11:30:00.000Z"),
      dm("bola", "2026-10-06T08:00:00.000Z"),
      dm("chi", "2026-10-04T08:00:00.000Z"),
    ]

    expect(keys(inboxEntries(conversations, rooms, true))).toEqual([
      "dm:ada",
      "room:derby",
      "dm:bola",
      "room:picnic",
      "dm:chi",
    ])
  })

  it("holds back a chat older than every DM loaded so far until the last page is in", () => {
    const conversations = [dm("ada", "2026-10-07T11:30:00.000Z")]

    expect(keys(inboxEntries(conversations, rooms, false))).toEqual(["dm:ada"])
    expect(keys(inboxEntries(conversations, rooms, true))).toEqual([
      "dm:ada",
      "room:derby",
      "room:picnic",
    ])
  })

  it("lists hangout chats alone when there are no DMs", () => {
    expect(keys(inboxEntries([], rooms, true))).toEqual([
      "room:derby",
      "room:picnic",
    ])
  })

  it("puts a chat with no activity yet at the very end", () => {
    const quiet = [room("silent", "hangout", null)]

    expect(
      keys(inboxEntries([dm("ada", "2026-10-07T11:30:00.000Z")], quiet, true))
    ).toEqual(["dm:ada", "room:silent"])
  })
})
