import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"
import { QuotedSnaccSkeleton } from "@/features/snaccs/components/card/quote/quoted-snacc-skeleton"
import { FORM_SECTIONS } from "../../utils/campaigns"

const SECTIONS = Object.values(FORM_SECTIONS)

export function NewPromotionSkeleton() {
  return (
    <div className="flex flex-col gap-8 px-5 pt-5 pb-10">
      <div className="rounded-2xl border border-border">
        <QuotedSnaccSkeleton />
      </div>

      {SECTIONS.map((title) => (
        <div key={title} className="flex flex-col gap-4">
          <Eyebrow>{title}</Eyebrow>
          <Skeleton className="h-12 rounded-full" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      ))}
    </div>
  )
}
