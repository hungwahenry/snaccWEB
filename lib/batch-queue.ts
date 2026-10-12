const FLUSH_INTERVAL_MS = 5000

export function batchQueue<T>(
  send: (batch: T[]) => Promise<void>,
  maxPerFlush: number
) {
  let pending: T[] = []
  let timer: ReturnType<typeof setTimeout> | null = null
  let listening = false

  function flush(): void {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (pending.length === 0) return

    const batch = pending.slice(0, maxPerFlush)
    pending = pending.slice(maxPerFlush)

    void send(batch).catch(() => undefined)
    if (pending.length > 0) schedule()
  }

  function schedule(): void {
    if (timer) return
    timer = setTimeout(flush, FLUSH_INTERVAL_MS)
  }

  function listen(): void {
    if (listening || typeof document === "undefined") return
    listening = true
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") flush()
    })
  }

  return {
    add(item: T): void {
      listen()
      pending.push(item)

      if (pending.length >= maxPerFlush) {
        flush()
        return
      }
      schedule()
    },
    flush,
  }
}
