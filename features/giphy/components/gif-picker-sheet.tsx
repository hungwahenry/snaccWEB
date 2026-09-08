import { SearchIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { Gif } from "../types"
import { GifGrid } from "./gif-grid"

type GifPickerSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  query: string
  onQueryChange: (next: string) => void
  gifs: Gif[]
  loading: boolean
  onPick: (gif: Gif) => void
}

export function GifPickerSheet({
  open,
  onOpenChange,
  query,
  onQueryChange,
  gifs,
  loading,
  onPick,
}: GifPickerSheetProps) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="GIFs"
      tall
      className="px-4"
    >
      <div className="sticky top-0 z-10 bg-popover pb-3">
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search GIPHY"
            autoFocus
            className="h-11 rounded-full pl-10"
          />
        </div>
      </div>
      {loading && gifs.length === 0 ? (
        <div className="flex justify-center py-12">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : gifs.length === 0 ? (
        <EmptyState compact title="No GIFs found." />
      ) : (
        <GifGrid gifs={gifs} onPick={onPick} />
      )}
      <p className="pt-4 pb-2 text-center text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
        Powered by GIPHY
      </p>
    </ActionSheet>
  )
}
