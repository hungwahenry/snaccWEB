import { Skeleton } from "@/components/ui/skeleton"
import { QuotedSnaccSkeleton } from "@/features/snaccs/components/card/quote/quoted-snacc-skeleton"
import type { ShareRef } from "@/lib/share-links"
import { LINK_CARD, LinkFooter } from "./link-card-parts"

export function LinkCardSkeleton({ link }: { link: ShareRef }) {
  return (
    <div className={LINK_CARD}>
      {link.kind === "snacc" ? (
        <QuotedSnaccSkeleton />
      ) : (
        <div className="flex items-center gap-3 p-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col">
            <Skeleton className="my-[3px] h-3.5 w-28" />
            <Skeleton className="my-0.5 h-3 w-20" />
          </div>
          {link.kind === "pay" ? (
            <Skeleton className="h-7 w-16 rounded-full" />
          ) : null}
        </div>
      )}
      <LinkFooter link={link} />
    </div>
  )
}
