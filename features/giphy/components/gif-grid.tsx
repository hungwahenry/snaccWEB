import { aspectRatio } from "@/lib/aspect"
import type { Gif } from "../types"

export function GifGrid({
  gifs,
  onPick,
}: {
  gifs: Gif[]
  onPick: (gif: Gif) => void
}) {
  const columns: Gif[][] = [[], []]
  gifs.forEach((gif, index) => columns[index % 2].push(gif))

  return (
    <div className="grid grid-cols-2 gap-2">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-2">
          {column.map((gif) => (
            <button
              key={gif.id}
              type="button"
              onClick={() => onPick(gif)}
              className="w-full overflow-hidden rounded-2xl bg-muted transition-opacity hover:opacity-80"
              style={{ aspectRatio: aspectRatio(gif) }}
            >
              <img
                src={gif.preview_url ?? gif.url}
                alt={gif.title ?? "GIF"}
                className="size-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
