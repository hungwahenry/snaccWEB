export interface Gif {
  id: string
  url: string
  preview_url: string | null
  width: number
  height: number
  title: string | null
}

/** What Giphy is browsed for: GIFs, or stickers (GIFs with a see-through background). */
export type GiphyKind = "gifs" | "stickers"
