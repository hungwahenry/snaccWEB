import type { PickedImage } from "@/lib/media"
import type { Layer } from "../types"
import type { Size } from "./geometry"
import { drawScene } from "./render"

const QUALITY = 0.9

function load(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Could not read the picture."))
    image.src = uri
  })
}

export async function exportScene(
  original: PickedImage,
  drawn: Size,
  layers: Layer[]
): Promise<PickedImage> {
  const image = await load(original.uri)
  const canvas = document.createElement("canvas")
  canvas.width = original.width
  canvas.height = original.height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Could not read the edited image.")

  const scale = drawn.width > 0 ? original.width / drawn.width : 1
  context.scale(scale, scale)
  drawScene(context, image, drawn, layers, null)

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (result) =>
        result
          ? resolve(result)
          : reject(new Error("Could not encode the image.")),
      "image/jpeg",
      QUALITY
    )
  )

  return {
    file: blob,
    uri: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    mimeType: "image/jpeg",
    fileName: (original.fileName || "image").replace(/\.\w+$/, "") + ".jpg",
  }
}
