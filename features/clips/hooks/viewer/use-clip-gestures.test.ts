import { renderHook } from "@testing-library/react"
import type { MouseEvent, PointerEvent } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useClipGestures } from "./use-clip-gestures"

const press = { button: 0 } as PointerEvent

const click = (x = 120, y = 300) =>
  ({
    clientX: x,
    clientY: y,
    currentTarget: { getBoundingClientRect: () => ({ left: 20, top: 100 }) },
  }) as unknown as MouseEvent<HTMLElement>

function setup() {
  const on = { onTap: vi.fn(), onDoubleTap: vi.fn(), onHold: vi.fn() }
  const { result } = renderHook(() => useClipGestures(on))
  return { on, gestures: () => result.current }
}

describe("useClipGestures", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("counts one click as a tap, once a second click can no longer come", () => {
    const { on, gestures } = setup()

    gestures().onClick(click())
    expect(on.onTap).not.toHaveBeenCalled()

    vi.advanceTimersByTime(250)
    expect(on.onTap).toHaveBeenCalledTimes(1)
    expect(on.onDoubleTap).not.toHaveBeenCalled()
  })

  it("counts two quick clicks as a double tap where they landed, and no tap", () => {
    const { on, gestures } = setup()

    gestures().onClick(click())
    vi.advanceTimersByTime(100)
    gestures().onClick(click(120, 300))
    vi.advanceTimersByTime(500)

    expect(on.onDoubleTap).toHaveBeenCalledWith(100, 200)
    expect(on.onTap).not.toHaveBeenCalled()
  })

  it("speeds up while held, and does not pause when let go", () => {
    const { on, gestures } = setup()

    gestures().onPointerDown(press)
    vi.advanceTimersByTime(350)
    expect(on.onHold).toHaveBeenLastCalledWith(true)

    gestures().onPointerUp()
    expect(on.onHold).toHaveBeenLastCalledWith(false)

    gestures().onClick(click())
    vi.advanceTimersByTime(500)
    expect(on.onTap).not.toHaveBeenCalled()
  })

  it("never starts a hold when the finger goes off to scroll", () => {
    const { on, gestures } = setup()

    gestures().onPointerDown(press)
    vi.advanceTimersByTime(100)
    gestures().onPointerCancel()
    vi.advanceTimersByTime(500)

    expect(on.onHold).not.toHaveBeenCalled()
  })

  it("takes the next click normally after a hold that ended off the clip", () => {
    const { on, gestures } = setup()

    gestures().onPointerDown(press)
    vi.advanceTimersByTime(350)
    gestures().onPointerLeave()

    gestures().onClick(click())
    vi.advanceTimersByTime(250)
    expect(on.onTap).toHaveBeenCalledTimes(1)
  })
})
