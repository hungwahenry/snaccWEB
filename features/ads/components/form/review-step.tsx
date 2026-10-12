import {
  SnaccCard,
  type SnaccActionHandlers,
} from "@/features/snaccs/components/card/snacc-card"
import type { Snacc } from "@/features/snaccs/types"
import type { NewPromotion } from "../../hooks/use-new-promotion"
import { SetupRows } from "../setup-rows"
import { PayFooter } from "./pay-footer"
import { PolicyNote } from "./policy-note"

export function ReviewStep({
  form,
  handlers,
  onOpenLink,
}: {
  form: NewPromotion
  handlers: SnaccActionHandlers
  onOpenLink: (snacc: Snacc) => void
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div
          inert
          className="-mx-5 border-y border-border"
          aria-label="How your promotion will look"
        >
          <SnaccCard
            snacc={form.card}
            onOpenPromotionLink={onOpenLink}
            {...handlers}
          />
        </div>
        <p className="text-[13px] leading-5 text-pretty text-muted-foreground">
          Likes and resnaccs from people who see it as a promotion don&apos;t
          add to your Snacc Score or earnings. Everyone else&apos;s still do.
        </p>
      </div>
      <SetupRows title="Your promotion" rows={form.review} />
      <PolicyNote {...form.policy} />
      <PayFooter {...form.pay} />
    </>
  )
}
