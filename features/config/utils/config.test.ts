import { describe, expect, it } from "vitest"
import { PUBLIC_CONFIG_DEFAULTS } from "../keys.generated"
import type { AppConfig, ConfigKey } from "@/features/config/types"
import { configValueOf, flagOf } from "./config"

const key = Object.keys(PUBLIC_CONFIG_DEFAULTS)[0] as ConfigKey

describe("configValueOf", () => {
  it("uses the live value when the server sent one", () => {
    const config: AppConfig = {
      values: { [key]: "live" },
      flags: {},
      upgrades: {},
    }
    expect(configValueOf(config, key)).toBe("live")
  })

  it("falls back to the default the backend declared", () => {
    expect(configValueOf(undefined, key)).toBe(PUBLIC_CONFIG_DEFAULTS[key])
  })
})

describe("flagOf", () => {
  it("is off until the server says otherwise", () => {
    expect(flagOf(undefined, "wallet")).toBe(false)
    expect(
      flagOf({ values: {}, flags: { wallet: true }, upgrades: {} }, "wallet")
    ).toBe(true)
  })
})
