/** Fewer letters than this match too much to be worth asking the server. */
export const MIN_SEARCH = 2

export function isSearch(q: string): boolean {
  return q.length >= MIN_SEARCH
}
