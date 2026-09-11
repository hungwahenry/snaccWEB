import { useMutation } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { makeTestClient, queryWrapper } from "@/test/query-wrapper"
import { usePendingVariables } from "./use-pending-variables"

describe("usePendingVariables", () => {
  it("lists every run still in flight, so two rows can be busy at once", async () => {
    const releases: (() => void)[] = []
    const { result } = renderHook(
      () => {
        const mutation = useMutation<void, Error, string>({
          mutationKey: ["unblock"],
          mutationFn: () => new Promise((resolve) => releases.push(resolve)),
        })
        return { mutation, pending: usePendingVariables<string>(["unblock"]) }
      },
      { wrapper: queryWrapper(makeTestClient()) }
    )

    act(() => {
      result.current.mutation.mutate("a")
      result.current.mutation.mutate("b")
    })
    await waitFor(() => expect(result.current.pending).toEqual(["a", "b"]))

    act(() => releases[0]())
    await waitFor(() => expect(result.current.pending).toEqual(["b"]))
  })
})
