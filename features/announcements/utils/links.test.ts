import { describe, expect, it } from "vitest"
import { announcementLink } from "./links"

describe("announcementLink", () => {
  it("keeps Snacc links inside the app, query and hash included", () => {
    expect(announcementLink("https://snacc.fyi/@bola")).toEqual({
      kind: "app",
      path: "/@bola",
    })
    expect(announcementLink("https://www.snacc.fyi/snacc/01A?x=1#top")).toEqual(
      { kind: "app", path: "/snacc/01A?x=1#top" }
    )
    expect(announcementLink("https://SNACC.fyi")).toEqual({
      kind: "app",
      path: "/",
    })
  })

  it("never turns a Snacc link into another site", () => {
    expect(announcementLink("https://snacc.fyi//evil.example/x")).toEqual({
      kind: "app",
      path: "/evil.example/x",
    })
  })

  it("opens other sites in a new tab", () => {
    expect(announcementLink("https://example.com/a?b=1")).toEqual({
      kind: "web",
      url: "https://example.com/a?b=1",
    })
    expect(announcementLink("https://snacc.fyi.evil.example/pay")).toEqual({
      kind: "web",
      url: "https://snacc.fyi.evil.example/pay",
    })
  })

  it("ignores anything that is not an https link", () => {
    expect(announcementLink("http://example.com")).toBeNull()
    expect(announcementLink("javascript:alert(1)")).toBeNull()
    expect(announcementLink("not a link")).toBeNull()
  })
})
