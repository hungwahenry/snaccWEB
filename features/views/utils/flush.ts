type Flush = () => Promise<void>

const trackers = new Set<Flush>()

export function trackViewFlush(flush: Flush): () => void {
  trackers.add(flush)
  return () => {
    trackers.delete(flush)
  }
}

export async function flushViews(): Promise<void> {
  await Promise.all([...trackers].map((flush) => flush()))
}
