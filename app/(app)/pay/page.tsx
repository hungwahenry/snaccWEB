import type { Metadata } from "next"
import { PayScreen } from "@/features/wallet/screens/pay-screen"
import {
  payPrefillFrom,
  prefillKey,
  type PaySearchParams,
} from "@/features/wallet/utils/pay-route"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Send money" }

type Props = { searchParams: Promise<PaySearchParams> }

export default async function PayPage({ searchParams }: Props) {
  await requireSession("/pay")
  const prefill = payPrefillFrom(await searchParams)

  return <PayScreen key={prefillKey(prefill)} prefill={prefill} />
}
