import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PREMIUM_PATH } from "@/features/premium/routes"

/**
 * The count above the list is the true one, so this never claims more visitors than there are — it
 * says how many of the names are out of reach, which is the honest version of the same pitch.
 */
export function VisitorsUpsell({ hidden }: { hidden: number }) {
  if (hidden <= 0) return null

  return (
    <div className="m-4 flex flex-col gap-3 rounded-2xl border border-border p-4">
      <p className="text-base font-bold">
        {hidden === 1 ? "1 earlier visitor" : `${hidden} earlier visitors`}
      </p>
      <p className="text-sm text-muted-foreground">
        You can see today&apos;s. Premium shows everyone, as far back as visits
        are kept.
      </p>
      <Button render={<Link href={PREMIUM_PATH} />}>See them all</Button>
    </div>
  )
}
