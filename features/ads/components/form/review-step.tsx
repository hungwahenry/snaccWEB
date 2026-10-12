import { QuotedSnacc } from "@/features/snaccs/components/card/quote/quoted-snacc"
import type { NewPromotion } from "../../hooks/use-new-promotion"
import { SetupRows } from "../setup-rows"
import { PayFooter } from "./pay-footer"
import { PolicyNote } from "./policy-note"

export function ReviewStep({ form }: { form: NewPromotion }) {
  return (
    <>
      <QuotedSnacc snacc={form.preview} />
      <SetupRows title="Your promotion" rows={form.review} />
      <PolicyNote {...form.policy} />
      <PayFooter {...form.pay} />
    </>
  )
}
