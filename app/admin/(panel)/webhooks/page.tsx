import type { Metadata } from "next"
import { WebhooksScreen } from "@/features/admin/webhooks/screens/webhooks-screen"

export const metadata: Metadata = { title: "Webhooks" }

export default function Page() {
  return <WebhooksScreen />
}
