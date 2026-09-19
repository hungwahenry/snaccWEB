import { render, renderHook } from "@testing-library/react"
import { memo, type Ref } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useViewTracker } from "./use-view-tracker"

vi.mock("@/features/views/api", () => ({
  recordViews: vi.fn(() => Promise.resolve()),
}))

const observed: Element[] = []
const unobserved: Element[] = []

class FakeObserver {
  observe(node: Element) {
    observed.push(node)
  }
  unobserve(node: Element) {
    unobserved.push(node)
  }
  disconnect() {}
}

const renders = vi.fn()

const Card = memo(function Card({
  id,
  itemRef,
}: {
  id: string
  itemRef: Ref<HTMLElement>
}) {
  renders(id)
  return <article ref={itemRef} data-id={id} />
})

function Feed({ ids, tick }: { ids: string[]; tick: number }) {
  const tracker = useViewTracker()

  return (
    <div data-tick={tick}>
      {ids.map((id) => (
        <Card key={id} id={id} itemRef={tracker.ref(id)} />
      ))}
    </div>
  )
}

describe("useViewTracker", () => {
  beforeEach(() => {
    observed.length = 0
    unobserved.length = 0
    renders.mockClear()
    vi.stubGlobal("IntersectionObserver", FakeObserver)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("hands a card the same ref every time, so the card is left alone", () => {
    const { result, rerender } = renderHook(() => useViewTracker())
    const first = result.current.ref("a")

    rerender()

    expect(result.current.ref("a")).toBe(first)
    expect(result.current.ref("b")).not.toBe(first)
  })

  it("watches the cards that were already on the page when it started", () => {
    const { container } = render(<Feed ids={["a", "b"]} tick={0} />)

    expect(observed).toEqual([...container.querySelectorAll("article")])
  })

  it("does not redraw or re-watch the cards when the list redraws", () => {
    const { rerender } = render(<Feed ids={["a", "b"]} tick={0} />)
    renders.mockClear()
    observed.length = 0

    rerender(<Feed ids={["a", "b"]} tick={1} />)

    expect(renders).not.toHaveBeenCalled()
    expect(observed).toEqual([])
    expect(unobserved).toEqual([])
  })

  it("watches a card that arrives later, and lets go of one that leaves", () => {
    const { container, rerender } = render(<Feed ids={["a"]} tick={0} />)
    const a = container.querySelector("article")

    rerender(<Feed ids={["b"]} tick={1} />)

    expect(observed).toEqual([a, container.querySelector("article")])
    expect(unobserved).toEqual([a])
  })
})
