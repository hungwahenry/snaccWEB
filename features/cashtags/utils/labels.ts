export function cashtagLabel(symbol: string): string {
  return `$${symbol.toUpperCase()}`
}

export function symbolFromParam(raw: string): string {
  try {
    return decodeURIComponent(raw).toUpperCase()
  } catch {
    return raw.toUpperCase()
  }
}
