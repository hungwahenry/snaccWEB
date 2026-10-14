import type { Metadata } from "next"
import { PaymentMarketsScreen } from "@/features/admin/payment-markets/screens/payment-markets-screen"

export const metadata: Metadata = { title: "Payment markets" }

export default function Page() {
  return <PaymentMarketsScreen />
}
