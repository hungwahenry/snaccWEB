export interface LightboxImage {
  url: string
  thumbUrl?: string | null
  width?: number
  height?: number
}

export interface ShownPhoto {
  url: string
  thumb_url?: string | null
  width?: number | null
  height?: number | null
}

export function toLightboxImage(photo: ShownPhoto): LightboxImage {
  return {
    url: photo.url,
    thumbUrl: photo.thumb_url ?? null,
    width: photo.width ?? undefined,
    height: photo.height ?? undefined,
  }
}
