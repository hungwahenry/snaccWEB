import { render, renderHook } from "@testing-library/react"
import { memo, type Ref } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useViewTracker } from "./use-view-tracker"

vi.mock("@/features/views/api", () => ({
  recordViews: vi.fn(() => Promise.resolve()),
}))

const observed: Element[] = []
const unobserved: Element[] = []
let fire: IntersectionObserverCallback = () => undefined

class FakeObserver {
  constructor(callback: IntersectionObserverCallback) {
    fire = callback
  }
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

  describe("what counts as seen", () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    const show = (node: Element, ratio: number) =>
      fire(
        [
          {
            target: node,
            intersectionRatio: ratio,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      )

    function mount(campaignId: string | null) {
      const onVisible = vi.fn()
      const onPromoted = vi.fn()
      const { result } = renderHook(() =>
        useViewTracker({ onVisible, onPromoted })
      )
      const node = document.createElement("article")
      const ref = result.current.ref("s1", campaignId)
      if (typeof ref === "function") ref(node)
      return { node, onVisible, onPromoted }
    }

    it("bills a promoted card only after a second at least half on screen", () => {
      const { node, onPromoted } = mount("c1")

      show(node, 0.55)
      vi.advanceTimersByTime(900)
      expect(onPromoted).not.toHaveBeenCalled()
      vi.advanceTimersByTime(100)
      expect(onPromoted).toHaveBeenCalledWith("c1")
    })

    it("does not bill a promoted card scrolled away inside the second", () => {
      const { node, onPromoted } = mount("c1")

      show(node, 0.7)
      vi.advanceTimersByTime(500)
      show(node, 0.3)
      vi.advanceTimersByTime(1000)
      expect(onPromoted).not.toHaveBeenCalled()
    })

    it("treats an ordinary card as gone once it drops under the visible share", () => {
      const { node, onVisible } = mount(null)

      show(node, 0.65)
      expect(onVisible).toHaveBeenLastCalledWith(["s1"])
      show(node, 0.55)
      expect(onVisible).toHaveBeenLastCalledWith([])
    })
  })
})
