import { recordSignals, type Signal } from "@/features/signals/api"

const FLUSH_INTERVAL_MS = 5000
const MAX_PER_FLUSH = 50

let pending: Signal[] = []
let timer: ReturnType<typeof setTimeout> | null = null
let listening = false

function listen(): void {
  if (listening || typeof document === "undefined") return
  listening = true
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") flushSignals()
  })
}

export function flushSignals(): void {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (pending.length === 0) return

  const batch = pending.slice(0, MAX_PER_FLUSH)
  pending = pending.slice(MAX_PER_FLUSH)

  void recordSignals(batch).catch(() => undefined)
  if (pending.length > 0) schedule()
}

function schedule(): void {
  if (timer) return
  timer = setTimeout(flushSignals, FLUSH_INTERVAL_MS)
}

export function signal(kind: string, options: Omit<Signal, "kind"> = {}): void {
  listen()
  const subjectId =
    options.subjectId?.length === 26 ? options.subjectId : undefined
  pending.push({ ...options, kind, subjectId })

  if (pending.length >= MAX_PER_FLUSH) {
    flushSignals()
    return
  }
  schedule()
}
