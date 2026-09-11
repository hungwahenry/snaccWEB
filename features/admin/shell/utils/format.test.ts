import { describe, expect, it } from "vitest"
import {
  clock,
  daysSince,
  describeMinutes,
  humanize,
  plural,
  shortId,
  signedNaira,
  uptime,
} from "./format"

describe("plural", () => {
  it("picks the singular only for exactly one", () => {
    expect(plural(1, "report")).toBe("1 report")
    expect(plural(0, "report")).toBe("0 reports")
    expect(plural(1200, "reply", "replies")).toBe("1,200 replies")
  })
})

describe("shortId", () => {
  it("cuts long ids and leaves short ones alone", () => {
    expect(shortId("0123456789abcdef")).toBe("01234567…")
    expect(shortId("abc")).toBe("abc")
  })
})

describe("humanize", () => {
  it("turns keys into sentence-case words", () => {
    expect(humanize("chat_message")).toBe("Chat message")
    expect(humanize("wallet-transfer_in")).toBe("Wallet transfer in")
    expect(humanize("")).toBe("")
  })
})

describe("clock", () => {
  it("shows minutes and zero-padded seconds", () => {
    expect(clock(83_000)).toBe("1:23")
    expect(clock(5_400)).toBe("0:05")
    expect(clock(-10)).toBe("0:00")
  })
})

describe("uptime", () => {
  it("drops the units that are zero except minutes", () => {
    expect(uptime(0)).toBe("0m")
    expect(uptime(3_660)).toBe("1h 1m")
    expect(uptime(2 * 86_400 + 5 * 60)).toBe("2d 5m")
  })
})

describe("describeMinutes", () => {
  it("prefers days, then hours, then minutes", () => {
    expect(describeMinutes(1_440)).toBe("a day")
    expect(describeMinutes(2_880)).toBe("2 days")
    expect(describeMinutes(60)).toBe("an hour")
    expect(describeMinutes(180)).toBe("3 hours")
    expect(describeMinutes(45)).toBe("45 min")
    expect(describeMinutes(0)).toBe("0 min")
  })
})

describe("daysSince", () => {
  it("counts whole days and never goes negative", () => {
    const now = Date.parse("2026-09-10T12:00:00Z")
    expect(daysSince("2026-09-08T11:00:00Z", now)).toBe(2)
    expect(daysSince("2026-09-10T11:00:00Z", now)).toBe(0)
    expect(daysSince("2026-09-11T11:00:00Z", now)).toBe(0)
  })
})

describe("signedNaira", () => {
  it("puts the sign in front of the currency", () => {
    expect(signedNaira(50_000)).toBe("+₦500")
    expect(signedNaira(-50_050)).toBe("−₦500.5")
    expect(signedNaira(0)).toBe("₦0")
  })
})
