import { describe, expect, it } from "vitest"
import { counter, isoDuration, serializeJsonLd } from "./json-ld"

describe("serializeJsonLd", () => {
  it("cannot be broken out of by what somebody typed", () => {
    const text = serializeJsonLd({
      articleBody: '</script><script>alert("x")</script> & more',
    })

    expect(text).not.toContain("<")
    expect(text).not.toContain(">")
    expect(text).not.toContain("&")
    expect(JSON.parse(text)).toEqual({
      articleBody: '</script><script>alert("x")</script> & more',
    })
  })

  it("leaves out what is not there", () => {
    expect(serializeJsonLd({ name: "Ada", image: undefined })).toBe(
      '{"name":"Ada"}'
    )
  })
})

describe("isoDuration", () => {
  it("writes a length the way search engines read it", () => {
    expect(isoDuration(12_400)).toBe("PT12S")
    expect(isoDuration(0)).toBe("PT0S")
    expect(isoDuration(-5)).toBe("PT0S")
  })
})

describe("counter", () => {
  it("names the action and never counts below nothing", () => {
    expect(counter("LikeAction", 4)).toEqual({
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/LikeAction",
      userInteractionCount: 4,
    })
    expect(counter("LikeAction", -1).userInteractionCount).toBe(0)
  })
})
