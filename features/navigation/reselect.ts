type Listener = () => void

const listeners = new Map<string, Set<Listener>>()

export function onNavReselect(key: string, listener: Listener): () => void {
  const group = listeners.get(key) ?? new Set<Listener>()
  listeners.set(key, group)
  group.add(listener)

  return () => {
    group.delete(listener)
  }
}

export function emitNavReselect(key: string): void {
  listeners.get(key)?.forEach((listener) => listener())
}
