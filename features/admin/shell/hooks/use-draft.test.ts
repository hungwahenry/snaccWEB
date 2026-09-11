import { act, renderHook } from "@testing-library/react"
import type { ChangeEvent } from "react"
import { describe, expect, it } from "vitest"
import { useDraft } from "./use-draft"

const typed = (value: string) =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>

describe("useDraft", () => {
  it("changes one field and leaves the rest", () => {
    const { result } = renderHook(() =>
      useDraft({ name: "", open: false, count: 1 })
    )

    act(() => result.current.set("open", true))
    expect(result.current.draft).toEqual({ name: "", open: true, count: 1 })
  })

  it("wires a text input to a string field", () => {
    const { result } = renderHook(() => useDraft({ name: "Ada" }))

    expect(result.current.text("name").value).toBe("Ada")
    act(() => result.current.text("name").onChange(typed("Bola")))
    expect(result.current.draft.name).toBe("Bola")
  })

  it("starts from a lazy initial value", () => {
    const { result } = renderHook(() => useDraft(() => ({ name: "lazy" })))
    expect(result.current.draft.name).toBe("lazy")
  })
})
