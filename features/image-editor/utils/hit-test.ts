import type { Layer } from "../types"
import type { Box, Size } from "./geometry"
import { layoutText, type Measure } from "./text"

function contains(box: Box, point: { x: number; y: number }): boolean {
  return (
    point.x >= box.x &&
    point.x <= box.x + box.width &&
    point.y >= box.y &&
    point.y <= box.y + box.height
  )
}

export function textAt(
  point: { x: number; y: number },
  layers: Layer[],
  bounds: Size,
  measure: Measure
): Extract<Layer, { kind: "text" }> | null {
  for (let index = layers.length - 1; index >= 0; index -= 1) {
    const layer = layers[index]
    if (layer.kind !== "text") continue

    if (contains(layoutText(layer, bounds, measure).box, point)) return layer
  }

  return null
}
