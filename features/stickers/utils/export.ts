import type { CropRect, PickedImage } from "@/lib/media"

function load(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Could not read the picture."))
    image.src = uri
  })
}

export async function exportSticker(
  image: PickedImage,
  rect: CropRect,
  size: number
): Promise<PickedImage> {
  const source = await load(image.uri)
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Could not prepare the sticker canvas.")
  context.imageSmoothingQuality = "high"
  context.drawImage(
    source,
    rect.originX,
    rect.originY,
    rect.width,
    rect.height,
    0,
    0,
    size,
    size
  )

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("Could not encode.")),
      "image/png"
    )
  )

  return {
    file: blob,
    uri: URL.createObjectURL(blob),
    width: size,
    height: size,
    mimeType: "image/png",
    fileName: "sticker.png",
  }
}
