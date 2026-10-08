export function columnsOf<T>(items: T[], count: number): T[][] {
  const columns: T[][] = Array.from({ length: Math.max(1, count) }, () => [])
  items.forEach((item, index) => columns[index % columns.length].push(item))
  return columns
}
