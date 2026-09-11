import { describe, expect, it } from "vitest"
import {
  bareLink,
  findShareLinks,
  mend,
  shareLink,
  withoutShareLinks,
} from "./share-links"

describe("shareLink", () => {
  it("builds public links on the site", () => {
    expect(shareLink.profile("bola")).toBe("https://snacc.fyi/@bola")
    expect(shareLink.snacc("01J")).toBe("https://snacc.fyi/snacc/01J")
    expect(shareLink.campus("unilag")).toBe("https://snacc.fyi/campus/unilag")
    expect(shareLink.pay("bola")).toBe("https://snacc.fyi/pay/bola")
    expect(bareLink(shareLink.pay("bola"))).toBe("snacc.fyi/pay/bola")
  })
})

describe("findShareLinks", () => {
  it("finds every kind of Snacc link, with or without the scheme", () => {
    const body =
      "see snacc.fyi/@bola and https://snacc.fyi/snacc/01ABC then snacc.fyi/campus/uni-lag or https://www.snacc.fyi/pay/bola"
    expect(findShareLinks(body).map(({ kind, ref }) => [kind, ref])).toEqual([
      ["profile", "bola"],
      ["snacc", "01ABC"],
      ["campus", "uni-lag"],
      ["pay", "bola"],
    ])
  })

  it("ignores other sites and emails", () => {
    expect(
      findShareLinks("mail me@snacc.fyi or evil.com/snacc.fyi/@x")
    ).toEqual([])
  })
})

describe("withoutShareLinks", () => {
  it("drops the links and mends the words around them", () => {
    expect(withoutShareLinks("look snacc.fyi/snacc/01A now")).toBe("look now")
    expect(withoutShareLinks("snacc.fyi/@bola")).toBe("")
    expect(withoutShareLinks("no links here")).toBe("no links here")
  })

  it("keeps at most two line breaks at a seam", () => {
    expect(mend("top\n\n\n", "\nbottom")).toBe("top\n\nbottom")
    expect(mend("left ", " right")).toBe("left right")
    expect(mend("left", "right")).toBe("leftright")
  })
})
