import { describe, expect, it } from "vitest"
import type { User } from "../types"
import { authorFromUser } from "./author"

const university = {
  id: "u1",
  name: "University of Lagos",
  acronym: "UNILAG",
  slug: "unilag",
}

function user(profile: Partial<NonNullable<User["profile"]>> = {}): User {
  return {
    id: "me",
    profile: {
      username: "ada",
      display_name: "Ada",
      avatar_url: "https://cdn/ada.png",
      university,
      official: false,
      premium: true,
      is_birthday: false,
      ...profile,
    },
  } as User
}

describe("authorFromUser", () => {
  it("shows the signed-in user the way others will see them", () => {
    expect(authorFromUser(user())).toEqual({
      id: "me",
      username: "ada",
      display_name: "Ada",
      avatar_url: "https://cdn/ada.png",
      university,
      score: { tier: null, og: false },
      official: false,
      premium: true,
      is_birthday: false,
    })
  })

  it("leaves the campus off an official account, as the server does", () => {
    expect(authorFromUser(user({ official: true })).university).toBeNull()
  })

  it("copes with no profile yet", () => {
    expect(authorFromUser({ id: "me", profile: null } as User)).toMatchObject({
      id: "me",
      username: null,
      avatar_url: "",
    })
  })
})
