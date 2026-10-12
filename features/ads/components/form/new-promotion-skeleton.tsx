import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"
import { QuotedSnaccSkeleton } from "@/features/snaccs/components/card/quote/quoted-snacc-skeleton"
import { FORM_SECTIONS } from "../../utils/campaigns"

function FieldLabel({ width }: { width: string }) {
  return <Skeleton className={`my-1 h-3 ${width}`} />
}

function Chips({ widths }: { widths: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {widths.map((width, index) => (
        <Skeleton key={index} className={`h-9 rounded-full ${width}`} />
      ))}
    </div>
  )
}

export function NewPromotionSkeleton() {
  return (
    <div className="flex flex-col gap-8 px-5 pt-5 pb-10">
      <div className="rounded-2xl border border-border">
        <QuotedSnaccSkeleton />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <Eyebrow>{FORM_SECTIONS.audience}</Eyebrow>
          <Skeleton className="my-1 h-3 w-64" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <FieldLabel width="w-20" />
            <Skeleton className="h-12 rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel width="w-14" />
            <div className="flex flex-col divide-y divide-border/60 rounded-2xl border border-border">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="flex h-12 items-center px-4">
                  <Skeleton className="h-3.5 w-28" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel width="w-24" />
            <Chips widths={["w-20", "w-16", "w-20"]} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel width="w-14" />
            <Chips widths={["w-16", "w-20", "w-24"]} />
          </div>
        </div>
      </div>
    </div>
  )
}
