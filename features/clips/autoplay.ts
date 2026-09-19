import { autoplayTarget, shareOf, type SeenClip } from "./utils/autoplay"

const SETTLE_MS = 160
const STEPS = [0, 0.2, 0.4, 0.6, 0.8, 1]

class ClipAutoplay {
  private observer: IntersectionObserver | null = null
  private readonly seen = new Map<Element, SeenClip<Element>>()
  private readonly listeners = new Set<() => void>()
  private playing: Element | null = null
  private timer: number | null = null

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  target = (): Element | null => this.playing

  watch(card: Element): () => void {
    this.observing().observe(card)

    return () => {
      this.observer?.unobserve(card)
      this.seen.delete(card)
      this.settle()
    }
  }

  private observing(): IntersectionObserver {
    if (this.observer) return this.observer

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.seen.set(entry.target, {
            card: entry.target,
            top: entry.boundingClientRect.top,
            share: shareOf(
              entry.intersectionRatio,
              entry.intersectionRect.height,
              entry.rootBounds?.height ?? 0
            ),
          })
        }
        this.settle()
      },
      { threshold: STEPS }
    )
    document.addEventListener("visibilitychange", this.settle)

    return this.observer
  }

  private settle = (): void => {
    if (this.timer !== null) window.clearTimeout(this.timer)

    this.timer = window.setTimeout(() => {
      this.timer = null
      const next =
        document.visibilityState === "visible"
          ? autoplayTarget([...this.seen.values()])
          : null
      if (next === this.playing) return

      this.playing = next
      this.listeners.forEach((listener) => listener())
    }, SETTLE_MS)
  }
}

export const clipAutoplay = new ClipAutoplay()
