import { bareLink, shareLink, type ShareRef } from "@/lib/share-links"

export const LINK_CARD =
  "overflow-hidden rounded-2xl border border-border bg-background"

export function LinkFooter({ link }: { link: ShareRef }) {
  return (
    <div className="border-t border-border px-3 py-2">
      <p className="truncate text-[11px] text-muted-foreground">
        {bareLink(shareLink[link.kind](link.ref))}
      </p>
    </div>
  )
}
