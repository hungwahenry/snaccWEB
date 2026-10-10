import { describe, expect, it } from "vitest"
import type { MentionEntity } from "@/features/users/types"
import { mentionedPeople } from "./mentions"

const mention = (
  id: string,
  username: string | null,
  start: number
): MentionEntity => ({
  type: "mention",
  start,
  length: 4,
  user: { id, username, display_name: null, tier: null },
})

describe("mentionedPeople", () => {
  it("lists each person once, in the order they were named, skipping anyone without a username", () => {
    expect(
      mentionedPeople([
        mention("a", "ada", 0),
        mention("b", null, 5),
        mention("a", "ada", 10),
      ])
    ).toEqual([{ id: "a", username: "ada" }])
  })
})
