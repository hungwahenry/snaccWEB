"use client"

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react"
import type { Size } from "@/lib/aspect"
import {
  clamp,
  fitContain,
  focalTranslate,
  glideTo,
  panBounds,
  rubberBand,
  shouldDismiss,
  tapZoomTranslate,
  turnAfterSwipe,
  velocityOf,
  type Point,
  type Sample,
} from "@/lib/lightbox/geometry"

const MAX_SCALE = 4
const MIN_SCALE = 0.8
const DOUBLE_TAP_SCALE = 2.5
const ZOOMED = 1.01
const DRAG_SHRINK = 0.25
const MOVE_SLOP = 6
const TAP_MS = 250
const TAP_SLOP = 24
const SETTLE_MS = 220
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
const SAMPLES_KEPT = 8

type Mode = "pending" | "page" | "dismiss" | "pan" | "pinch" | "ignore"

interface Zoom {
  scale: number
  x: number
  y: number
}

interface View {
  screen: Size
  center: Point
  fit: Size
}

interface Drag {
  mode: Mode
  mouse: boolean
  start: Point
  from: Zoom
  zoom: Zoom
  pager: number
  dropY: number
  samples: Sample[]
  pinch: { spread: number; focal: Point } | null
  view: View
}

const REST: Zoom = { scale: 1, x: 0, y: 0 }

