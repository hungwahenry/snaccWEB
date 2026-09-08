import { BLUR_SIGMA, type Layer, type Tool } from "../types"
import { editorFont, measureLine } from "./font"
import type { Size } from "./geometry"
import { layoutText } from "./text"

function strokePath(
  context: CanvasRenderingContext2D,
  path: string,
  width: number,
  color: string
) {
  context.save()
  context.strokeStyle = color
  context.lineWidth = width
  context.lineCap = "round"
  context.lineJoin = "round"
  context.stroke(new Path2D(path))
  context.restore()
}

/// Blurs the picture only where the finger went: the stroke is a mask over a blurred copy.
function smudge(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  size: Size,
  path: string,
  width: number
) {
  const layer = document.createElement("canvas")
  layer.width = size.width
  layer.height = size.height
  const scratch = layer.getContext("2d")
  if (!scratch) return

  scratch.filter = `blur(${BLUR_SIGMA}px)`
  scratch.drawImage(image, 0, 0, size.width, size.height)
  scratch.filter = "none"
  scratch.globalCompositeOperation = "destination-in"
  scratch.strokeStyle = "#000"
  scratch.lineWidth = width
  scratch.lineCap = "round"
  scratch.lineJoin = "round"
  scratch.stroke(new Path2D(path))

  context.drawImage(layer, 0, 0)
}

function drawText(
  context: CanvasRenderingContext2D,
  layer: Extract<Layer, { kind: "text" }>,
  bounds: Size
) {
  const { lines, placed } = layoutText(layer, bounds, measureLine)
  context.save()
  context.font = editorFont(layer.size)
  context.textBaseline = "alphabetic"
  lines.forEach((line, index) => {
    context.fillStyle = "rgba(0,0,0,0.45)"
    context.fillText(line, placed[index].x + 1, placed[index].y + 1.5)
    context.fillStyle = layer.color
    context.fillText(line, placed[index].x, placed[index].y)
  })
  context.restore()
}

export interface LiveStroke {
  tool: Tool
  path: string
  color: string
  width: number
}

export function drawScene(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  size: Size,
  layers: Layer[],
  live: LiveStroke | null
) {
  context.clearRect(0, 0, size.width, size.height)
  context.drawImage(image, 0, 0, size.width, size.height)

  for (const layer of layers) {
    if (layer.kind === "blur")
      smudge(context, image, size, layer.path, layer.width)
    else if (layer.kind === "stroke")
      strokePath(context, layer.path, layer.width, layer.color)
    else drawText(context, layer, size)
  }

  if (live?.tool === "blur") smudge(context, image, size, live.path, live.width)
  if (live?.tool === "draw")
    strokePath(context, live.path, live.width, live.color)
}
