import { describe, expect, it } from "vitest"
import { parseJson, parseJsonObject, prettyJson } from "./json"

describe("parseJsonObject", () => {
  it("accepts an object", () => {
    expect(parseJsonObject('{"on":"tap"}')).toEqual({
      ok: true,
      value: { on: "tap" },
    })
  })

  it("refuses arrays, bare values and broken text", () => {
    expect(parseJsonObject("[1]").ok).toBe(false)
    expect(parseJsonObject("3").ok).toBe(false)
    expect(parseJsonObject("null").ok).toBe(false)
    expect(parseJsonObject("{on:").ok).toBe(false)
  })
})

describe("parseJson", () => {
  it("accepts any JSON value", () => {
    expect(parseJson("[1,2]")).toEqual({ ok: true, value: [1, 2] })
    expect(parseJson("nope").ok).toBe(false)
  })
})

describe("prettyJson", () => {
  it("indents and treats undefined as empty", () => {
    expect(prettyJson({ a: 1 })).toBe('{\n  "a": 1\n}')
    expect(prettyJson(undefined)).toBe("")
    expect(prettyJson(null)).toBe("null")
  })
})
