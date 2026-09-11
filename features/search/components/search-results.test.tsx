import { fireEvent, render, screen } from "@testing-library/react"
import { UsersRoundIcon } from "lucide-react"
import { describe, expect, it, vi } from "vitest"
import { SearchResults } from "./search-results"

class Observer {
  observe() {}
  disconnect() {}
}
globalThis.IntersectionObserver =
  Observer as unknown as typeof IntersectionObserver

function Row() {
  return <div data-testid="skeleton" />
}

const base = {
  items: [] as string[],
  loading: false,
  failed: false,
  loadingMore: false,
  onRetry: vi.fn(),
  onLoadMore: vi.fn(),
  skeleton: Row,
  failedTitle: "Search didn't go through",
  empty: {
    icon: UsersRoundIcon,
    title: "No people found",
    description: "Try a name.",
  },
  renderItem: (item: string) => <p key={item}>{item}</p>,
}

describe("SearchResults", () => {
  it("shows row skeletons while it looks", () => {
    render(<SearchResults {...base} loading />)
    expect(screen.getAllByTestId("skeleton")).toHaveLength(8)
  })

  it("offers a retry when it fails with nothing to show", () => {
    const onRetry = vi.fn()
    render(<SearchResults {...base} failed onRetry={onRetry} />)
    fireEvent.click(screen.getByRole("button", { name: "Try again" }))
    expect(onRetry).toHaveBeenCalledOnce()
    expect(screen.getByText("Search didn't go through")).toBeTruthy()
  })

  it("says nothing matched", () => {
    render(<SearchResults {...base} />)
    expect(screen.getByText("No people found")).toBeTruthy()
  })

  it("keeps the results it has even when a later page fails", () => {
    render(<SearchResults {...base} items={["ada", "bola"]} failed />)
    expect(screen.getByText("ada")).toBeTruthy()
    expect(screen.getByText("bola")).toBeTruthy()
    expect(screen.queryByText("Search didn't go through")).toBeNull()
  })
})
