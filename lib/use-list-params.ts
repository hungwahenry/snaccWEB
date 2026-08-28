"use client"

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import { useCallback, useMemo } from "react"

/**
 * List state lives in the URL, so a filtered view is a link a moderator can send someone. Every
 * admin list shares this, which is why they all page, search and reset the same way.
 */
export function useListParams<T extends Record<string, string>>(extra?: {
  [K in keyof T]: string
}) {
  const parsers = useMemo(
    () => ({
      page: parseAsInteger.withDefault(1),
      q: parseAsString.withDefault(""),
      ...Object.fromEntries(
        Object.keys(extra ?? {}).map((key) => [
          key,
          parseAsString.withDefault(""),
        ])
      ),
    }),
    [extra]
  )

  const [state, setState] = useQueryStates(parsers, {
    history: "replace",
    clearOnDefault: true,
  })

  const set = useCallback(
    (patch: Record<string, string | number | null>) =>
      // Any change to a filter puts you back on the first page; staying on page 7 of a result
      // set that no longer has seven pages is how a list looks broken.
      void setState({ page: 1, ...patch }),
    [setState]
  )

  const reset = useCallback(() => {
    void setState(
      Object.fromEntries(Object.keys(parsers).map((key) => [key, null]))
    )
  }, [parsers, setState])

  const active = Object.entries(state).some(
    ([key, value]) => key !== "page" && value !== "" && value !== null
  )

  return {
    params: state as { page: number; q: string } & T,
    set,
    setPage: (page: number) => void setState({ page }),
    reset,
    active,
  }
}

/** Drops empty strings, which the API treats as "filter by nothing" rather than "no filter". */
export function queryOf(
  params: Record<string, string | number | boolean | undefined>
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== "" && value !== null
    )
  ) as Record<string, string | number | boolean>
}