function pointOf(event: { clientX: number; clientY: number }): Point {
  return { x: event.clientX, y: event.clientY }
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function settled(zoom: Zoom, view: View): Zoom {
  if (zoom.scale < 1) return REST
  const bounds = panBounds(view.fit, zoom.scale, view.screen)
  return {
    scale: zoom.scale,
    x: clamp(zoom.x, -bounds.x, bounds.x),
    y: clamp(zoom.y, -bounds.y, bounds.y),
  }
}

export function useLightboxGestures({
  size,
  hasPrevious,
  hasNext,
  onTurn,
  onClose,
}: {
  size: Size | null
  hasPrevious: boolean
  hasNext: boolean
  onTurn: (by: -1 | 1) => void
  onClose: () => void
}) {
  const box = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, Point>())
  const drag = useRef<Drag | null>(null)
  const lastTap = useRef<{ at: Point; time: number } | null>(null)
  const tapTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const busy = useRef(false)

  const [zoom, setZoom] = useState<Zoom>(REST)
  const [pager, setPager] = useState(0)
  const [drop, setDrop] = useState({ y: 0, fraction: 0 })
  const [animate, setAnimate] = useState(false)
  const [moving, setMoving] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [chromeShown, setChromeShown] = useState(true)

  useEffect(
    () => () => {
      clearTimeout(tapTimer.current)
      clearTimeout(settleTimer.current)
    },
    []
  )

  function measure(): View {
    const rect = box.current?.getBoundingClientRect()
    const screen = rect
      ? { width: rect.width, height: rect.height }
      : { width: window.innerWidth, height: window.innerHeight }
    const center = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: screen.width / 2, y: screen.height / 2 }
    const frame = layer.current
      ? { width: layer.current.clientWidth, height: layer.current.clientHeight }
      : screen
    return { screen, center, fit: fitContain(size, frame) }
  }

  function dropTo(y: number, height: number) {
    setDrop({ y, fraction: clamp(Math.abs(y) / height, 0, 1) })
  }

  function after(ms: number, then: () => void) {
    busy.current = true
    settleTimer.current = setTimeout(() => {
      busy.current = false
      then()
    }, ms)
  }

  function slide(by: -1 | 1, width: number) {
    setAnimate(true)
    setPager(-by * width)
    after(SETTLE_MS, () => {
      onTurn(by)
      setAnimate(false)
      setPager(0)
      setZoom(REST)
    })
  }

  function leave(direction: number, height: number) {
    setAnimate(true)
    setLeaving(true)
    dropTo(direction * height, height)
    after(SETTLE_MS, onClose)
  }

  function turnOrStay(current: Drag, velocityX: number, completed: boolean) {
    const turn = completed
      ? turnAfterSwipe(current.pager, velocityX, current.view.screen.width)
      : 0
    if ((turn === 1 && hasNext) || (turn === -1 && hasPrevious)) {
      slide(turn, current.view.screen.width)
      return true
    }
    setPager(0)
    return false
  }

  function toggleZoomAt(at: Point) {
    setAnimate(true)
    if (zoom.scale > ZOOMED) {
      setZoom(REST)
      return
    }
    const view = measure()
    const bounds = panBounds(view.fit, DOUBLE_TAP_SCALE, view.screen)
    setZoom({
      scale: DOUBLE_TAP_SCALE,
      ...tapZoomTranslate(at, view.center, DOUBLE_TAP_SCALE, bounds),
    })
  }

  function tap(at: Point, time: number) {
    const previous = lastTap.current
    if (
      previous &&
      time - previous.time < TAP_MS &&
      distance(previous.at, at) < TAP_SLOP
    ) {
      lastTap.current = null
      clearTimeout(tapTimer.current)
      toggleZoomAt(at)
      return
    }
    lastTap.current = { at, time }
    tapTimer.current = setTimeout(() => {
      lastTap.current = null
      setChromeShown((shown) => !shown)
    }, TAP_MS)
  }

  function startPinch(from: Zoom) {
    const [a, b] = [...pointers.current.values()]
    drag.current = {
      mode: "pinch",
      mouse: false,
      start: midpoint(a, b),
      from,
      zoom: from,
      pager: 0,
      dropY: 0,
      samples: [],
      pinch: { spread: distance(a, b), focal: midpoint(a, b) },
      view: measure(),
    }
    clearTimeout(tapTimer.current)
    lastTap.current = null
    setAnimate(true)
    setPager(0)
    setDrop({ y: 0, fraction: 0 })
  }

  function pinchTo(current: Drag) {
    const [a, b] = [...pointers.current.values()]
    if (!current.pinch || current.pinch.spread <= 0) return
    const scale = clamp(
      (current.from.scale * distance(a, b)) / current.pinch.spread,
      MIN_SCALE,
      MAX_SCALE
    )
    const moved = focalTranslate(
      {
        focal: current.pinch.focal,
        translate: current.from,
        scale: current.from.scale,
      },
      midpoint(a, b),
      scale,
      current.view.center
    )
    current.zoom = { scale, ...moved }
    setAnimate(false)
    setZoom(current.zoom)
  }

  function panTo(current: Drag, dx: number, dy: number) {
    const { screen, fit } = current.view
    const bounds = panBounds(fit, current.from.scale, screen)
    const wantX = current.from.x + dx
    const keptX = clamp(wantX, -bounds.x, bounds.x)
    const overflowX = wantX - keptX
    const neighbour =
      (overflowX < 0 && hasNext) || (overflowX > 0 && hasPrevious)
    const wantY = current.from.y + dy
    const keptY = clamp(wantY, -bounds.y, bounds.y)
    current.zoom = {
      scale: current.from.scale,
      x: neighbour ? keptX : keptX + rubberBand(overflowX, screen.width),
      y: keptY + rubberBand(wantY - keptY, screen.height),
    }
    current.pager = neighbour ? overflowX : 0
    setZoom(current.zoom)
    setPager(current.pager)
  }

  function modeFor(current: Drag, dx: number, dy: number): Mode {
    if (current.from.scale > ZOOMED) return "pan"
    if (current.mouse) return "ignore"
    return Math.abs(dx) > Math.abs(dy) ? "page" : "dismiss"
  }

  function finish(current: Drag, completed: boolean, at: Point, time: number) {
    const velocity = velocityOf(current.samples)
    const { screen } = current.view
    setAnimate(true)

    if (current.mode === "pending") {
      if (completed) tap(at, time)
    } else if (current.mode === "page") {
      turnOrStay(current, velocity.x, completed)
    } else if (current.mode === "dismiss") {
      if (completed && shouldDismiss(current.dropY, velocity.y, screen.height))
        leave(Math.sign(current.dropY) || 1, screen.height)
      else setDrop({ y: 0, fraction: 0 })
    } else if (current.mode === "pan") {
      if (current.pager !== 0) {
        if (!turnOrStay(current, velocity.x, completed))
          setZoom(settled(current.zoom, current.view))
      } else {
        const bounds = panBounds(current.view.fit, current.zoom.scale, screen)
        setZoom({
          scale: current.zoom.scale,
          x: completed
            ? glideTo(current.zoom.x, velocity.x, bounds.x)
            : clamp(current.zoom.x, -bounds.x, bounds.x),
          y: completed
            ? glideTo(current.zoom.y, velocity.y, bounds.y)
            : clamp(current.zoom.y, -bounds.y, bounds.y),
        })
      }
    }
  }

  function release(event: PointerEvent<HTMLElement>, completed: boolean) {
    if (!pointers.current.delete(event.pointerId)) return
    const current = drag.current
    if (!current) return

    if (current.mode === "pinch") {
      if (pointers.current.size < 2) {
        setAnimate(true)
        setZoom(settled(current.zoom, current.view))
        current.mode = "ignore"
      }
    } else if (current.mode !== "ignore") {
      finish(current, completed, pointOf(event), event.timeStamp)
      current.mode = "ignore"
    }

    if (pointers.current.size === 0) {
      drag.current = null
      setMoving(false)
    }
  }

  const onWheel = useEffectEvent((event: WheelEvent) => {
    if (busy.current || (!event.ctrlKey && zoom.scale <= ZOOMED)) return
    event.preventDefault()
    const view = measure()
    const at = pointOf(event)
    setAnimate(false)
    setZoom((current) => {
      const scale = clamp(
        current.scale * Math.exp(-event.deltaY / 300),
        1,
        MAX_SCALE
      )
      if (scale <= ZOOMED) return REST
      const moved = focalTranslate(
        { focal: at, translate: current, scale: current.scale },
        at,
        scale,
        view.center
      )
      return settled({ scale, ...moved }, view)
    })
  })

  useEffect(() => {
    const element = box.current
    if (!element) return
    const listener = (event: WheelEvent) => onWheel(event)
    element.addEventListener("wheel", listener, { passive: false })
    return () => element.removeEventListener("wheel", listener)
  }, [])

  const transition = animate
    ? `transform ${SETTLE_MS}ms ${EASE}, opacity ${SETTLE_MS}ms ${EASE}`
    : "none"
  const zoomed = zoom.scale > ZOOMED

  return {
    attach: (element: HTMLDivElement | null) => {
      box.current = element
    },
    attachImage: (element: HTMLDivElement | null) => {
      layer.current = element
    },
    zoomed,
    chromeShown,
    reset: () => {
      setAnimate(false)
      setZoom(REST)
      setPager(0)
      setDrop({ y: 0, fraction: 0 })
    },
    backdropStyle: {
      opacity: leaving ? 0 : 1 - clamp(drop.fraction / 0.6, 0, 0.85),
      transition,
    } satisfies CSSProperties,
    chromeStyle: {
      opacity:
        leaving || !chromeShown ? 0 : 1 - clamp(drop.fraction / 0.25, 0, 1),
      transition: `opacity ${SETTLE_MS}ms ${EASE}`,
    } satisfies CSSProperties,
    pagerStyle: {
      transform: `translate3d(${pager}px, 0, 0)`,
      transition,
    } satisfies CSSProperties,
    imageStyle: {
      transform: `translate3d(${zoom.x}px, ${zoom.y + drop.y}px, 0) scale(${zoom.scale * (1 - drop.fraction * DRAG_SHRINK)})`,
      transition,
      cursor: zoomed ? (moving ? "grabbing" : "grab") : undefined,
    } satisfies CSSProperties,
    handlers: {
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        if (busy.current) return
        if (event.pointerType === "mouse" && event.button !== 0) return
        const at = pointOf(event)
        pointers.current.set(event.pointerId, at)
        event.currentTarget.setPointerCapture(event.pointerId)
        setMoving(true)

        if (pointers.current.size === 2) {
          startPinch(drag.current?.zoom ?? zoom)
          return
        }
        if (pointers.current.size > 2) return

        drag.current = {
          mode: "pending",
          mouse: event.pointerType === "mouse",
          start: at,
          from: zoom,
          zoom,
          pager: 0,
          dropY: 0,
          samples: [{ ...at, time: event.timeStamp }],
          pinch: null,
          view: measure(),
        }
      },
      onPointerMove: (event: PointerEvent<HTMLElement>) => {
        if (!pointers.current.has(event.pointerId)) return
        const at = pointOf(event)
        pointers.current.set(event.pointerId, at)
        const current = drag.current
        if (!current || current.mode === "ignore") return
        if (current.mode === "pinch") {
          if (pointers.current.size === 2) pinchTo(current)
          return
        }

        const dx = at.x - current.start.x
        const dy = at.y - current.start.y
        current.samples = [
          ...current.samples.slice(-SAMPLES_KEPT),
          { ...at, time: event.timeStamp },
        ]
        if (current.mode === "pending") {
          if (Math.hypot(dx, dy) < MOVE_SLOP) return
          current.mode = modeFor(current, dx, dy)
          setAnimate(false)
        }

        const { screen } = current.view
        if (current.mode === "page") {
          const atEnd = (dx > 0 && !hasPrevious) || (dx < 0 && !hasNext)
          current.pager = atEnd ? rubberBand(dx, screen.width) : dx
          setPager(current.pager)
        } else if (current.mode === "dismiss") {
          current.dropY = dy
          dropTo(dy, screen.height)
        } else if (current.mode === "pan") {
          panTo(current, dx, dy)
        }
      },
      onPointerUp: (event: PointerEvent<HTMLElement>) => release(event, true),
      onPointerCancel: (event: PointerEvent<HTMLElement>) =>
        release(event, false),
    },
  }
}
