export const PAGE_SIZE = 20

/** Whether any filter has moved off its default, which is when a list offers "Reset". */
export function isFiltered(
  filters: Record<string, object>,
  values: Record<string, unknown>
): boolean {
  return Object.entries(filters).some(([key, parser]) => {
    const value = values[key] ?? null
    const fallback =
      "defaultValue" in parser ? (parser.defaultValue ?? null) : null

    return value !== fallback && value !== ""
  })
}

/** Turns a three-way URL choice into the optional boolean an API filter takes. */
export function booleanFilter<T extends string>(
  value: T | null,
  truthy: T
): boolean | undefined {
  return value === null ? undefined : value === truthy
}
