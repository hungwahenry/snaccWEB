import type { CropRect } from "@/lib/media"

export type { CropRect }

export interface Size {
  width: number
  height: number
}

export interface Box extends Size {
  x: number
  y: number
}

export type Corner = "tl" | "tr" | "bl" | "br"
export type Edge = "t" | "r" | "b" | "l"
export type Grip = Corner | Edge

const MIN_CROP = 48

export function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value))
}

export function fitWithin(source: Size | null, available: Size): Size {
  if (!source || source.width <= 0 || source.height <= 0) return available
  if (available.width <= 0 || available.height <= 0)
    return { width: 0, height: 0 }

  const scale = Math.min(
    available.width / source.width,
    available.height / source.height
  )

  return {
    width: Math.round(source.width * scale),
    height: Math.round(source.height * scale),
  }
}

export function containBox(
  source: Size,
  available: Size
): Box & { scale: number } {
  const fitted = fitWithin(source, available)
  const scale = source.width > 0 ? fitted.width / source.width : 1

  return {
    x: (available.width - fitted.width) / 2,
    y: (available.height - fitted.height) / 2,
    ...fitted,
    scale,
  }
}

export function startingBox(bounds: Box, aspect: number | null): Box {
  if (aspect === null) return bounds

  const width = Math.min(bounds.width, bounds.height * aspect)
  const height = width / aspect

  return {
    x: bounds.x + (bounds.width - width) / 2,
    y: bounds.y + (bounds.height - height) / 2,
    width,
    height,
  }
}

export function moveBox(box: Box, dx: number, dy: number, bounds: Box): Box {
  return {
    ...box,
    x: clamp(box.x + dx, bounds.x, bounds.x + bounds.width - box.width),
    y: clamp(box.y + dy, bounds.y, bounds.y + bounds.height - box.height),
  }
}

export function resizeBox(
  box: Box,
  grip: Grip,
  dx: number,
  dy: number,
  bounds: Box,
  aspect: number | null
): Box {
  const right = box.x + box.width
  const bottom = box.y + box.height
  const pullsLeft = grip.includes("l")
  const pullsRight = grip.includes("r")
  const pullsTop = grip.includes("t")
  const pullsBottom = grip.includes("b")

  let x = pullsLeft ? clamp(box.x + dx, bounds.x, right - MIN_CROP) : box.x
  let y = pullsTop ? clamp(box.y + dy, bounds.y, bottom - MIN_CROP) : box.y
  let width = pullsLeft
    ? right - x
    : pullsRight
      ? clamp(box.width + dx, MIN_CROP, bounds.x + bounds.width - box.x)
      : box.width
  let height = pullsTop
    ? bottom - y
    : pullsBottom
      ? clamp(box.height + dy, MIN_CROP, bounds.y + bounds.height - box.y)
      : box.height

  if (aspect !== null) {
    // An edge drives the side it cannot see; a corner always drives from the width.
    if (!pullsLeft && !pullsRight) width = height * aspect
    else height = width / aspect

    // Whatever was asked for has to fit; if it cannot, the other side gives way instead.
    const roomDown = pullsTop ? bottom - bounds.y : bounds.y + bounds.height - y
    if (height > roomDown) {
      height = roomDown
      width = height * aspect
    }
    const roomAcross = pullsLeft
      ? right - bounds.x
      : bounds.x + bounds.width - x
    if (width > roomAcross) {
      width = roomAcross
      height = width / aspect
    }

    if (pullsLeft) x = right - width
    if (pullsTop) y = bottom - height
    if (!pullsLeft && !pullsRight)
      x = clamp(
        box.x + (box.width - width) / 2,
        bounds.x,
        bounds.x + bounds.width - width
      )
    if (!pullsTop && !pullsBottom)
      y = clamp(
        box.y + (box.height - height) / 2,
        bounds.y,
        bounds.y + bounds.height - height
      )
  }

  return { x, y, width, height }
}

export function gripAt(grip: Grip, box: Box, handle: number): Box {
  const half = handle / 2
  const left = grip.includes("l")
  const right = grip.includes("r")
  const top = grip.includes("t")
  const bottom = grip.includes("b")

  const x = left
    ? box.x - half
    : right
      ? box.x + box.width - half
      : box.x + half
  const y = top
    ? box.y - half
    : bottom
      ? box.y + box.height - half
      : box.y + half

  return {
    x,
    y,
    width: left || right ? handle : Math.max(box.width - handle, 0),
    height: top || bottom ? handle : Math.max(box.height - handle, 0),
  }
}

export function boxToSource(
  box: Box,
  display: Box & { scale: number },
  source: Size
): CropRect {
  const width = Math.round(box.width / display.scale)
  const height = Math.round(box.height / display.scale)

  return {
    originX: Math.round(
      clamp((box.x - display.x) / display.scale, 0, source.width - width)
    ),
    originY: Math.round(
      clamp((box.y - display.y) / display.scale, 0, source.height - height)
    ),
    width: Math.min(width, source.width),
    height: Math.min(height, source.height),
  }
}
