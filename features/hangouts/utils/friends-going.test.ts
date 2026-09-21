import { describe, expect, it } from "vitest"
import { friendsGoingLine } from "./friends-going"

const ada = { display_name: "Ada", username: "ada" }
const bola = { display_name: null, username: "bola" }
const chi = { display_name: "Chi", username: "chi" }

describe("friendsGoingLine", () => {
  it("says nothing when nobody you follow is going", () => {
    expect(friendsGoingLine([], 0)).toBeNull()
  })

  it("names one or two people, then counts the rest", () => {
    expect(friendsGoingLine([ada], 1)).toBe("Ada is going")
    expect(friendsGoingLine([ada, bola], 2)).toBe("Ada and bola are going")
    expect(friendsGoingLine([ada, bola, chi], 3)).toBe(
      "Ada, bola and 1 other you follow are going"
    )
    expect(friendsGoingLine([ada, bola, chi], 7)).toBe(
      "Ada, bola and 5 others you follow are going"
    )
  })
})
