import { describe, expect, it } from "vitest"
import { siteLink } from "./site-link"

describe("siteLink", () => {
  it("keeps Snacc links inside the app, query and hash included", () => {
    expect(siteLink("https://snacc.fyi/@bola")).toEqual({
      kind: "app",
      path: "/@bola",
    })
    expect(siteLink("https://www.snacc.fyi/snacc/01A?x=1#top")).toEqual({
      kind: "app",
      path: "/snacc/01A?x=1#top",
    })
    expect(siteLink("https://SNACC.fyi")).toEqual({
      kind: "app",
      path: "/",
    })
  })

  it("never turns a Snacc link into another site", () => {
    expect(siteLink("https://snacc.fyi//evil.example/x")).toEqual({
      kind: "app",
      path: "/evil.example/x",
    })
  })

  it("opens other sites in a new tab", () => {
    expect(siteLink("https://example.com/a?b=1")).toEqual({
      kind: "web",
      url: "https://example.com/a?b=1",
    })
    expect(siteLink("https://snacc.fyi.evil.example/pay")).toEqual({
      kind: "web",
      url: "https://snacc.fyi.evil.example/pay",
    })
  })

  it("ignores anything that is not an https link", () => {
    expect(siteLink("http://example.com")).toBeNull()
    expect(siteLink("javascript:alert(1)")).toBeNull()
    expect(siteLink("not a link")).toBeNull()
  })
})
