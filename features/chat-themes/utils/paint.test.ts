import { describe, expect, it } from "vitest"
import type { ChatPaint } from "../types"
import { backgroundOf, paintOf, threadColors } from "./paint"

const paint = (meta: string): ChatPaint => ({
  background: { kind: "solid", color: "#fff" },
  wash: null,
  mine: { fill: "#000", text: "#fff" },
  theirs: { fill: "#eee", text: "#111" },
  meta,
})

describe("paint", () => {
  it("picks the paint for the page's mode", () => {
    const look = { light: paint("light"), dark: paint("dark") }
    expect(paintOf(look, "light").meta).toBe("light")
    expect(paintOf(look, "dark").meta).toBe("dark")
  })

  it("draws a solid colour or a CSS gradient", () => {
    expect(backgroundOf({ kind: "solid", color: "#123456" })).toBe("#123456")
    expect(
      backgroundOf({ kind: "gradient", colors: ["#111", "#222"], angle: 160 })
    ).toBe("linear-gradient(160deg, #111, #222)")
    expect(
      backgroundOf({ kind: "gradient", colors: ["#111"], angle: 90 })
    ).toBe("linear-gradient(90deg, #111, #111)")
  })

  it("repaints the thread's colours from the theme", () => {
    expect(threadColors(paint("#888"))).toEqual({
      "--primary": "#000",
      "--primary-foreground": "#fff",
      "--muted": "#eee",
      "--foreground": "#111",
      "--muted-foreground": "#888",
    })
  })
})
