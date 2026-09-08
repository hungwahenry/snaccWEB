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
  corner: Corner,
  dx: number,
  dy: number,
  bounds: Box,
  aspect: number | null
): Box {
  const right = box.x + box.width
  const bottom = box.y + box.height
  const holdsLeft = corner === "tr" || corner === "br"
  const holdsTop = corner === "bl" || corner === "br"

  let x = holdsLeft ? box.x : clamp(box.x + dx, bounds.x, right - MIN_CROP)
  let y = holdsTop ? box.y : clamp(box.y + dy, bounds.y, bottom - MIN_CROP)
  let width = holdsLeft
    ? clamp(box.width + dx, MIN_CROP, bounds.x + bounds.width - box.x)
    : right - x
  let height = holdsTop
    ? clamp(box.height + dy, MIN_CROP, bounds.y + bounds.height - box.y)
    : bottom - y

  if (aspect !== null) {
    height = width / aspect

    // Whatever the width asked for has to fit; if it cannot, the width gives way instead.
    const room = holdsTop ? bounds.y + bounds.height - y : bottom - bounds.y
    if (height > room) {
      height = room
      width = height * aspect
    }

    if (!holdsLeft) x = right - width
    if (!holdsTop) y = bottom - height
  }

  return { x, y, width, height }
}

export function cornerAt(corner: Corner, box: Box, handle: number): Box {
  const left = corner === "tl" || corner === "bl"
  const top = corner === "tl" || corner === "tr"

  return {
    x: (left ? box.x : box.x + box.width) - handle / 2,
    y: (top ? box.y : box.y + box.height) - handle / 2,
    width: handle,
    height: handle,
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
