import { describe, expect, it } from "vitest"
import { WatchLedger } from "./watch-ledger"

describe("WatchLedger", () => {
  it("ignores a clip that only flashed past", () => {
    const ledger = new WatchLedger()
    ledger.show("a", 0)
    ledger.show("b", 200)

    expect(ledger.take(200).ids).toEqual([])
  })

  it("reports time on screen and time actually playing, not paused", () => {
    const ledger = new WatchLedger()
    ledger.show("a", 0)
    ledger.playing(true, 100)
    ledger.playing(false, 2_100)
    ledger.show(null, 5_000)

    expect(ledger.take(5_000)).toEqual({
      ids: ["a"],
      dwellMs: { a: 5_000 },
      watchMs: { a: 2_000 },
    })
  })

  it("reports a skip as a clip that was shown and watched for nothing", () => {
    const ledger = new WatchLedger()
    ledger.show("a", 0)
    ledger.show("b", 600)

    expect(ledger.take(600).watchMs).toEqual({ a: 0 })
  })

  it("hands over what it has so far and keeps counting the clip on screen", () => {
    const ledger = new WatchLedger()
    ledger.show("a", 0)
    ledger.playing(true, 0)

    expect(ledger.take(3_000).watchMs).toEqual({ a: 3_000 })

    ledger.show(null, 4_000)
    expect(ledger.take(4_000)).toEqual({
      ids: ["a"],
      dwellMs: { a: 1_000 },
      watchMs: { a: 1_000 },
    })
  })

  it("keeps reporting a clip it already counted, however short the stretch", () => {
    const ledger = new WatchLedger()
    ledger.show("a", 0)
    ledger.take(1_000)
    ledger.show(null, 1_100)

    expect(ledger.take(1_100).dwellMs).toEqual({ a: 100 })
  })

  it("adds up a clip seen twice before a report goes out", () => {
    const ledger = new WatchLedger()
    ledger.show("a", 0)
    ledger.show("b", 1_000)
    ledger.show("a", 2_000)
    ledger.show(null, 3_000)

    expect(ledger.take(3_000).dwellMs).toEqual({ a: 2_000, b: 1_000 })
  })
})
