/** Which rows a page shows, and how many pages there are, for a "21–40 of 97" line. */
export function pageWindow(page: number, perPage: number, total: number) {
  const pages = Math.max(1, Math.ceil(total / Math.max(1, perPage)))
  const first = total === 0 ? 0 : Math.min(total, (page - 1) * perPage + 1)
  const last = Math.min(page * perPage, total)

  return { first, last, pages }
}
