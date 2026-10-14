import type { Size } from "@/lib/aspect"

export interface Point {
  x: number
  y: number
}

export interface Sample extends Point {
  time: number
}

const TURN_DISTANCE = 0.25
const TURN_VELOCITY = 600
const DISMISS_DISTANCE = 0.15
const DISMISS_VELOCITY = 900
const RUBBER = 0.55
const VELOCITY_WINDOW_MS = 100
const GLIDE_SECONDS = 0.2

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function fitContain(content: Size | null, box: Size): Size {
  if (!content || content.width <= 0 || content.height <= 0) return box
  const scale = Math.min(box.width / content.width, box.height / content.height)
  return { width: content.width * scale, height: content.height * scale }
}

export function panBounds(fit: Size, scale: number, box: Size): Point {
  return {
    x: Math.max(0, (fit.width * scale - box.width) / 2),
    y: Math.max(0, (fit.height * scale - box.height) / 2),
  }
}

export function rubberBand(overflow: number, dimension: number): number {
  if (overflow === 0 || dimension <= 0) return 0
  const pulled =
    (1 - 1 / ((Math.abs(overflow) * RUBBER) / dimension + 1)) * dimension
  return Math.sign(overflow) * pulled
}

export function focalTranslate(
  start: { focal: Point; translate: Point; scale: number },
  focal: Point,
  scale: number,
  center: Point
): Point {
  const anchorX = (start.focal.x - center.x - start.translate.x) / start.scale
  const anchorY = (start.focal.y - center.y - start.translate.y) / start.scale
  return {
    x: focal.x - center.x - scale * anchorX,
    y: focal.y - center.y - scale * anchorY,
  }
}

export function tapZoomTranslate(
  tap: Point,
  center: Point,
  scale: number,
  bounds: Point
): Point {
  return {
    x: clamp(-(tap.x - center.x) * (scale - 1), -bounds.x, bounds.x),
    y: clamp(-(tap.y - center.y) * (scale - 1), -bounds.y, bounds.y),
  }
}

export function turnAfterSwipe(
  distance: number,
  velocity: number,
  width: number
): -1 | 0 | 1 {
  const far = Math.abs(distance) > width * TURN_DISTANCE
  const fast =
    Math.abs(velocity) > TURN_VELOCITY &&
    Math.sign(velocity) === Math.sign(distance)
  if (distance === 0 || (!far && !fast)) return 0
  return distance < 0 ? 1 : -1
}

export function shouldDismiss(
  distance: number,
  velocity: number,
  height: number
): boolean {
  if (distance === 0) return false
  const far = Math.abs(distance) > height * DISMISS_DISTANCE
  const fast =
    Math.abs(velocity) > DISMISS_VELOCITY &&
    Math.sign(velocity) === Math.sign(distance)
  return far || fast
}

export function velocityOf(samples: Sample[]): Point {
  const last = samples[samples.length - 1]
  if (!last) return { x: 0, y: 0 }
  const first =
    samples.find((sample) => last.time - sample.time <= VELOCITY_WINDOW_MS) ??
    last
  const seconds = (last.time - first.time) / 1000
  if (seconds <= 0) return { x: 0, y: 0 }
  return {
    x: (last.x - first.x) / seconds,
    y: (last.y - first.y) / seconds,
  }
}

export function glideTo(position: number, velocity: number, bound: number) {
  return clamp(position + velocity * GLIDE_SECONDS, -bound, bound)
}
