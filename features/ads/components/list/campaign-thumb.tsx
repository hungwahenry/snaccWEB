import { MegaphoneIcon } from "lucide-react"
import { LazyImage } from "@/components/ui/lazy-image"

export function CampaignThumb({ url }: { url: string | null }) {
  return (
    <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-muted-foreground">
      {url ? (
        <LazyImage src={url} alt="" className="size-full object-cover" />
      ) : (
        <MegaphoneIcon className="size-5" aria-hidden />
      )}
    </span>
  )
}
