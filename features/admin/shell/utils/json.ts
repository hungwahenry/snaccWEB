export type JsonParse<T> = { ok: true; value: T } | { ok: false }

/** Parses a JSON object someone typed. Arrays and bare values are refused. */
export function parseJsonObject(
  text: string
): JsonParse<Record<string, unknown>> {
  try {
    const value: unknown = JSON.parse(text)
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return { ok: false }
    }

    return { ok: true, value: value as Record<string, unknown> }
  } catch {
    return { ok: false }
  }
}

/** Parses any JSON value someone typed. */
export function parseJson(text: string): JsonParse<unknown> {
  try {
    return { ok: true, value: JSON.parse(text) as unknown }
  } catch {
    return { ok: false }
  }
}

export function prettyJson(value: unknown): string {
  return value === undefined ? "" : JSON.stringify(value, null, 2)
}
