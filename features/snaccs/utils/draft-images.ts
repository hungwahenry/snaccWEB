import type { PickedImage } from "@/lib/media"
import type { SnaccImage } from "../types"

export type DraftImage =
  | { kind: "kept"; id: string; url: string; width: number; height: number }
  | { kind: "picked"; asset: PickedImage }

export function draftImageKey(image: DraftImage): string {
  return image.kind === "kept" ? image.id : image.asset.uri
}

export function draftImageUri(image: DraftImage): string {
  return image.kind === "kept" ? image.url : image.asset.uri
}

export function toDraftImages(images: SnaccImage[]): DraftImage[] {
  return images.map((image) => ({
    kind: "kept",
    id: image.id,
    url: image.url,
    width: image.width,
    height: image.height,
  }))
}

export function pickedAssets(images: DraftImage[]): PickedImage[] {
  return images.flatMap((image) =>
    image.kind === "picked" ? [image.asset] : []
  )
}

export function keptImageIds(images: DraftImage[]): string[] {
  return images.flatMap((image) => (image.kind === "kept" ? [image.id] : []))
}
