import type { Metadata } from "next"
import type { PayMode } from "@/features/wallet/routes"
import { PayScreen } from "@/features/wallet/screens/pay-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Send money" }

type Props = {
  searchParams: Promise<{
    mode?: string
    to?: string
    recipient?: string
    conversation?: string
    amount?: string
  }>
}

export default async function PayPage({ searchParams }: Props) {
  await requireSession("/pay")
  const params = await searchParams
  const mode: PayMode =
    params.mode === "request" || params.mode === "topup" ? params.mode : "send"

  return (
    <PayScreen
      key={`${mode}:${params.to ?? ""}:${params.recipient ?? ""}:${params.conversation ?? ""}:${params.amount ?? ""}`}
      mode={mode}
      to={params.to || undefined}
      recipientId={params.recipient || undefined}
      conversationId={params.conversation || undefined}
      amount={params.amount || undefined}
    />
  )
}
